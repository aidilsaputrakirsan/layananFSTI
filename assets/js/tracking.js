/**
 * Layanan Administrasi Prima FSTI
 * Document Tracking System
 */

/**
 * Initialize the document tracking system
 */
function initTracking() {
    setupTrackingForms();
    setupTrackingFilters();
    setupProgressBars();
}

/**
 * Set up tracking form submissions
 */
function setupTrackingForms() {
    // Mahasiswa tracking form
    const trackingFormMhs = document.getElementById('trackingFormMahasiswa');
    if (trackingFormMhs) {
        trackingFormMhs.addEventListener('submit', function(e) {
            e.preventDefault();
            handleTrackingSubmit(this, 'mahasiswa');
        });
    }
    
    // Dosen tracking form
    const trackingFormDs = document.getElementById('trackingFormDosen');
    if (trackingFormDs) {
        trackingFormDs.addEventListener('submit', function(e) {
            e.preventDefault();
            handleTrackingSubmit(this, 'dosen');
        });
    }
}

/**
 * Handle tracking form submission
 * @param {HTMLFormElement} form - The form element
 * @param {string} userType - 'mahasiswa' or 'dosen'
 */
function handleTrackingSubmit(form, userType) {
    // Show loading animation
    toggleLoading(true);
    
    // In a real application, this would be an API call to the Google Apps Script backend
    // For now, we'll simulate the API call with a timeout and dummy data
    setTimeout(() => {
        // Get form values
        let idField, docTypeField;
        
        if (userType === 'mahasiswa') {
            idField = document.getElementById('nim');
            docTypeField = document.getElementById('docTypeMhs');
        } else {
            idField = document.getElementById('nip');
            docTypeField = document.getElementById('docTypeDs');
        }
        
        const id = idField ? idField.value : '';
        const docType = docTypeField ? docTypeField.value : '';
        
        // Generate tracking data
        const trackingData = generateTrackingData(id, docType, userType);
        
        // Display the results
        displayTrackingResults(trackingData, userType);
        
        // Hide loading animation
        toggleLoading(false);
    }, 1500);
}

/**
 * Toggle loading animation
 * @param {boolean} show - Whether to show or hide loading animation
 */
function toggleLoading(show) {
    const loadingAnimation = document.getElementById('loadingAnimation');
    if (loadingAnimation) {
        loadingAnimation.style.display = show ? 'block' : 'none';
    }
}

/**
 * Generate mock tracking data
 * @param {string} id - NIM or NIP
 * @param {string} docType - Document type
 * @param {string} userType - 'mahasiswa' or 'dosen'
 * @returns {Array} - Array of tracking data objects
 */
