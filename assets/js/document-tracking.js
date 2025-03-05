/**
 * Document Tracking System for FSTI
 * This script handles the document tracking functionality for both students and staff
 */

// Google Apps Script deployed web app URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx-WXqXPuzSsaduKgi29gB-4qBzRxr4CWMIXqelO5BWHZ-yKKVHEDlRq29vCXstHiM/exec';

// Document type mapping
const DOC_TYPES = {
    'surat_tugas': {
        name: 'Permohonan Surat Tugas',
        sheet: 'Permohonan Surat Tugas',
        columns: [
            { id: 'timestamp', name: 'Waktu Pengajuan', width: '150px' },
            { id: 'nama', name: 'Nama Lengkap', width: '180px' },
            { id: 'nip', name: 'NIP', width: '120px' },
            { id: 'status', name: 'Status', width: '100px' },
            { id: 'judul_kegiatan', name: 'Judul Kegiatan', width: '200px' },
            { id: 'tanggal_pelaksanaan', name: 'Tanggal Pelaksanaan', width: '150px' },
            { id: 'lokasi', name: 'Lokasi', width: '150px' },
            { id: 'keterangan', name: 'Keterangan', width: '150px' },
            { id: 'action', name: 'Aksi', width: '100px' }
        ]
    },
    'ttd_dekanat': {
        name: 'Pengesahan TTD Dekanat',
        sheet: 'Pengesahan TTD Dekanat',
        columns: [
            { id: 'timestamp', name: 'Waktu Pengajuan', width: '150px' },
            { id: 'nama', name: 'Nama Lengkap', width: '180px' },
            { id: 'nip', name: 'NIP', width: '120px' },
            { id: 'status', name: 'Status', width: '100px' },
            { id: 'judul_dokumen', name: 'Judul Dokumen', width: '200px' },
            { id: 'jenis_dokumen', name: 'Jenis Dokumen', width: '150px' },
            { id: 'tujuan', name: 'Tujuan', width: '150px' },
            { id: 'keterangan', name: 'Keterangan', width: '150px' },
            { id: 'action', name: 'Aksi', width: '100px' }
        ]
    },
    'peminjaman_sarpras': {
        name: 'Peminjaman Sarana Prasarana',
        sheet: 'Peminjaman Sarpras',
        columns: [
            { id: 'timestamp', name: 'Waktu Pengajuan', width: '150px' },
            { id: 'nama', name: 'Nama Lengkap', width: '180px' },
            { id: 'nip', name: 'NIP', width: '120px' },
            { id: 'status', name: 'Status', width: '100px' },
            { id: 'jenis_sarpras', name: 'Jenis Sarpras', width: '150px' },
            { id: 'nama_sarpras', name: 'Nama Sarpras', width: '150px' },
            { id: 'tanggal_pinjam', name: 'Tanggal Pinjam', width: '150px' },
            { id: 'tanggal_kembali', name: 'Tanggal Kembali', width: '150px' },
            { id: 'keperluan', name: 'Keperluan', width: '200px' },
            { id: 'action', name: 'Aksi', width: '100px' }
        ]
    }
};

// Status colors
const STATUS_COLORS = {
    'Diajukan': 'primary',
    'Diproses': 'info',
    'Ditinjau': 'warning',
    'Disetujui': 'success',
    'Selesai': 'success',
    'Ditolak': 'danger',
    'Pending': 'secondary'
};

// Initialize document tracking system
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dosen tracking form
    const dosenForm = document.getElementById('trackingFormDosen');
    if (dosenForm) {
        dosenForm.addEventListener('submit', function(e) {
            e.preventDefault();
            trackDocument('dosen');
        });
    }
    
    // Initialize mahasiswa tracking form (if needed in the future)
    // const mahasiswaForm = document.getElementById('trackingFormMahasiswa');
    // if (mahasiswaForm) {
    //     mahasiswaForm.addEventListener('submit', function(e) {
    //         e.preventDefault();
    //         trackDocument('mahasiswa');
    //     });
    // }
});

/**
 * Track a document based on the form inputs
 * @param {string} userType - 'dosen' or 'mahasiswa'
 */
