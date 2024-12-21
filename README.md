# Word2MD

A GitHub Pages website that automatically converts various file formats to Markdown using GitHub Actions and the `markitdown` package.

## Features

- Drag-and-drop file upload interface
- Supports multiple file formats (PDF, Word, PowerPoint, Excel, Images, etc.)
- Automatic conversion to Markdown using GitHub Actions
- Download converted files directly from the website

## Setup Instructions

1. **Fork and Clone the Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Word2MD.git
   cd Word2MD
   ```

2. **Configure GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages" under "Code and automation"
   - Set the source branch to `main` and the folder to `/docs`
   - Save the settings

3. **Configure GitHub Token**
   - Generate a new Personal Access Token (PAT):
     - Go to GitHub Settings → Developer Settings → Personal Access Tokens
     - Generate a new token with `repo` scope
   - Store the token securely (you'll need to add it to the website later)

4. **Update Configuration**
   - Open `docs/js/main.js`
   - Replace the `REPO_OWNER` constant with your GitHub username
   - Save the changes

5. **Create Required Directories**
   ```bash
   mkdir uploads
   mkdir docs/converted
   ```

6. **Push Changes**
   ```bash
   git add .
   git commit -m "Initial setup"
   git push
   ```

## Usage

1. Visit your GitHub Pages site at `https://YOUR_USERNAME.github.io/Word2MD`
2. When prompted, enter your GitHub token
3. Upload files using the drag-and-drop interface or file selector
4. Wait for the conversion process to complete
5. Download the converted Markdown files from the list

## Limitations

- Maximum file size: 100 MB (GitHub limitation)
- Supported file formats:
  - PDF
  - PowerPoint
  - Word
  - Excel
  - Images (EXIF metadata and OCR)
  - Audio (EXIF metadata and speech transcription)
  - HTML
  - Text-based formats (CSV, JSON, XML)
  - ZIP files

## Security Notes

- The GitHub token is stored in your browser's local storage
- Never share your GitHub token
- Consider implementing a more secure token storage solution for production use

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
