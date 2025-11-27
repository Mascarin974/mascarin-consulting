// Backup and Restore System
// Handles manual and automatic backups of all application data

let autoBackups = [];
let restoreData = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadAutoBackups();

    // Start auto-backup timer (every hour)
    setInterval(performAutoBackup, 3600000); // 1 hour

    // Initial check if we missed a backup (e.g. page reload)
    checkAutoBackup();

    // Attach file input listener safely
    const fileInput = document.getElementById('restore-file-input');
    if (fileInput) {
        fileInput.addEventListener('change', function (e) {
            handleFileSelect(this);
        });
    }

    // Attach restore button listener
    const restoreBtn = document.getElementById('restore-btn');
    if (restoreBtn) {
        restoreBtn.addEventListener('click', performRestore);
    }

    // Attach custom file button listener
    const chooseFileBtn = document.getElementById('choose-file-btn');
    if (chooseFileBtn) {
        chooseFileBtn.addEventListener('click', function () {
            const fileInput = document.getElementById('restore-file-input');
            if (fileInput) fileInput.click();
        });
    }
});

// Hook into switchView to render backups list when tab is opened
const existingSwitchViewBackup = window.switchView || function () { };
window.switchView = function (view) {
    if (typeof existingSwitchViewBackup === 'function') {
        existingSwitchViewBackup(view);
    }

    if (view === 'backup') {
        renderAutoBackups();
    }
};

// ==========================================
// BACKUP FUNCTIONS
// ==========================================

function getAllData() {
    return {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: {
            appointments: JSON.parse(localStorage.getItem('mascarinAppointments') || '[]'),
            clients: JSON.parse(localStorage.getItem('mascarinClients') || '[]'),
            invoices: JSON.parse(localStorage.getItem('mascarinInvoices') || '[]'),
            requests: JSON.parse(localStorage.getItem('mascarinRequests') || '[]'),
            contacts: JSON.parse(localStorage.getItem('mascarinContacts') || '[]')
        }
    };
}

