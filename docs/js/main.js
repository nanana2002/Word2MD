// GitHub API configuration
const GITHUB_API = 'https://api.github.com';
let REPO_OWNER = null; // Will be set after token verification
const REPO_NAME = 'Word2MD';
const BRANCH = 'main';

// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const statusArea = document.getElementById('statusArea');
const fileList = document.getElementById('fileList');

// Disable file upload elements initially
function disableFileUpload() {
    dropZone.style.opacity = '0.5';
    dropZone.style.pointerEvents = 'none';
    document.getElementById('fileInput').disabled = true;
    showStatus('Please set up your GitHub token first', 'warning');
}

// Enable file upload elements after token verification
function enableFileUpload() {
    dropZone.style.opacity = '1';
    dropZone.style.pointerEvents = 'auto';
    document.getElementById('fileInput').disabled = false;
    showStatus('Ready to upload files', 'success');
}

// Token management functions
async function initializeGitHubToken() {
    disableFileUpload(); // Disable upload until token is verified
    
    const token = localStorage.getItem('github_token');
    if (!token) {
        showTokenPrompt();
        return false;
    }
    
    try {
        const response = await fetch(`${GITHUB_API}/user`, {
            headers: {
                'Authorization': `token ${token}`
            }
        });
        
        if (!response.ok) {
            localStorage.removeItem('github_token'); // Clear invalid token
            showTokenPrompt();
            return false;
        }
        
        const userData = await response.json();
        REPO_OWNER = userData.login;
        enableFileUpload(); // Enable upload after successful verification
        return true;
    } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('github_token'); // Clear invalid token
        showTokenPrompt();
        return false;
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
        initializeGitHubToken(); // Verify the new token
    } else {
        showStatus('GitHub token is required to use this converter', 'warning');
        disableFileUpload();
    }
}

function getGitHubToken() {
    const token = localStorage.getItem('github_token');
    if (!token) {
        throw new Error('GitHub token not found. Please click "Update Token" to set your token.');
    }
    return token;
}

// Event Listeners
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('active');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('active');
});

dropZone.addEventListener('drop', async (e) => {
    e.preventDefault();
    dropZone.classList.remove('active');
    
    if (!REPO_OWNER) {
        showStatus('Please set up your GitHub token first', 'warning');
        return;
    }
    
    handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', async (e) => {
    if (!REPO_OWNER) {
        showStatus('Please set up your GitHub token first', 'warning');
        return;
    }
    
    handleFiles(e.target.files);
});

// File handling functions
async function handleFiles(files) {
    if (!REPO_OWNER) {
        showStatus('GitHub token not properly initialized', 'danger');
        return;
    }
    
    showStatus('Uploading files...', 'info');
    
    for (const file of files) {
        try {
            const content = await readFileAsBase64(file);
            await uploadToGitHub(file.name, content);
            showStatus(`Uploaded ${file.name} successfully`, 'success');
        } catch (error) {
            console.error(`Error processing ${file.name}:`, error);
            showStatus(`Error processing ${file.name}: ${error.message}`, 'danger');
        }
    }
    
    await updateFileList();
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
    if (!Array.isArray(files)) {
        showStatus('No converted files available yet', 'info');
        return;
    }
    
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
    
    if (type === 'success') {
        setTimeout(() => {
            statusArea.classList.add('d-none');
        }, 5000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', initializeGitHubToken);