function trackDocument(userType) {
    // Show loading spinner
    const spinner = document.getElementById('tracking-spinner');
    if (spinner) spinner.style.display = 'block';
    
    // Hide any previous results
    const resultsContainer = document.querySelector(`#tracking-${userType} .tracking-results`);
    if (resultsContainer) resultsContainer.style.display = 'none';
    
    // Get form values
    let idField, docTypeField, dateField;
    
    if (userType === 'dosen') {
        idField = document.getElementById('nip');
        docTypeField = document.getElementById('docTypeDs');
        dateField = document.getElementById('dateSubmitDs');
    } else {
        // For future implementation of mahasiswa tracking
        idField = document.getElementById('nim');
        docTypeField = document.getElementById('docTypeMhs');
        dateField = document.getElementById('dateSubmit');
    }
    
    const id = idField ? idField.value.trim() : '';
    const docType = docTypeField ? docTypeField.value : '';
    const date = dateField ? dateField.value : '';
    
    // Validate inputs
    if (!docType) {
        alert('Mohon pilih jenis dokumen');
        if (spinner) spinner.style.display = 'none';
        return;
    }
    
    // Prepare parameters for the API call
    const params = {
        action: 'getDocuments',
        sheet: DOC_TYPES[docType].sheet,
        id: id,
        date: date
    };
    
    // Call the API
    fetchDocuments(params, docType, userType);
}

/**
 * Fetch documents from the Google Sheets API
 * @param {Object} params - Parameters for the API call
 * @param {string} docType - Document type
 * @param {string} userType - 'dosen' or 'mahasiswa'
 */
function fetchDocuments(params, docType, userType) {
    // Build the URL with query parameters
    const url = new URL(SCRIPT_URL);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    
    // Make the request
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Display the results
            displayResults(data, docType, userType);
        })
        .catch(error => {
            console.error('Error fetching documents:', error);
            alert('Terjadi kesalahan saat mengambil data. Silakan coba lagi.');
        })
        .finally(() => {
            // Hide loading spinner
            const spinner = document.getElementById('tracking-spinner');
            if (spinner) spinner.style.display = 'none';
        });
}

/**
 * Display the results in the table
 * @param {Array} data - Document data from the API
 * @param {string} docType - Document type
 * @param {string} userType - 'dosen' or 'mahasiswa'
 */
