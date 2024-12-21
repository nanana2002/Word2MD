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
const conversionStatus = new Map();

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
            conversionStatus.set(file.name, 'uploading');
            showStatus(`Uploaded ${file.name}, waiting for conversion...`, 'info');
            // Start checking conversion status
            checkConversionStatus(file.name);
        } catch (error) {
            console.error(`Error processing ${file.name}:`, error);
            showStatus(`Error processing ${file.name}: ${error.message}`, 'danger');
            conversionStatus.set(file.name, 'error');
        }
    }
    
    updateFileList();
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

// Check conversion status periodically
async function checkConversionStatus(filename) {
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes maximum (10 seconds * 30)
    
    const checkStatus = async () => {
        try {
            const response = await fetch(`${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/docs/converted/${filename.replace(/\.[^/.]+$/, '')}.md`, {
                headers: {
                    'Authorization': `token ${getGitHubToken()}`
                }
            });

            if (response.ok) {
                // File exists, conversion completed
                conversionStatus.set(filename, 'completed');
                showStatus(`${filename} has been converted successfully!`, 'success');
                updateFileList();
                return;
            }
            
            attempts++;
            if (attempts >= maxAttempts) {
                conversionStatus.set(filename, 'timeout');
                showStatus(`Conversion timeout for ${filename}. Please check GitHub Actions.`, 'warning');
                return;
            }
            
            // Check again in 10 seconds
            setTimeout(checkStatus, 10000);
        } catch (error) {
            console.error('Error checking conversion status:', error);
            if (attempts >= maxAttempts) {
                conversionStatus.set(filename, 'error');
                showStatus(`Error checking conversion status for ${filename}`, 'danger');
            } else {
                setTimeout(checkStatus, 10000);
            }
        }
    };
    
    // Start checking
    setTimeout(checkStatus, 5000); // First check after 5 seconds
}

async function updateFileList() {
    try {
        const response = await fetch(`${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/docs/converted`, {
            headers: {
                'Authorization': `token ${getGitHubToken()}`
            }
        });

        if (response.status === 404) {
            fileList.innerHTML = '<li class="list-group-item text-muted">No converted files available yet</li>';
            return;
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch file list: ${response.statusText}`);
        }

        const files = await response.json();
        renderFileList(files);
    } catch (error) {
        console.error('Error updating file list:', error);
        if (error.message.includes('404')) {
            fileList.innerHTML = '<li class="list-group-item text-muted">No converted files available yet</li>';
        } else {
            showStatus('Error loading file list: ' + error.message, 'warning');
        }
    }
}

function renderFileList(files) {
    fileList.innerHTML = '';
    
    // Filter out .gitkeep file
    const markdownFiles = Array.isArray(files) ? 
        files.filter(file => file.name !== '.gitkeep' && file.name.endsWith('.md')) : [];
    
    if (markdownFiles.length === 0) {
        fileList.innerHTML = '<li class="list-group-item text-muted">No converted files available yet</li>';
        return;
    }
    
    // Sort files by name
    markdownFiles.sort((a, b) => a.name.localeCompare(b.name));
    
    markdownFiles.forEach(file => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        
        // Get original filename (without .md extension)
        const originalName = file.name.replace('.md', '');
        
        // Get conversion status if available
        const status = conversionStatus.get(originalName) || 'unknown';
        
        // Status badge
        let statusBadge = '';
        switch (status) {
            case 'uploading':
                statusBadge = '<span class="badge bg-info">Converting...</span>';
                break;
            case 'completed':
                statusBadge = '<span class="badge bg-success">Completed</span>';
                break;
            case 'error':
                statusBadge = '<span class="badge bg-danger">Error</span>';
                break;
            case 'timeout':
                statusBadge = '<span class="badge bg-warning">Timeout</span>';
                break;
        }
        
        li.innerHTML = `
            <div class="d-flex align-items-center">
                <span class="me-3">${file.name}</span>
                ${statusBadge}
            </div>
            <div class="btn-group">
                <a href="${file.download_url}" class="btn btn-sm btn-primary" download target="_blank">
                    Download
                </a>
                <a href="${file.html_url}" class="btn btn-sm btn-secondary" target="_blank">
                    View
                </a>
            </div>
        `;
        fileList.appendChild(li);
    });
    
    // Add conversion status for files still processing
    conversionStatus.forEach((status, filename) => {
        if (status === 'uploading' && !markdownFiles.some(f => f.name === `${filename}.md`)) {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <div class="d-flex align-items-center">
                    <span class="me-3">${filename}</span>
                    <span class="badge bg-info">Converting...</span>
                </div>
                <div class="spinner-border spinner-border-sm text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            `;
            fileList.appendChild(li);
        }
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
