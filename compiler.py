#!/usr/bin/env python3
"""Compile UTF-8 .article files into validated oblivionis article data."""
import argparse
import hashlib
import json
import re
import shutil
import sys
import subprocess
from pathlib import Path

TYPES = {'article', 'cloze', 'choice', 'errors', 'multiple', 'exam'}
SECTIONS = {'english', 'essays', 'notes', 'papers', 'physics', 'math'}
FIELDS = {'id', 'title', 'type', 'section', 'source', 'source_url', 'order', 'lang'}
INLINE = re.compile(r'\[\[([^|\]\n]+)\|([^\]\n]+)\]\]')
QSTART = re.compile(r'^:::question ([1-9]\d*) / ([A-Z])$')

class CompileError(ValueError):
    pass

def require(ok, message):
    if not ok:
        raise CompileError(message)

def inline(text, numbered=False):
    matches = list(INLINE.finditer(text))
    require(matches, '正文没有标记选项：使用 [[A|原文]] 或 [[1|原文]]')
    keys = [m[1] for m in matches]
    require(len(keys) == len(set(keys)), '同一段中选项标记重复')
    expected = [str(i + 1) if numbered else chr(65 + i) for i in range(len(keys))]
    require(keys == expected, '选项必须按顺序连续标记，从 1 或 A 开始')
    require(numbered or 2 <= len(keys) <= 26, '每道单选题需要 2 至 26 个选项')
    require(all(m[2].strip() for m in matches), '选项原文不能为空')
    converted = INLINE.sub(lambda m: '[[error-' + m[1] + ']]' if numbered else '[[option-' + str(ord(m[1]) - 65) + ']]', text)
    require(not re.search(r'\[\[(?!error-\d+\]\]|option-\d+\]\])|(?<!\d)\]\]', converted), '选项标记格式不完整')
    return converted, [m[2] for m in matches]

def question_blocks(body):
    blocks = []
    current = None
    prefix = []
    for line in body.splitlines():
        if line.startswith(':::question'):
            m = QSTART.fullmatch(line)
            require(m, '题目开头必须写成 :::question 22 / B（斜杠左右各一个空格）')
            current = {'number': int(m[1]), 'answer': ord(m[2]) - 65, 'lines': []}
            blocks.append(current)
        elif current is None:
            prefix.append(line)
        else:
            current['lines'].append(line)
    require(blocks, '没有题目：使用 :::question 题号 / 答案字母')
    require(len({b['number'] for b in blocks}) == len(blocks), '题号重复')
    return '\n'.join(prefix).strip(), blocks

def split_answers(body):
    require(body.splitlines().count(':::answers') == 1, '需要且只能有一个 :::answers 区块')
    return tuple(s.strip() for s in re.split(r'^:::answers$', body, flags=re.M))

def check_text(text):
    require('\x00' not in text, '不允许 NUL 字符')
    require(not re.search(r'^:::', text, re.M), '未知区块指令')
    # Currency dollar signs must be escaped; paired delimiters are validated here.
    tokens = list(re.finditer(r'(?<!\\)\$\$?', text))
    i = 0
    while i < len(tokens):
        require(i + 1 < len(tokens) and tokens[i][0] == tokens[i + 1][0], 'LaTeX 的 $ 或 $$ 没有成对闭合；金额写成 \\$')
        require(text[tokens[i].end():tokens[i + 1].start()].strip(), 'LaTeX 公式不能为空')
        i += 2

def exam_blocks(body):
    problems = []
    problem = part = None
    target = None
    for line in body.splitlines():
        if line.startswith(':::problem'):
            m = re.fullmatch(r':::problem ([1-9]\d*)', line)
            require(m, '大题开头写成 :::problem 1')
            problem = {'number': int(m[1]), 'introduction': [], 'parts': []}
            problems.append(problem)
            part = None
            target = problem['introduction']
        elif line.startswith(':::part'):
            m = re.fullmatch(r':::part (\S.+|\S)', line)
            require(problem is not None and m, '小题开头写成 :::part （1），且必须位于大题中')
            part = {'label': m[1], 'text': [], 'answer': None}
            problem['parts'].append(part)
            target = part['text']
        elif line == ':::answer':
            require(part is not None and part['answer'] is None, '答案必须位于小题中，且不可重复')
            part['answer'] = []
            target = part['answer']
        else:
            require(not line.startswith(':::'), '未知试卷区块指令')
            require(target is not None or not line.strip(), '试卷正文必须以 :::problem 开始')
            if target is not None:
                target.append(line)
    require(problems, '试卷没有大题')
    require([p['number'] for p in problems] == list(range(1, len(problems) + 1)), '大题必须从 1 开始连续编号')
    for p in problems:
        p['introduction'] = '\n'.join(p['introduction']).strip()
        require(p['parts'], f"第 {p['number']} 题没有小题")
        require(len({s['label'] for s in p['parts']}) == len(p['parts']), '小题标记重复')
        for s in p['parts']:
            s['text'] = '\n'.join(s['text']).strip()
            require(s['text'], '小题题干不能为空')
            if s['answer'] is not None:
                s['answer'] = '\n'.join(s['answer']).strip()
                require(s['answer'], '答案区块不能为空；证明题请省略 :::answer')
            for value in (s['text'], s['answer'] or ''):
                check_text(value)
        check_text(p['introduction'])
    return problems