function displayResults(data, docType, userType) {
    // Get the container elements
    const resultsContainer = document.querySelector(`#tracking-${userType} .tracking-results`);
    const tableHeader = document.getElementById('trackingResultsHeader');
    const tableBody = document.getElementById(`trackingResults${userType === 'dosen' ? 'Ds' : 'Mhs'}`);
    
    // Clear previous results
    if (tableHeader) tableHeader.innerHTML = '';
    if (tableBody) tableBody.innerHTML = '';
    
    // If no data, show a message
    if (!data || data.length === 0) {
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="${DOC_TYPES[docType].columns.length}" class="text-center py-4">
                        <div class="alert alert-info mb-0">
                            <i class="fas fa-info-circle me-2"></i> Tidak ada dokumen yang ditemukan
                        </div>
                    </td>
                </tr>
            `;
        }
    } else {
        // Add table headers based on document type
        if (tableHeader) {
            DOC_TYPES[docType].columns.forEach(column => {
                const th = document.createElement('th');
                th.textContent = column.name;
                if (column.width) th.style.width = column.width;
                tableHeader.appendChild(th);
            });
        }
        
        // Add table rows
        if (tableBody) {
            data.forEach(doc => {
                const row = document.createElement('tr');
                
                // Add cells based on document type
                DOC_TYPES[docType].columns.forEach(column => {
                    const cell = document.createElement('td');
                    
                    if (column.id === 'action') {
                        // Create action button
                        const button = document.createElement('button');
                        button.className = 'btn btn-sm btn-outline-primary';
                        button.innerHTML = '<i class="fas fa-eye"></i> Detail';
                        button.setAttribute('data-bs-toggle', 'modal');
                        button.setAttribute('data-bs-target', '#documentDetailModal');
                        button.onclick = () => showDocumentDetail(doc, docType);
                        cell.appendChild(button);
                    } else if (column.id === 'status') {
                        // Format status with appropriate color
                        const status = doc[column.id] || 'Pending';
                        const statusClass = STATUS_COLORS[status] || 'secondary';
                        cell.innerHTML = `<span class="badge bg-${statusClass}">${status}</span>`;
                    } else if (column.id === 'timestamp' || column.id === 'tanggal_pelaksanaan' || 
                               column.id === 'tanggal_pinjam' || column.id === 'tanggal_kembali') {
                        // Format dates
                        cell.textContent = formatDate(doc[column.id]);
                    } else {
                        // Display regular content
                        cell.textContent = doc[column.id] || '-';
                    }
                    
                    row.appendChild(cell);
                });
                
                tableBody.appendChild(row);
            });
        }
    }
    
    // Show the results container
    if (resultsContainer) {
        resultsContainer.style.display = 'block';
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Show document details in modal
 * @param {Object} doc - Document data
 * @param {string} docType - Document type
 */
function showDocumentDetail(doc, docType) {
    const modalContent = document.getElementById('documentDetailContent');
    const modalTitle = document.getElementById('documentDetailModalLabel');
    
    if (!modalContent || !modalTitle) return;
    
    // Set modal title
    modalTitle.textContent = `Detail ${DOC_TYPES[docType].name}`;
    
    // Create content based on document type
    let content = '<div class="row">';
    
    // Left column
    content += '<div class="col-md-6">';
    content += '<h5 class="border-bottom pb-2 mb-3">Informasi Umum</h5>';
    content += `<p><strong>Waktu Pengajuan:</strong> ${formatDate(doc.timestamp)}</p>`;
    content += `<p><strong>Nama:</strong> ${doc.nama || '-'}</p>`;
    content += `<p><strong>NIP:</strong> ${doc.nip || '-'}</p>`;
    
    // Status with color
    const status = doc.status || 'Pending';
    const statusClass = STATUS_COLORS[status] || 'secondary';
    content += `<p><strong>Status:</strong> <span class="badge bg-${statusClass}">${status}</span></p>`;
    
    content += '</div>';
    
    // Right column - specific to document type
    content += '<div class="col-md-6">';
    content += `<h5 class="border-bottom pb-2 mb-3">Detail ${DOC_TYPES[docType].name}</h5>`;
    
    if (docType === 'surat_tugas') {
        content += `<p><strong>Judul Kegiatan:</strong> ${doc.judul_kegiatan || '-'}</p>`;
        content += `<p><strong>Tanggal Pelaksanaan:</strong> ${formatDate(doc.tanggal_pelaksanaan)}</p>`;
        content += `<p><strong>Lokasi:</strong> ${doc.lokasi || '-'}</p>`;
    } else if (docType === 'ttd_dekanat') {
        content += `<p><strong>Judul Dokumen:</strong> ${doc.judul_dokumen || '-'}</p>`;
        content += `<p><strong>Jenis Dokumen:</strong> ${doc.jenis_dokumen || '-'}</p>`;
        content += `<p><strong>Tujuan:</strong> ${doc.tujuan || '-'}</p>`;
    } else if (docType === 'peminjaman_sarpras') {
        content += `<p><strong>Jenis Sarpras:</strong> ${doc.jenis_sarpras || '-'}</p>`;
        content += `<p><strong>Nama Sarpras:</strong> ${doc.nama_sarpras || '-'}</p>`;
        content += `<p><strong>Tanggal Pinjam:</strong> ${formatDate(doc.tanggal_pinjam)}</p>`;
        content += `<p><strong>Tanggal Kembali:</strong> ${formatDate(doc.tanggal_kembali)}</p>`;
        content += `<p><strong>Keperluan:</strong> ${doc.keperluan || '-'}</p>`;
    }
    
    content += '</div>';
    
    // Bottom section - for all document types
    content += '<div class="col-12 mt-4">';
    content += '<h5 class="border-bottom pb-2 mb-3">Keterangan</h5>';
    content += `<p>${doc.keterangan || 'Tidak ada keterangan tambahan.'}</p>`;
    content += '</div>';
    
    content += '</div>'; // End row
    
    // Timeline
    content += '<div class="mt-4">';
    content += '<h5 class="border-bottom pb-2 mb-3">Timeline Dokumen</h5>';
    
    content += '<div class="timeline">';
    
    // Create timeline based on status
    const allStatuses = ['Diajukan', 'Diproses', 'Ditinjau', 'Disetujui', 'Selesai'];
    const currentStatusIndex = allStatuses.indexOf(doc.status || 'Diajukan');
    
    allStatuses.forEach((timelineStatus, index) => {
        const timelineClass = index <= currentStatusIndex ? 'completed' : 'waiting';
        const timelineIcon = index <= currentStatusIndex ? 'check-circle' : 'clock';
        const timelineColor = index <= currentStatusIndex ? 'success' : 'secondary';
        
        content += `
            <div class="timeline-item ${timelineClass}">
                <div class="timeline-marker bg-${timelineColor}">
                    <i class="fas fa-${timelineIcon}"></i>
                </div>
                <div class="timeline-content">
                    <h5 class="mb-1">${timelineStatus}</h5>
                    <p class="mb-0 text-${timelineColor}">
                        <i class="fas fa-calendar-alt me-1"></i>
                        ${index <= currentStatusIndex ? (index === currentStatusIndex ? formatDate(doc.timestamp) : 'Selesai') : '-'}
                    </p>
                </div>
            </div>
        `;
    });
    
    content += '</div>'; // End timeline
    content += '</div>'; // End timeline container
    
    // Set the content
    modalContent.innerHTML = content;
}

/**
 * Format date to Indonesian format
 * @param {string} dateStr - Date string
 * @returns {string} - Formatted date
 */
function formatDate(dateStr) {
    if (!dateStr) return '-';
    
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // Return original if invalid
    
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}