async function performManualBackup() {
    const backup = getAllData();
    const fileName = `mascarin_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    const jsonString = JSON.stringify(backup, null, 2);

    try {
        // Try using the modern File System Access API
        if (window.showSaveFilePicker) {
            const handle = await window.showSaveFilePicker({
                suggestedName: fileName,
                types: [{
                    description: 'JSON Files',
                    accept: { 'application/json': ['.json'] },
                }],
            });
            const writable = await handle.createWritable();
            await writable.write(jsonString);
            await writable.close();
            console.log('✅ Backup saved to chosen location');
            alert('✅ Sauvegarde réussie !');
        } else {
            // Fallback for browsers that don't support the API
            throw new Error('API not supported');
        }
    } catch (err) {
        // Fallback to default download method if API fails or is cancelled
        if (err.name !== 'AbortError') {
            console.log('Falling back to default download...');
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonString);
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", fileName);
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
            console.log('✅ Manual backup created (default download)');
        }
    }
}

function performAutoBackup() {
    console.log('🔄 Performing auto-backup...');
    const backup = getAllData();

    // Add to auto-backups list
    autoBackups.unshift({
        id: Date.now(),
        timestamp: backup.timestamp,
        data: backup.data
    });

    // Keep only last 24 backups to save space
    if (autoBackups.length > 24) {
        autoBackups = autoBackups.slice(0, 24);
    }

    localStorage.setItem('mascarinAutoBackups', JSON.stringify(autoBackups));
    localStorage.setItem('mascarinLastBackupTime', Date.now());

    renderAutoBackups();
    console.log('✅ Auto-backup completed');
}

function checkAutoBackup() {
    const lastBackup = localStorage.getItem('mascarinLastBackupTime');
    const now = Date.now();

    // If no backup yet or last backup > 1 hour ago
    if (!lastBackup || (now - parseInt(lastBackup)) > 3600000) {
        performAutoBackup();
    }
}

function loadAutoBackups() {
    const saved = localStorage.getItem('mascarinAutoBackups');
    if (saved) {
        try {
            autoBackups = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading auto-backups:', e);
            autoBackups = [];
        }
    }
}

function renderAutoBackups() {
    const list = document.getElementById('auto-backups-list');
    if (!list) return;

    list.innerHTML = '';

    if (autoBackups.length === 0) {
        list.innerHTML = '<p style="padding: 10px; text-align: center; color: var(--text-light);">Aucune sauvegarde automatique.</p>';
        return;
    }

    autoBackups.forEach(backup => {
        const item = document.createElement('div');
        item.style.padding = '10px';
        item.style.borderBottom = '1px solid var(--border)';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';

        const date = new Date(backup.timestamp);

        item.innerHTML = `
            <div>
                <strong>${date.toLocaleDateString()}</strong>
                <span style="color: var(--text-light); font-size: 0.9em;">${date.toLocaleTimeString()}</span>
                <div style="font-size: 0.8em; color: var(--text-light); margin-top: 4px;">
                    ${backup.data.appointments.length} RDV, ${backup.data.clients.length} Clients
                </div>
            </div>
            <div style="display: flex; gap: 5px;">
                <button class="btn-secondary" style="padding: 4px 8px; font-size: 0.8em;" onclick="downloadAutoBackup(${backup.id})">⬇️</button>
                <button class="btn-primary" style="padding: 4px 8px; font-size: 0.8em;" onclick="restoreFromAutoBackup(${backup.id})">♻️</button>
            </div>
        `;
        list.appendChild(item);
    });
}

function downloadAutoBackup(id) {
    const backup = autoBackups.find(b => b.id === id);
    if (!backup) return;

    const fullBackup = {
        timestamp: backup.timestamp,
        version: '1.0',
        data: backup.data
    };

    const fileName = `mascarin_autobackup_${new Date(backup.timestamp).toISOString().replace(/[:.]/g, '-')}.json`;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// ==========================================
// RESTORE FUNCTIONS
// ==========================================

function handleFileSelect(input) {
    console.log('📂 File selected:', input.files[0]);
    const file = input.files[0];
    if (!file) return;

    document.getElementById('selected-file-name').textContent = file.name;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            console.log('📖 File read successfully');
            const content = JSON.parse(e.target.result);
            console.log('📄 JSON parsed:', content);

            if (!content.data || !content.timestamp) {
                throw new Error('Format de fichier invalide');
            }
            restoreData = content.data;
            console.log('💾 restoreData set:', restoreData);

            const restoreBtn = document.getElementById('restore-btn');
            console.log('🔘 Restore button element:', restoreBtn);

            if (restoreBtn) {
                restoreBtn.disabled = false;
                restoreBtn.style.display = 'inline-block'; // Explicitly show the button
                restoreBtn.classList.remove('hidden');
                restoreBtn.textContent = `⚠️ Restaurer (${new Date(content.timestamp).toLocaleString()})`;
                console.log('✅ Button should be enabled now');
            } else {
                console.error('❌ Restore button not found in DOM');
            }
        } catch (err) {
            console.error('❌ Error parsing backup file:', err);
            alert('Erreur: Le fichier sélectionné n\'est pas une sauvegarde valide.');
            restoreData = null;
            const restoreBtn = document.getElementById('restore-btn');
            if (restoreBtn) {
                restoreBtn.disabled = true;
                restoreBtn.textContent = '⚠️ Restaurer les données';
            }
        }
    };
    reader.readAsText(file);
}

function performRestore() {
    console.log('performRestore called');
    console.log('restoreData:', restoreData);

    if (!restoreData) {
        console.error('restoreData is null or undefined');
        alert('Veuillez d\'abord sélectionner un fichier de sauvegarde valide.');
        return;
    }

    // Show custom modal instead of native confirm
    const modal = document.getElementById('restore-modal');
    console.log('Modal element:', modal);

    if (modal) {
        modal.style.display = 'block'; // Force display block first
        modal.classList.add('active');
        console.log('Modal classes:', modal.classList);
        console.log('Modal style display:', modal.style.display);
    } else {
        console.error('Restore modal not found in DOM');
    }
}

function closeRestoreModal() {
    const modal = document.getElementById('restore-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
    }
}

function confirmRestoreAction() {
    closeRestoreModal();
    if (restoreData) {
        applyRestore(restoreData);
    }
}

function restoreFromAutoBackup(id) {
    const backup = autoBackups.find(b => b.id === id);
    if (!backup) return;

    // For auto-backup, we can use the same modal but maybe update text?
    // For simplicity, let's just set restoreData and show the modal
    restoreData = backup.data;

    // Update modal text to be specific if needed, or just generic
    const modal = document.getElementById('restore-modal');
    if (modal) {
        modal.style.display = 'block';
        modal.classList.add('active');
    }
}

function applyRestore(data) {
    try {
        console.log('♻️ Restoring data...');

        if (data.appointments) localStorage.setItem('mascarinAppointments', JSON.stringify(data.appointments));
        if (data.clients) localStorage.setItem('mascarinClients', JSON.stringify(data.clients));
        if (data.invoices) localStorage.setItem('mascarinInvoices', JSON.stringify(data.invoices));
        if (data.requests) localStorage.setItem('mascarinRequests', JSON.stringify(data.requests));
        if (data.contacts) localStorage.setItem('mascarinContacts', JSON.stringify(data.contacts));

        // Reload all data safely
        if (typeof window.loadAppointments === 'function') window.loadAppointments();
        if (typeof window.loadClients === 'function') window.loadClients();
        if (typeof window.loadInvoices === 'function') window.loadInvoices();
        if (typeof window.loadAppointmentRequests === 'function') window.loadAppointmentRequests();
        if (typeof window.loadContactRequests === 'function') window.loadContactRequests();

        // Refresh current view
        if (typeof window.updateDashboard === 'function') window.updateDashboard();

        alert('✅ Restauration effectuée avec succès ! La page va se recharger.');
        location.reload();

    } catch (e) {
        console.error('Restore failed:', e);
        alert('Erreur lors de la restauration : ' + e.message);
    }
}

// Expose functions
window.performManualBackup = performManualBackup;
window.downloadBackup = performManualBackup;
window.handleFileSelect = handleFileSelect;
window.handleRestoreFile = handleFileSelect;
window.performRestore = performRestore;
window.downloadAutoBackup = downloadAutoBackup;
window.restoreFromAutoBackup = restoreFromAutoBackup;
window.closeRestoreModal = closeRestoreModal;
window.confirmRestoreAction = confirmRestoreAction;
window.confirmRestore = confirmRestoreAction;

console.log('✅ Backup and Restore system loaded');
