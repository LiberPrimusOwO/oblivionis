# oblivionis

文章、英语练习与物理题目。

上传 UTF-8 `.article` 文件到仓库根目录或 `content` 文件夹，提交到 `main`，即可自动检查、编译和发布。

语法说明见 [ARTICLE-SYNTAX.md](ARTICLE-SYNTAX.md)。五份 `template-*.txt` 是写作模板，使用时改为 `.article` 扩展名。

编译器为 `compiler.py`，只依赖 Python 标准库；公式使用随仓库提供的 KaTeX 检查。编译失败时不发布，上一版网站保持可用。

GitHub Pages 使用 GitHub Actions 发布；自定义域名保留在 Settings → Pages 中。
