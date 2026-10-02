# 文章上传语法

将文件保存为 UTF-8 纯文本，扩展名为 `.article`。在 GitHub 仓库根目录，或 `content` 文件夹中上传并提交到 `main`。自动流程会检查、编译并发布；失败时旧版网站继续可用，错误原因见 Actions → Compile articles and publish → build。

## 所有文件的开头

```text
---
id: my-article-2026
title: 文章标题
type: article
section: essays
source: 作者，作品名，年份
---
这里开始写正文。

空一行开始新段落。
```

- `id`、`title`、`type` 必填。字段与内容用英文冒号 `:` 分隔。
- `id` 是文章的固定编号，仅使用小写字母、数字和连字符；不同文章不能重复。修改文章时保留原 `id`，覆盖同一个源文件。
- `title` 为页面标题；`source` 为文末浅灰色、斜体、右对齐出处，可省略。
- `section` 可选：`english` 英语 / `papers` 论文 / `physics` 物理 / `math` 数学 / `essays` 随笔 / `notes` 笔记。省略时为 `english`。英语练习题使用 `english`；数学、物理试卷使用 `exam`，其他文章使用 `article`。
- `source_url` 可选：出处的完整 `https://...` 链接，需同时填写 `source`。
- `order` 可选：非负整数，上传文章之间按该数字排序，再按 `id` 排序。默认 `1000`；网站原有文章在前。
- `lang` 可选：`en` / `zh-CN` / `ja`；英语板块默认 `en`，其他默认 `zh-CN`。
- 元信息不使用引号，不支持 YAML 列表或多行字段；字段内容写在同一行。正文按原文写，空行分段。正文中的 HTML 按普通文字显示，不执行脚本。

## 1. 普通文章：`article`

写完开头后直接写正文，不需要题目或答案区块。论文、随笔、笔记使用此类型。

公式写成 `$E=mc^2$`；独立公式写成 `$$E=mc^2$$`。金额中的美元符号写成 `\$`。公式会在发布前用网站的 KaTeX 自动检查。

## 2. 语法填空：`cloze`

正文中以 `{{题号}}` 标记输入框；答案区每行写 `题号: 答案`。

```text
---
id: cloze-example
title: A Short Passage
type: cloze
source: 原文出处
---
She {{1}} [be] here. They arrived {{2}} noon.

:::answers
1: is
2: at
```

填空编号不能重复，必须与答案一一对应。答案是单个词或短语，不使用 `/` 写多个备选答案。核对会忽略大小写、首尾空格和重复空格。

## 3. 阅读单选：`choice`

先写文章原文，再写题目区。每题开头为 `:::question 题号 / 正确答案字母`，选项每行一个。

```text
---
id: reading-example
title: A Short Passage
type: choice
source: 原文出处
---
She arrived at noon.

:::question 1 / B
When did she arrive?
A: In the morning.
B: At noon.
C: At night.

:::question 2 / A
Who arrived?
A: She did.
B: Nobody did.
```

题号不能重复；选项从 A 开始连续排列，至少两个。答案字母大写。斜杠左右各空一格。题型与原文会沿用网站样式。

## 4. 每段错误单选：`errors`

每段开头写题号和正确答案；原文中用 `[[A|标记原文]]` 标记浅灰色可选框。

```text
---
id: errors-example
title: Grammar in Context
type: errors
source: 原文出处
---
:::question 22 / B
[[A|She]] [[B|are]] [[C|at home]].

:::question 23 / A
[[A|They is]] [[B|ready]] [[C|to leave]].
```

每段从 A 开始连续标记，不需要另写选项。每段只能选择一项；选中为蓝色，核对后正确为绿色、错误为红色。不添加注释或详解。

## 5. 错误多选：`multiple`

全文标记从 1 开始连续编号；末尾用空格列出有错误的项。

```text
---
id: multiple-example
title: Grammar Selection
type: multiple
source: 原文出处
---
[[1|She are here]]. [[2|They are ready]].

:::answers
1
```

例如答案为 1、8、11，写 `1 8 11`。不使用逗号或斜杠。文章会显示可选择的浅灰框。

## 6. 数学、物理试卷：`exam`

设置 `type: exam`、`section: math` 或 `section: physics`。大题用 `:::problem 1` 从 1 开始连续编号，小题用 `:::part （1）`，答案用 `:::answer`。证明题省略答案区块，页面也不会出现答案按钮。正文中的公式仍使用 `$...$` 或 `$$...$$`。

```text
---
id: math-example
title: 数学试卷
type: exam
section: math
---
:::problem 1
设 $x$ 为实数。
:::part （1）
求 $x$。
:::answer
$x=1$
:::part （2）
证明 $x>0$。
```

本类型支持题干、公式与可折叠答案；不上传 PDF，也不自动生成图形。

## 上传、修改与删除

1. 复制模板，修改标题、固定编号、原文和答案。
2. 保存为 `.article`，上传仓库根目录或 `content` 文件夹，提交到 `main`。
3. Actions 成功后，文章自动出现。源文件、模板、答案区与编译器不会作为网页内容显示。

修改时覆盖原文件；删除时删除该 `.article` 文件并提交。源内容变更后，该文章以前保存的作答会清空，避免使用旧答案。修改 `id` 代表另一篇文章。

## 本地编译（可选）

无需安装 Python 第三方库。在仓库根目录运行：

```sh
python3 compiler.py
python3 compiler.py --build _site
node validate-math.cjs _site/compiled-articles.json
```

第一条只检查格式；第二条生成静态网站；第三条验证公式。正常上传使用自动流程即可。
