/**
 * Document Tracking System for FSTI
 * This script handles the document tracking functionality for both students and staff
 */

// Temporary solution: For demo purposes only - In a real application, you would use the Apps Script Web App URL
const DEMO_MODE = true;

// Google Apps Script deployed web app URL - Replace this with your actual deployed script URL
const SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec';

// Document type mapping
const DOC_TYPES = {
    'surat_tugas': {
        name: 'Permohonan Surat Tugas',
        sheet: 'Permohonan Surat Tugas',
        columns: [
            { id: 'timestamp', name: 'Waktu Pengajuan', width: '120px' },
            { id: 'nama', name: 'Nama Lengkap', width: '180px' },
            { id: 'nip', name: 'NIP', width: '120px' },
            { id: 'status', name: 'Status', width: '100px' },
            { id: 'judul_kegiatan', name: 'Judul Kegiatan', width: '200px' },
            { id: 'tanggal_pelaksanaan', name: 'Tanggal Pelaksanaan', width: '120px' },
            { id: 'lokasi', name: 'Lokasi', width: '120px' },
            { id: 'action', name: 'Aksi', width: '80px' }
        ]
    },
    'ttd_dekanat': {
        name: 'Pengesahan TTD Dekan',
        sheet: 'Pengesahan TTD Dekanat',
        columns: [
            { id: 'timestamp', name: 'Waktu Pengajuan', width: '120px' },
            { id: 'nama', name: 'Nama Lengkap', width: '180px' },
            { id: 'nip', name: 'NIP', width: '120px' },
            { id: 'status', name: 'Status', width: '100px' },
            { id: 'judul_dokumen', name: 'Judul Dokumen', width: '200px' },
            { id: 'jenis_dokumen', name: 'Jenis Dokumen', width: '120px' },
            { id: 'tujuan', name: 'Tujuan', width: '120px' },
            { id: 'action', name: 'Aksi', width: '80px' }
        ]
    },
    'peminjaman_sarpras': {
        name: 'Peminjaman Sarana Prasarana',
        sheet: 'Peminjaman Sarpras',
        columns: [
            { id: 'timestamp', name: 'Waktu Pengajuan', width: '120px' },
            { id: 'nama', name: 'Nama Lengkap', width: '180px' },
            { id: 'nip', name: 'NIP', width: '120px' },
            { id: 'status', name: 'Status', width: '100px' },
            { id: 'jenis_sarpras', name: 'Jenis Sarpras', width: '120px' },
            { id: 'nama_sarpras', name: 'Nama Sarpras', width: '120px' },
            { id: 'tanggal_pinjam', name: 'Tanggal Pinjam', width: '120px' },
            { id: 'tanggal_kembali', name: 'Tanggal Kembali', width: '120px' },
            { id: 'action', name: 'Aksi', width: '80px' }
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
    // If in demo mode, return mock data instead of calling the API
    if (DEMO_MODE) {
        console.log('Running in demo mode - Using mock data');
        setTimeout(() => {
            const mockData = generateMockData(docType, params.id);
            displayResults(mockData, docType, userType);
        }, 1000); // Simulate API delay
        return;
    }
    
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
 * Generate mock data for demo mode
 * @param {string} docType - Document type
 * @param {string} idFilter - Optional ID filter
 * @returns {Array} - Array of mock document objects
 */
function generateMockData(docType, idFilter = '') {
    let mockData = [];
    
    // Common staff data
    const staff = [
        { nama: 'Adi Mahmud Jaya Marindra', nip: '199012312019031001' },
        { nama: 'Irma Fitria', nip: '199104142019032021' },
        { nama: 'Yun Tonce Kusuma Priyanto', nip: '198810302015041001' },
        { nama: 'Swastya Rahastama', nip: '199205162019031011' },
        { nama: 'M. Ihsan Alfani Putera', nip: '199309212019031011' },
        { nama: 'Desy Ridho Rahayu', nip: '199512172020122021' }
    ];
    
    // Filter staff by NIP if idFilter is provided
    let filteredStaff = staff;
    if (idFilter) {
        filteredStaff = staff.filter(s => s.nip.includes(idFilter));
    }
    
    // Generate data based on document type
    if (docType === 'surat_tugas') {
        const kegiatan = [
            'Seminar Nasional Teknologi Informasi',
            'Workshop Artificial Intelligence',
            'Pelatihan Data Science',
            'Konferensi Internasional',
            'Kunjungan Industri'
        ];
        
        const lokasi = ['Balikpapan', 'Jakarta', 'Surabaya', 'Bandung', 'Online'];
        
        // Generate 1-5 random documents
        const count = Math.min(Math.floor(Math.random() * 5) + 1, filteredStaff.length);
        
        for (let i = 0; i < count; i++) {
            // Generate random date in the last 30 days
            const submitDate = new Date();
            submitDate.setDate(submitDate.getDate() - Math.floor(Math.random() * 30));
            
            // Generate random pelaksanaan date (1-14 days after submission)
            const pelaksanaanDate = new Date(submitDate);
            pelaksanaanDate.setDate(pelaksanaanDate.getDate() + Math.floor(Math.random() * 14) + 1);
            
            // Select random staff member
            const staffMember = filteredStaff[i % filteredStaff.length];
            
            // Create document
            mockData.push({
                timestamp: submitDate.toISOString(),
                nama: staffMember.nama,
                nip: staffMember.nip,
                status: getRandomStatus(),
                judul_kegiatan: kegiatan[Math.floor(Math.random() * kegiatan.length)],
                tanggal_pelaksanaan: pelaksanaanDate.toISOString(),
                lokasi: lokasi[Math.floor(Math.random() * lokasi.length)],
                keterangan: 'Dokumen ini dibuat untuk demo. Ini adalah data dummy.'
            });
        }
    } else if (docType === 'ttd_dekanat') {
        const jenisDokumen = [
            'Surat Keputusan',
            'Surat Rekomendasi',
            'Surat Keterangan',
            'Berita Acara',
            'Laporan Akhir'
        ];
        
        const tujuan = [
            'Kementerian Pendidikan',
            'Rektor ITK',
            'Kepala Laboratorium',
            'Perusahaan Mitra',
            'Internal Fakultas'
        ];
        
        // Generate 1-5 random documents
        const count = Math.min(Math.floor(Math.random() * 5) + 1, filteredStaff.length);
        
        for (let i = 0; i < count; i++) {
            // Generate random date in the last 30 days
            const submitDate = new Date();
            submitDate.setDate(submitDate.getDate() - Math.floor(Math.random() * 30));
            
            // Select random staff member
            const staffMember = filteredStaff[i % filteredStaff.length];
            
            // Create document
            mockData.push({
                timestamp: submitDate.toISOString(),
                nama: staffMember.nama,
                nip: staffMember.nip,
                status: getRandomStatus(),
                judul_dokumen: `${jenisDokumen[Math.floor(Math.random() * jenisDokumen.length)]} - ${Math.floor(Math.random() * 100) + 1}/FSTI/ITK/${new Date().getFullYear()}`,
                jenis_dokumen: jenisDokumen[Math.floor(Math.random() * jenisDokumen.length)],
                tujuan: tujuan[Math.floor(Math.random() * tujuan.length)],
                keterangan: 'Dokumen ini dibuat untuk demo. Ini adalah data dummy.'
            });
        }
    } else if (docType === 'peminjaman_sarpras') {
        const jenisSarpras = [
            'Ruang Kelas',
            'Laboratorium',
            'Peralatan Audio Visual',
            'Laptop',
            'Proyektor'
        ];
        
        const namaSarpras = [
            'Ruang Rapat Utama',
            'Lab Komputer A',
            'Sound System',
            'Laptop Acer Aspire',
            'Projector Epson'
        ];
        
        const keperluan = [
            'Perkuliahan',
            'Praktikum',
            'Seminar',
            'Rapat Dosen',
            'Kegiatan Mahasiswa'
        ];
        
        // Generate 1-5 random documents
        const count = Math.min(Math.floor(Math.random() * 5) + 1, filteredStaff.length);
        
        for (let i = 0; i < count; i++) {
            // Generate random date in the last 30 days
            const submitDate = new Date();
            submitDate.setDate(submitDate.getDate() - Math.floor(Math.random() * 30));
            
            // Generate random pinjam date (0-7 days after submission)
            const pinjamDate = new Date(submitDate);
            pinjamDate.setDate(pinjamDate.getDate() + Math.floor(Math.random() * 7));
            
            // Generate random kembali date (1-7 days after pinjam)
            const kembaliDate = new Date(pinjamDate);
            kembaliDate.setDate(kembaliDate.getDate() + Math.floor(Math.random() * 7) + 1);
            
            // Select random staff member
            const staffMember = filteredStaff[i % filteredStaff.length];
            
            // Create document
            mockData.push({
                timestamp: submitDate.toISOString(),
                nama: staffMember.nama,
                nip: staffMember.nip,
                status: getRandomStatus(),
                jenis_sarpras: jenisSarpras[Math.floor(Math.random() * jenisSarpras.length)],
                nama_sarpras: namaSarpras[Math.floor(Math.random() * namaSarpras.length)],
                tanggal_pinjam: pinjamDate.toISOString(),
                tanggal_kembali: kembaliDate.toISOString(),
                keperluan: keperluan[Math.floor(Math.random() * keperluan.length)],
                keterangan: 'Dokumen ini dibuat untuk demo. Ini adalah data dummy.'
            });
        }
    }
    
    return mockData;
}

/**
 * Get a random status for mock data
 * @returns {string} - Random status
 */
function getRandomStatus() {
    const statuses = ['Diajukan', 'Diproses', 'Ditinjau', 'Disetujui', 'Selesai'];
    const weights = [0.2, 0.2, 0.2, 0.2, 0.2]; // Equal probabilities
    
    let random = Math.random();
    let sum = 0;
    
    for (let i = 0; i < statuses.length; i++) {
        sum += weights[i];
        if (random < sum) {
            return statuses[i];
        }
    }
    
    return statuses[0]; // Default to the first status
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