function generateTrackingData(id, docType, userType) {
    // Document types and their display names
    const docTypes = {
        mahasiswa: {
            'surat_pengantar': 'Surat Pengantar/Dokumen Umum',
            'surat_kp': 'Surat Kerja Praktek/Magang',
            'surat_rekomendasi': 'Surat Rekomendasi Kegiatan/Beasiswa',
            'legalisasi': 'Legalisasi Dokumen',
            'perubahan_mk': 'Perubahan/Penambahan/Penghapusan Mata Kuliah'
        },
        dosen: {
            'surat_tugas': 'Surat Tugas',
            'surat_kerjasama': 'Surat Kerjasama',
            'sk_mengajar': 'SK Mengajar',
            'sk_penelitian': 'SK Penelitian',
            'sk_pengabdian': 'SK Pengabdian Masyarakat'
        }
    };
    
    // Statuses and their colors
    const statuses = [
        { value: 'Diproses', color: 'primary' },
        { value: 'Diverifikasi', color: 'info' },
        { value: 'Dalam Review', color: 'primary' },
        { value: 'Ditandatangani', color: 'success' },
        { value: 'Selesai', color: 'success' },
        { value: 'Ditunda', color: 'warning' },
        { value: 'Dibatalkan', color: 'danger' },
        { value: 'Ditolak', color: 'danger' }
    ];
    
    // Stages in the process
    const stages = ['Pengajuan', 'Verifikasi Admin', 'Review Kaprodi', 'Review Dekan', 'Pengesahan', 'Distribusi'];
    
    // Generate between 0 and 3 documents
    const count = Math.floor(Math.random() * 4);
    const results = [];
    
    // If ID is empty, return empty array
    if (!id.trim()) {
        return results;
    }
    
    for (let i = 0; i < count; i++) {
        // Random submission date in the last 30 days
        const submissionDate = new Date();
        submissionDate.setDate(submissionDate.getDate() - Math.floor(Math.random() * 30));
        
        // Random doc type if not specified
        const selectedDocType = docType || Object.keys(docTypes[userType])[Math.floor(Math.random() * Object.keys(docTypes[userType]).length)];
        
        // Random status
        const statusIndex = Math.floor(Math.random() * statuses.length);
        const status = statuses[statusIndex];
        
        // Stage based on status
        let stage;
        if (status.value === 'Selesai') {
            stage = stages[stages.length - 1];
        } else if (status.value === 'Dibatalkan' || status.value === 'Ditolak') {
            stage = stages[Math.floor(Math.random() * 3)];
        } else {
            // For other statuses, pick a stage proportional to the status index
            const stageIndex = Math.min(statusIndex, stages.length - 1);
            stage = stages[stageIndex];
        }
        
        // Progress percentage based on stage
        const progress = Math.round(((stages.indexOf(stage) + 1) / stages.length) * 100);
        
        // Estimated completion date (5-15 days after submission)
        const estCompletionDate = new Date(submissionDate);
        estCompletionDate.setDate(estCompletionDate.getDate() + 5 + Math.floor(Math.random() * 10));
        
        // Document number
        const docNumber = `${userType.charAt(0).toUpperCase()}${submissionDate.getFullYear()}${(submissionDate.getMonth() + 1).toString().padStart(2, '0')}${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`;
        
        // Create document object
        const document = {
            docNumber: docNumber,
            docType: docTypes[userType][selectedDocType],
            submissionDate: submissionDate.toISOString().split('T')[0],
            status: status.value,
            statusColor: status.color,
            stage: stage,
            progress: progress,
            estimatedCompletion: estCompletionDate.toISOString().split('T')[0]
        };
        
        results.push(document);
    }
    
    return results;
}

/**
 * Display tracking results
 * @param {Array} data - Array of tracking data objects
 * @param {string} userType - 'mahasiswa' or 'dosen'
 */
