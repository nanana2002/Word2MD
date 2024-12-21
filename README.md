# Word2MD Converter | 文档转换工具

一个简单的在线文档转换工具，可以将各种格式的文件转换为 Markdown 格式。基于 GitHub Pages 和 GitHub Actions 构建。

A user-friendly online document converter that transforms various file formats into Markdown. Built with GitHub Pages and GitHub Actions.

## 🌟 特性 | Features

- 🚀 简单易用的拖放上传界面 | Easy drag-and-drop upload interface
- 📝 支持多种文件格式 | Multiple file formats supported
- ⚡ 自动转换处理 | Automatic conversion
- 💾 一键下载转换结果 | One-click download of converted files

### 支持的文件格式 | Supported Formats

- 📄 PDF 文件 | PDF files
- 📘 Word 文档 (.docx, .doc) | Word documents
- 📊 PowerPoint 演示文稿 (.pptx, .ppt) | PowerPoint presentations
- 📈 Excel 表格 (.xlsx, .xls) | Excel spreadsheets
- 🖼️ 图片文件 (包含 EXIF 数据和 OCR) | Images (with EXIF data and OCR)
- 🎵 音频文件 (包含元数据和语音转写) | Audio (with metadata and transcription)
- 🌐 HTML 网页 | HTML pages
- 📋 文本格式 (CSV, JSON, XML) | Text formats

## ⚠️ 重要说明 | Important Notes

### 使用前必读 | Must Read Before Use

1. **Fork 项目（必需步骤）| Fork Repository (Required)**
   - 本工具需要在你自己的 GitHub 仓库中运行
   - This tool needs to run in your own GitHub repository
   - 👉 [点击这里 Fork 项目 | Click here to Fork](https://github.com/BH3GEI/Word2MD/fork)
   - 如果不 Fork 项目，即使提供了 GitHub Token 也无法使用
   - Without forking, the tool won't work even with a GitHub Token

2. **为什么需要 Fork？| Why Fork is Required**
   - 文件转换过程在你的 GitHub Actions 中进行
   - File conversion happens in your GitHub Actions
   - 需要向仓库写入文件的权限
   - Requires permission to write files to the repository
   - 确保你的文件安全和隐私
   - Ensures your file security and privacy

## 🚀 快速开始 | Quick Start

### 在线使用 | Online Usage

1. **Fork 项目（必需）| Fork Repository (Required)**
   - 访问 [Word2MD 项目主页](https://github.com/BH3GEI/Word2MD)
   - Visit [Word2MD Project Homepage](https://github.com/BH3GEI/Word2MD)
   - 点击 [Fork](https://github.com/BH3GEI/Word2MD/fork) 创建你的副本
   - Click [Fork](https://github.com/BH3GEI/Word2MD/fork) to create your copy

2. **启用 GitHub Pages | Enable GitHub Pages**
   - 在你 fork 的仓库中启用 GitHub Pages
   - Enable GitHub Pages in your forked repository
   - 选择 `main` 分支和 `/docs` 目录
   - Select `main` branch and `/docs` folder

3. **访问你的转换网站 | Visit Your Converter**
   - 打开 `https://[你的用户名].github.io/Word2MD`
   - Open `https://[your-username].github.io/Word2MD`
   - 示例 | Example: https://bh3gei.github.io/Word2MD

4. 设置 GitHub Token | Set up GitHub Token
   - 点击 "Update Token" 按钮 | Click the "Update Token" button
   - 按照提示创建并输入 Token | Follow prompts to create and enter your token

5. 上传文件 | Upload Files
   - 拖放文件到上传区域 | Drag and drop files to the upload area
   - 或点击 "Select Files" 按钮选择文件 | Or click "Select Files" button

6. 等待转换 | Wait for Conversion
   - 文件上传后会自动开始转换 | Conversion starts automatically after upload
   - 可以在列表中查看转换进度 | Check progress in the list

7. 下载结果 | Download Results
   - 转换完成后点击 "Download" 下载文件 | Click "Download" when conversion is complete
   - 或点击 "View" 在线预览 | Or click "View" for online preview

### 部署自己的版本 | Deploy Your Own

1. 复制仓库 | Fork Repository
   ```bash
   # 克隆仓库 | Clone the repository
   git clone https://github.com/[你的用户名]/Word2MD.git
   cd Word2MD
   ```

2. 设置 GitHub Pages | Set up GitHub Pages
   - 转到仓库设置 | Go to repository settings
   - 找到 Pages 设置 | Find Pages settings
   - 选择 `main` 分支和 `/docs` 目录 | Select `main` branch and `/docs` folder
   - 保存设置 | Save settings

3. 配置 GitHub Token | Configure GitHub Token
   - 转到 GitHub 设置 → 开发者设置 → 个人访问令牌 | Go to GitHub Settings → Developer Settings → Personal Access Tokens
   - 生成新的令牌，选择 `repo` 权限 | Generate new token with `repo` scope
   - 保存令牌备用 | Save the token for later use

## ⚠️ 注意事项 | Notes

- 文件大小限制：100MB | File size limit: 100MB
- Token 安全：请勿分享你的 GitHub Token | Token security: Never share your GitHub Token
- 转换时间：根据文件大小可能需要几秒到几分钟不等 | Conversion time: May take seconds to minutes depending on file size
- 隐私考虑：所有文件都会上传到你的 GitHub 仓库 | Privacy: All files are uploaded to your GitHub repository

## 🔧 常见问题 | Troubleshooting

1. **文件上传失败 | File Upload Failed**
   - 检查文件大小是否超过限制 | Check if file size exceeds limit
   - 确认 Token 权限是否正确 | Verify token permissions
   - 检查网络连接 | Check network connection

2. **转换失败 | Conversion Failed**
   - 确认文件格式是否支持 | Verify file format is supported
   - 检查文件是否损坏 | Check if file is corrupted
   - 查看 GitHub Actions 日志了解详情 | Check GitHub Actions logs for details

3. **找不到转换后的文件 | Cannot Find Converted File**
   - 等待几分钟让转换完成 | Wait a few minutes for conversion
   - 刷新页面 | Refresh the page
   - 检查 GitHub Actions 运行状态 | Check GitHub Actions status

## 🤝 贡献 | Contributing

欢迎提交 Pull Request 或提出建议！| Contributions are welcome!

## 📄 许可证 | License

本项目采用 MIT 许可证 | This project is licensed under the MIT License
