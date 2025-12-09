const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('file-list');
const optimizeBtn = document.getElementById('optimize-btn');
const statusMessage = document.getElementById('status-message');

let selectedFiles = [];

// Event Listeners Drag & Drop
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    handleFiles(e.dataTransfer.files);
});

// Click su dropzone
dropZone.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', () => {
    handleFiles(fileInput.files);
    fileInput.value = ''; // Reset per permettere di riselezionare lo stesso file
});

// Gestione File
function handleFiles(files) {
    const validFiles = Array.from(files).filter(file =>
        ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
    );

    if (validFiles.length === 0 && files.length > 0) {
        alert('Per favore seleziona solo immagini JPG o PNG.');
        return;
    }

    selectedFiles = [...selectedFiles, ...validFiles];
    renderFileList();
    updateButtonState();
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    renderFileList();
    updateButtonState();
}

function updateButtonState() {
    optimizeBtn.disabled = selectedFiles.length === 0;
}

function formatSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function renderFileList() {
    fileList.innerHTML = '';
    selectedFiles.forEach((file, index) => {
        const ext = file.name.split('.').pop().toUpperCase();
        const item = document.createElement('div');
        item.className = 'file-item';
        item.innerHTML = `
            <div class="file-info">
                <div class="file-icon">${ext}</div>
                <div class="file-details">
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${formatSize(file.size)}</span>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFile(${index})">&times;</button>
        `;
        fileList.appendChild(item);
    });
}

// Invio al Backend
optimizeBtn.addEventListener('click', async () => {
    if (selectedFiles.length === 0) return;

    // UI Loading
    optimizeBtn.disabled = true;
    statusMessage.className = 'status-toast loading';
    statusMessage.textContent = '⏳ Ottimizzazione in corso... attendere prego.';
    statusMessage.classList.remove('hidden');

    const formData = new FormData();

    // Aggiungi parametri configurazione
    formData.append('maxWidth', document.getElementById('maxWidth').value);
    formData.append('qualityJpg', document.getElementById('qualityJpg').value);
    formData.append('qualityWebp', document.getElementById('qualityWebp').value);

    selectedFiles.forEach(file => {
        formData.append('images', file);
    });

    try {
        const response = await fetch('/api/optimize', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Errore durante l\'ottimizzazione');
        }

        // Gestione Download ZIP
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'immagini-ottimizzate.zip';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);

        // UI Success
        statusMessage.className = 'status-toast success';
        statusMessage.textContent = '✅ Ottimizzazione completata! Il download dovrebbe partire automaticamente.';

        // Reset dopo successo (opzionale)
        selectedFiles = [];
        renderFileList();

    } catch (error) {
        console.error(error);
        statusMessage.className = 'status-toast error';
        statusMessage.textContent = `❌ Errore: ${error.message}`;
        optimizeBtn.disabled = false;
    }
});

// Esponi removeFile globalmente per l'onclick inline
window.removeFile = removeFile;
