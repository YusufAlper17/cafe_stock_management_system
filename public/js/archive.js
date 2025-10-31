// Archive functionality
let archives = [];

// Initialize archive page
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const auth = Auth.checkAuth();
        if (!auth) return;

        await loadArchives();
        setupEventListeners();
    } catch (error) {
        console.error('Error initializing archive page:', error);
        ToastNotification.error('Arşiv sayfası yüklenirken hata oluştu');
    }
});

// Load archives
async function loadArchives() {
    try {
        const auth = Auth.checkAuth();
        if (!auth) return;

        const response = await fetch('/api/archives', {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error loading archives');
        }

        const data = await response.json();
        archives = data.archives || [];
        displayArchives(archives);
        updateArchiveStats(archives);
    } catch (error) {
        console.error('Error loading archives:', error);
        ToastNotification.error('Arşivler yüklenirken hata oluştu');
    }
}

// Display archives in table
function displayArchives(archives) {
    const tbody = document.getElementById('archivesTableBody');
    tbody.innerHTML = '';

    if (archives.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4">
                    <div class="text-muted">
                        <i class="bi bi-archive fs-1 d-block mb-2"></i>
                        <p class="mb-0">Henüz arşiv bulunmuyor</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    archives.forEach(archive => {
        const tr = document.createElement('tr');
        const createdDate = new Date(archive.archived_at);
        const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                           'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        
        tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <i class="bi bi-file-zip text-primary me-2"></i>
                    <span class="fw-medium">${monthNames[archive.month - 1]} ${archive.year}</span>
                </div>
            </td>
            <td>
                <span class="badge bg-primary">Aylık</span>
            </td>
            <td>
                <span class="text-muted">${archive.year}-${archive.month.toString().padStart(2, '0')}</span>
            </td>
            <td>
                <span class="fw-medium">${archive.total_transactions} işlem</span>
            </td>
            <td>
                <span class="text-muted">${createdDate.toLocaleDateString('tr-TR')}</span>
            </td>
            <td>
                <span class="badge bg-success">Tamamlandı</span>
            </td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-info view-archive" data-id="${archive.id}">
                        <i class="bi bi-eye"></i>
                    </button>
                </div>
            </td>
        `;

        // Add event listeners
        const viewBtn = tr.querySelector('.view-archive');

        viewBtn.addEventListener('click', () => viewArchive(archive.id));

        tbody.appendChild(tr);
    });
}

// Update archive statistics
function updateArchiveStats(archives) {
    const totalArchives = archives.length;
    const monthlyArchives = archives.length; // All archives are monthly
    const totalTransactions = archives.reduce((sum, a) => sum + (a.total_transactions || 0), 0);
    const lastArchive = archives.length > 0 ? 
        new Date(Math.max(...archives.map(a => new Date(a.archived_at)))).toLocaleDateString('tr-TR') : '-';

    document.getElementById('totalArchives').textContent = totalArchives;
    document.getElementById('monthlyArchives').textContent = monthlyArchives;
    document.getElementById('totalSize').textContent = totalTransactions + ' işlem';
    document.getElementById('lastArchive').textContent = lastArchive;
}


// View archive details
function viewArchive(archiveId) {
    const archive = archives.find(a => a.id === archiveId);
    if (!archive) return;

    ToastNotification.info(`Arşiv detayları: ${archive.name}`);
    // Here you could open a modal with archive details
}


// Setup event listeners
function setupEventListeners() {
    // Refresh archives
    const refreshBtn = document.getElementById('refreshArchives');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            await loadArchives();
            ToastNotification.info('Arşiv listesi yenilendi');
        });
    }
}
