import tempfile
import unittest
from pathlib import Path
from compiler import CompileError, parse_article, compile_all, build


def source(kind, body, extra=''):
    return f'---\nid: test-article\ntitle: Test\ntype: {kind}\n{extra}---\n{body}'

class CompilerTests(unittest.TestCase):
    def test_exam_optional_proof_answers(self):
        a=parse_article(source('exam',':::problem 1\n设 $x$ 为实数。\n:::part （1）\n求 $x$。\n:::answer\n$x=1$\n:::part （2）\n证明 $x>0$。', 'section: math\n'))
        self.assertEqual(a['problems'][0]['parts'][0]['answer'], '$x=1$')
        self.assertIsNone(a['problems'][0]['parts'][1]['answer'])
        for body in (':::problem 2\n:::part （1）\n题干', ':::answer\n答案', ':::problem 1\n:::part （1）\n题干\n:::answer', ':::problem 1\n:::part （1）\n$未闭合'):
            with self.subTest(body=body),self.assertRaises(CompileError):
                parse_article(source('exam',body,'section: math\n'))
    def test_article_text_and_source(self):
        a=parse_article(source('article','日本語の文章。\n\n$E=mc^2$', 'section: papers\nsource: 出典\n'))
        self.assertEqual(a['section'],'papers');self.assertEqual(a['source'],'出典')
        self.assertEqual(a['questions'],[])
    def test_cloze(self):
        a=parse_article(source('cloze','He {{2}}. I {{1}}.\n:::answers\n1: am\n2: is'))
        self.assertEqual(a['passage'],'He (2) _____. I (1) _____.')
        self.assertEqual([q['answer'] for q in a['questions']],['is','am'])
    def test_choice(self):
        a=parse_article(source('choice','Original passage.\n:::question 3 / B\nQuestion?\nA: One\nB: Two'))
        self.assertEqual(a['questions'][0]['answer'],1)
    def test_errors(self):
        a=parse_article(source('errors',':::question 22 / B\n[[A|He]] [[B|are]] here.\n:::question 23 / A\n[[A|She go]] [[B|home]].'))
        self.assertEqual(a['questions'][0]['passage'],'[[option-0]] [[option-1]] here.')
        self.assertEqual([q['answer'] for q in a['questions']],[1,0])
    def test_multiple(self):
        a=parse_article(source('multiple','[[1|One]] and [[2|Two]].\n:::answers\n2'))
        self.assertEqual([q['answer'] for q in a['questions']],[False,True])
    def test_invalid_sources(self):
        bad=[source('oops','Text'),source('cloze','{{1}}\n:::answers\n2: is'),
             source('errors',':::question 1 / C\n[[A|a]] [[B|b]]'),
             source('errors',':::question 1 / A\n[[A|a]] [[A|b]]'),
             source('errors',':::question 1 / A\n[[A|a]] [[C|c]]'),
             source('multiple','[[1|a]] [[2|b]]\n:::answers\n3'),
             source('multiple','[[1|a]]\n:::answers\n1 1'),
             source('article','$unclosed'),source('article','Text','source_url: javascript:alert(1)\n'),
             source('choice',':::question 1 / A\nQ\nA: a\nC: c'),
             source('errors',':::question 1/A\n[[A|a]] [[B|b]]'),
             source('article','Text','title: Duplicate\n')]
        for text in bad:
            with self.subTest(text=text),self.assertRaises(CompileError):parse_article(text)
    def test_revision_changes(self):
        self.assertNotEqual(parse_article(source('article','A'))['revision'],parse_article(source('article','B'))['revision'])
    def test_duplicate_ids_and_build(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d);(root/'one.article').write_text(source('article','Text'))
            (root/'two.article').write_text(source('article','Other'))
            with self.assertRaises(CompileError):compile_all(root)
            (root/'two.article').unlink();a=compile_all(root)
            (root/'index.html').write_text('<script src="./app.js"></script>')
            (root/'app.js').write_text('console.log(1)')
            out=root/'_site';build(root,out,a)
            self.assertIn('?v=',(out/'index.html').read_text())
            self.assertFalse((out/'one.article').exists())
            self.assertTrue((out/'compiled-articles.js').exists())

if __name__=='__main__':unittest.main()