function displayTrackingResults(data, userType) {
    // Get the results container
    const resultsContainer = document.querySelector(`#tracking-${userType} .tracking-results`);
    if (!resultsContainer) return;
    
    // Show the container
    resultsContainer.style.display = 'block';
    
    // Get the results table body
    const tableBody = userType === 'mahasiswa' ? 
        document.getElementById('trackingResultsMhs') : 
        document.getElementById('trackingResultsDs');
    
    if (!tableBody) return;
    
    // Clear previous results
    tableBody.innerHTML = '';
    
    // If no data, show message
    if (data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <div class="alert alert-info mb-0">
                        <i class="fas fa-info-circle me-2"></i> Tidak ada dokumen yang ditemukan
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // Add each document to the table
    data.forEach(doc => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${doc.docNumber}</td>
            <td>${doc.docType}</td>
            <td>${formatDate(doc.submissionDate)}</td>
            <td><span class="badge bg-${doc.statusColor}">${doc.status}</span></td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="progress flex-grow-1" style="height: 6px;">
                        <div class="progress-bar bg-${doc.statusColor}" role="progressbar" style="width: ${doc.progress}%" aria-valuenow="${doc.progress}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <span class="ms-2">${doc.stage}</span>
                </div>
            </td>
            <td>${formatDate(doc.estimatedCompletion)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary view-details" data-bs-toggle="modal" data-bs-target="#detailsModal" data-doc="${doc.docNumber}">
                    <i class="fas fa-eye"></i> Detail
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add click handlers for detail buttons
    setupDetailButtons();
    
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Format date to Indonesian format
 * @param {string} dateStr - ISO date string (YYYY-MM-DD)
 * @returns {string} - Formatted date
 */
function formatDate(dateStr) {
    if (!dateStr) return '-';
    
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const date = new Date(dateStr);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Set up tracking result filters
 */
function setupTrackingFilters() {
    const filterInputs = document.querySelectorAll('.tracking-filter');
    
    filterInputs.forEach(input => {
        input.addEventListener('keyup', function() {
            const filter = this.value.toUpperCase();
            const tableId = this.getAttribute('data-table');
            const table = document.getElementById(tableId);
            
            if (!table) return;
            
            const rows = table.getElementsByTagName('tr');
            
            for (let i = 0; i < rows.length; i++) {
                const cells = rows[i].getElementsByTagName('td');
                let found = false;
                
                for (let j = 0; j < cells.length; j++) {
                    if (cells[j]) {
                        const cellText = cells[j].textContent || cells[j].innerText;
                        
                        if (cellText.toUpperCase().indexOf(filter) > -1) {
                            found = true;
                            break;
                        }
                    }
                }
                
                rows[i].style.display = found ? '' : 'none';
            }
        });
    });
}

/**
 * Set up progress bars in tracking results
 */
function setupProgressBars() {
    // This would be used for dynamic updates to progress bars
    // Currently handled in the displayTrackingResults function
}

/**
 * Set up detail buttons in tracking results
 */
function setupDetailButtons() {
    const detailButtons = document.querySelectorAll('.view-details');
    
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const docNumber = this.getAttribute('data-doc');
            showDocumentDetails(docNumber);
        });
    });
}

/**
 * Show document details in modal
 * @param {string} docNumber - Document number
 */
function showDocumentDetails(docNumber) {
    // In a real application, this would fetch details from the backend
    // For now, we'll generate some dummy details
    
    const modalTitle = document.querySelector('#detailsModal .modal-title');
    const modalBody = document.querySelector('#detailsModal .modal-body');
    
    if (!modalTitle || !modalBody) return;
    
    modalTitle.textContent = `Detail Dokumen: ${docNumber}`;
    
    // Create timeline stages
    const stages = [
        { name: 'Pengajuan', date: '10 Februari 2023', status: 'completed', description: 'Dokumen berhasil diajukan oleh pemohon.' },
        { name: 'Verifikasi Admin', date: '12 Februari 2023', status: 'completed', description: 'Dokumen telah diverifikasi oleh admin.' },
        { name: 'Review Kaprodi', date: '15 Februari 2023', status: 'completed', description: 'Dokumen telah direview dan disetujui oleh Kaprodi.' },
        { name: 'Review Dekan', date: '18 Februari 2023', status: 'in-progress', description: 'Dokumen sedang dalam review oleh Dekan.' },
        { name: 'Pengesahan', date: '-', status: 'waiting', description: 'Dokumen menunggu pengesahan.' },
        { name: 'Distribusi', date: '-', status: 'waiting', description: 'Dokumen menunggu untuk didistribusikan.' }
    ];
    
    // Generate HTML for timeline
    let timelineHTML = '<div class="timeline">';
    
    stages.forEach((stage, index) => {
        let statusClass = '';
        let statusIcon = '';
        
        switch (stage.status) {
            case 'completed':
                statusClass = 'success';
                statusIcon = 'check-circle';
                break;
            case 'in-progress':
                statusClass = 'primary';
                statusIcon = 'clock';
                break;
            case 'waiting':
                statusClass = 'secondary';
                statusIcon = 'hourglass';
                break;
        }
        
        timelineHTML += `
            <div class="timeline-item ${stage.status}">
                <div class="timeline-marker bg-${statusClass}">
                    <i class="fas fa-${statusIcon}"></i>
                </div>
                <div class="timeline-content">
                    <h5 class="mb-1">${stage.name}</h5>
                    <p class="mb-0 text-${statusClass}"><i class="fas fa-calendar-alt me-1"></i> ${stage.date}</p>
                    <p class="mb-0 mt-2">${stage.description}</p>
                </div>
            </div>
        `;
    });
    
    timelineHTML += '</div>';
    
    // Document details
    const detailsHTML = `
        <div class="row mb-4">
            <div class="col-md-6">
                <h5>Informasi Dokumen</h5>
                <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Nomor Dokumen
                        <span class="badge bg-primary rounded-pill">${docNumber}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Jenis Dokumen
                        <span>Surat Kerja Praktek</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Tanggal Pengajuan
                        <span>10 Februari 2023</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Status
                        <span class="badge bg-primary">Dalam Proses</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Estimasi Selesai
                        <span>25 Februari 2023</span>
                    </li>
                </ul>
            </div>
            <div class="col-md-6">
                <h5>Informasi Pemohon</h5>
                <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Nama
                        <span>John Doe</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        NIM/NIP
                        <span>12345678</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Program Studi
                        <span>Teknik Informatika</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Email
                        <span>john.doe@student.ac.id</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Telepon
                        <span>081234567890</span>
                    </li>
                </ul>
            </div>
        </div>
        
        <h5 class="mb-3">Timeline Dokumen</h5>
        ${timelineHTML}
    `;
    
    modalBody.innerHTML = detailsHTML;
}

// Initialize tracking system when DOM is loaded
document.addEventListener('DOMContentLoaded', initTracking);