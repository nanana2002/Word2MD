// GitHub API configuration
const GITHUB_API = 'https://api.github.com';
const REPO_OWNER = ''; // TODO: Replace with your GitHub username
const REPO_NAME = 'Word2MD';
const BRANCH = 'main';

// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const statusArea = document.getElementById('statusArea');
const fileList = document.getElementById('fileList');

// Event Listeners
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('active');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('active');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('active');
    handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

// File handling functions
async function handleFiles(files) {
    showStatus('Uploading files...');
    
    for (const file of files) {
        try {
            const content = await readFileAsBase64(file);
            await uploadToGitHub(file.name, content);
        } catch (error) {
            console.error(`Error processing ${file.name}:`, error);
            showStatus(`Error processing ${file.name}: ${error.message}`, 'danger');
        }
    }
    
    await updateFileList();
    showStatus('Files uploaded successfully!', 'success');
}

function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function uploadToGitHub(filename, content) {
    const path = `uploads/${filename}`;
    const message = `Upload ${filename} for conversion`;
    
    try {
        const token = getGitHubToken();
        const response = await fetch(`${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                content,
                branch: BRANCH
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`GitHub API error: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        console.error('Upload error:', error);
        showStatus(`Upload failed: ${error.message}`, 'danger');
        throw error;
    }
}

async function updateFileList() {
    try {
        const response = await fetch(`${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/docs/converted`, {
            headers: {
                'Authorization': `token ${getGitHubToken()}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch file list');
        }

        const files = await response.json();
        renderFileList(files);
    } catch (error) {
        console.error('Error updating file list:', error);
        showStatus('Error loading file list', 'danger');
    }
}

function renderFileList(files) {
    fileList.innerHTML = '';
    files.forEach(file => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <span>${file.name}</span>
            <a href="${file.download_url}" class="btn btn-sm btn-primary" download>
                Download
            </a>
        `;
        fileList.appendChild(li);
    });
}

function showStatus(message, type = 'info') {
    statusArea.className = `alert alert-${type}`;
    statusArea.textContent = message;
    statusArea.classList.remove('d-none');
    
    if (type === 'success' || type === 'danger') {
        setTimeout(() => {
            statusArea.classList.add('d-none');
        }, 5000);
    }
}

// Token management functions
async function initializeGitHubToken() {
    const token = localStorage.getItem('github_token');
    if (!token) {
        showTokenPrompt();
    } else {
        // Verify token
        try {
            const response = await fetch(`${GITHUB_API}/user`, {
                headers: {
                    'Authorization': `token ${token}`
                }
            });
            if (!response.ok) {
                showTokenPrompt();
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            showTokenPrompt();
        }
    }
}

function showTokenPrompt() {
    const token = prompt(
        'Please enter your GitHub Personal Access Token (PAT).\n' +
        'You can generate one at: https://github.com/settings/tokens\n' +
        'Make sure to grant "repo" scope permissions.'
    );
    if (token) {
        localStorage.setItem('github_token', token);
    } else {
        showStatus('GitHub token is required for file uploads', 'danger');
    }
}

function getGitHubToken() {
    const token = localStorage.getItem('github_token');
    if (!token) {
        throw new Error('GitHub token not found. Please refresh the page and enter your token.');
    }
    return token;
}

// Call token initialization when page loads
document.addEventListener('DOMContentLoaded', initializeGitHubToken);