def parse_article(text, filename='article.article'):
    lines = text.lstrip('\ufeff').replace('\r\n', '\n').splitlines()
    require(lines and lines[0] == '---', '文件必须以 --- 元信息区块开始')
    try:
        end = lines.index('---', 1)
    except ValueError:
        raise CompileError('元信息区块缺少结束的 ---')
    meta = {}
    for number, line in enumerate(lines[1:end], 2):
        if not line.strip():
            continue
        require(':' in line, f'第 {number} 行：元信息需要 字段: 内容')
        key, value = line.split(':', 1)
        key, value = key.strip(), value.strip()
        require(key in FIELDS, f'第 {number} 行：未知字段 {key}')
        require(key not in meta, f'第 {number} 行：字段 {key} 重复')
        meta[key] = value
    for key in ('id', 'title', 'type'):
        require(meta.get(key), f'缺少 {key}')
    require(re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', meta['id']), 'id 只能含小写英文字母、数字、单个连字符')
    require(meta['type'] in TYPES, 'type 必须是 article / cloze / choice / errors / multiple / exam')
    section = meta.get('section', 'english')
    require(section in SECTIONS, 'section 必须是 english / essays / notes / papers / physics / math')
    require(meta['type'] in {'article', 'exam'} or section == 'english', '英语练习题放在 english 板块')
    require(meta['type'] != 'exam' or section in {'math', 'physics'}, 'exam 放在 math 或 physics 板块')
    lang = meta.get('lang', 'en' if section == 'english' else 'zh-CN')
    require(lang in {'en', 'zh-CN', 'ja'}, 'lang 必须是 en / zh-CN / ja')
    if meta.get('source_url'):
        require(meta.get('source'), 'source_url 需要同时填写 source')
        require(re.fullmatch(r'https?://[^\s]+', meta['source_url']), 'source_url 必须是 http 或 https 地址')
    order = meta.get('order', '1000')
    require(re.fullmatch(r'\d+', order), 'order 必须是非负整数')
    body = '\n'.join(lines[end + 1:]).strip()
    require(body, '正文不能为空')
    a = {'id': meta['id'], 'title': meta['title'], 'section': section, 'lang': lang,
         'source': meta.get('source', ''), 'sourceUrl': meta.get('source_url', ''),
         'order': int(order), 'questions': [], 'passage': ''}
    kind = meta['type']
    if kind == 'exam':
        a['type'] = 'exam'
        a['problems'] = exam_blocks(body)
    elif kind == 'article':
        a['type'] = 'article'
        a['passage'] = body
        require(not any(x in body for x in ('[[', ']]', '{{', '}}')), '纯文章不能包含题目标记')
    elif kind == 'cloze':
        passage, answers = split_answers(body)
        numbers = re.findall(r'\{\{([1-9]\d*)\}\}', passage)
        require(numbers and len(numbers) == len(set(numbers)), '填空编号不能为空或重复')
        values = {}
        for line in answers.splitlines():
            m = re.fullmatch(r'([1-9]\d*):\s*(.+)', line)
            require(m, '答案写成 1: answer，每个答案单独一行')
            require(m[1] not in values, '填空答案编号重复')
            values[m[1]] = m[2].strip()
        require(set(numbers) == set(values), '填空标记与答案编号必须一一对应')
        a['passage'] = re.sub(r'\{\{([1-9]\d*)\}\}', lambda m: '(' + m[1] + ') _____', passage)
        require('{{' not in a['passage'] and '}}' not in a['passage'], '填空标记格式不完整')
        a['questions'] = [{'id': a['id'] + '-q' + n, 'type': 'text', 'prompt': 'Blank (' + n + ')', 'answer': values[n]} for n in numbers]
    elif kind in {'choice', 'errors'}:
        prefix, blocks = question_blocks(body)
        require(kind != 'errors' or not prefix, 'errors 正文必须直接以 :::question 开始')
        a['passage'] = prefix
        if kind == 'errors':
            a['type'] = 'paragraph-errors'
        for b in blocks:
            content = '\n'.join(b['lines']).strip()
            require(content, f"第 {b['number']} 题正文为空")
            q = {'id': a['id'] + '-q' + str(b['number']), 'number': b['number'], 'type': 'choice', 'answer': b['answer']}
            if kind == 'errors':
                q['passage'], q['options'] = inline(content)
            else:
                prompt, options, labels = [], [], []
                for line in content.splitlines():
                    m = re.fullmatch(r'([A-Z]):\s*(.+)', line)
                    if m:
                        labels.append(m[1]); options.append(m[2].strip())
                    else:
                        require(not options or not line.strip(), '选项开始后只能继续写选项；每个选项写在一行')
                        prompt.append(line)
                require(labels == [chr(65 + i) for i in range(len(labels))] and 2 <= len(options) <= 26, '单选选项必须从 A 开始连续标记，至少两个')
                q['prompt'] = '\n'.join(prompt).strip()
                require(q['prompt'], '选择题题干不能为空')
                q['options'] = options
            require(q['answer'] < len(q['options']), f"第 {b['number']} 题答案超出选项范围")
            a['questions'].append(q)
    else:
        passage, answer_text = split_answers(body)
        a['type'] = 'error-selection'
        a['passage'], options = inline(passage, numbered=True)
        require(re.fullmatch(r'[1-9]\d*(?:\s+[1-9]\d*)*', answer_text), '多选答案写成 1 8 11，用空格分隔')
        selected = [int(n) for n in answer_text.split()]
        require(len(selected) == len(set(selected)), '多选答案重复')
        require(set(selected) <= set(range(1, len(options) + 1)), '多选答案超出标记范围')
        a['questions'] = [{'id': a['id'] + '-q' + str(i), 'number': i, 'type': 'error', 'prompt': o, 'answer': i in selected} for i, o in enumerate(options, 1)]
    for value in [a['passage']] + [q.get('passage', q.get('prompt', '')) for q in a['questions']] + [o for q in a['questions'] for o in q.get('options', [])]:
        check_text(value)
    a['revision'] = hashlib.sha256(json.dumps(a, ensure_ascii=False, sort_keys=True).encode()).hexdigest()[:16]
    return a

def compile_all(root):
    paths = sorted(set(root.glob('*.article')) | set((root / 'content').rglob('*.article')))
    result, seen = [], set()
    # Protect existing built-in ids from accidental overwrites.
    builtin = {'artist-style-and-mindset', 'north-richmond-street', 'i-wished-for-a-new-land', 'aesthetic-image-grammar-errors'}
    for datafile in ('papers-data.js', 'physics-data.js'):
        if (root / datafile).exists():
            builtin.update(re.findall(r'"id"\s*:\s*"([^"]+)"', (root / datafile).read_text(encoding='utf-8')))
    for path in paths:
        try:
            a = parse_article(path.read_text(encoding='utf-8'), path.name)
            require(a['id'] not in seen | builtin, 'id 与另一篇文章或网站原有文章重复')
            seen.add(a['id']); result.append(a)
        except (CompileError, UnicodeError) as e:
            raise CompileError(f'{path.relative_to(root)}: {e}')
    return sorted(result, key=lambda a: (a['order'], a['id']))

def build(root, target, articles):
    require(target.resolve() != root.resolve(), '输出目录不能是仓库根目录')
    target.mkdir(parents=True, exist_ok=True)
    for path in root.iterdir():
        if path.is_file() and (path.suffix in {'.html', '.css', '.js', '.woff', '.woff2', '.ttf', '.svg', '.webp', '.png', '.jpg', '.ico'} or path.name in {'CNAME', '.nojekyll'}):
            shutil.copy2(path, target / path.name)
    data = json.dumps(articles, ensure_ascii=False, separators=(',', ':'))
    (target / 'compiled-articles.js').write_text('const COMPILED_ARTICLES=' + data + ';\n', encoding='utf-8')
    (target / 'compiled-articles.json').write_text(data, encoding='utf-8')
    index = (target / 'index.html').read_text(encoding='utf-8')
    def version(m):
        path = target / m[2]
        if path.is_file():
            digest = hashlib.sha256(path.read_bytes()).hexdigest()[:16]
            return m[1] + m[2] + '?v=' + digest + m[3]
        return m[0]
    index = re.sub(r'((?:src|href)="\./)([^"?]+\.(?:js|css))(?:\?[^" ]*)?(")', version, index)
    (target / 'index.html').write_text(index, encoding='utf-8')
    if (root / 'build-routes.cjs').exists():
        subprocess.run(['node', str((root / 'build-routes.cjs').resolve()), str(target.resolve())], check=True)

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--root', type=Path, default=Path(__file__).resolve().parent)
    p.add_argument('--build', type=Path)
    p.add_argument('--output', type=Path)
    args = p.parse_args()
    try:
        articles = compile_all(args.root)
        if args.build:
            build(args.root, args.build, articles)
        if args.output:
            args.output.write_text('const COMPILED_ARTICLES=' + json.dumps(articles, ensure_ascii=False) + ';\n', encoding='utf-8')
        print(f'检查通过：{len(articles)} 篇文章，{sum(len(a["questions"]) for a in articles)} 道题目')
    except (CompileError, OSError) as e:
        print(f'编译失败：{e}', file=sys.stderr)
        return 1
    return 0

if __name__ == '__main__':
    sys.exit(main())
