/**
 * Document Tracking System for FSTI
 * This script handles the document tracking functionality for both students and staff
 * Using a dynamic approach that adapts to the actual spreadsheet structure
 */

// Temporary solution: For demo purposes only - In a real application, you would use the Apps Script Web App URL
const DEMO_MODE = true;

// Google Apps Script deployed web app URL - Replace this with your actual deployed script URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxydg4kMZRemBX64o_NvNJw1pJeTzqiVv4TIEabnVUSSmisPJVq04_1tSSwOnEr5vwX/exec';

// Document type basic info (no column definitions)
const DOC_TYPES = {
    'ttd_dekanat': {
        name: 'Pengesahan TTD Dekan',
        sheet: 'Pengesahan TTD Dekanat'
    },
    'surat_tugas': {
        name: 'Permohonan Surat Tugas',
        sheet: 'Permohonan Surat Tugas'
    },
    'peminjaman_sarpras': {
        name: 'Peminjaman Sarana Prasarana',
        sheet: 'Peminjaman Sarpras'
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

// Status field names that might be used in different sheets
const STATUS_FIELD_NAMES = ['status', 'status_persetujuan', 'status_progress'];

// Date field patterns to identify date columns
const DATE_FIELD_PATTERNS = ['timestamp', 'tanggal', 'date'];

// Fields to exclude from the table view for better UI
const EXCLUDED_TABLE_FIELDS = ['keterangan', 'file_dokumen_ttd', 'file_dokumen_sah', 'dokumen_pendukung'];

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
        { nama: 'Adi Mahmud Jaya Marindra', nip_nipppk_niph: '199012312019031001', jurusan: 'Teknik Elektro, Informatika, dan Bisnis', program_studi: 'Teknik Elektro' },
        { nama: 'Irma Fitria', nip_nipppk_niph: '199104142019032021', jurusan: 'Sains dan Analitika Data', program_studi: 'Fisika' },
        { nama: 'Yun Tonce Kusuma Priyanto', nip_nipppk_niph: '198810302015041001', jurusan: 'Teknik Elektro, Informatika, dan Bisnis', program_studi: 'Informatika' },
        { nama: 'Swastya Rahastama', nip_nipppk_niph: '199205162019031011', jurusan: 'Sains dan Analitika Data', program_studi: 'Matematika' },
        { nama: 'M. Ihsan Alfani Putera', nip_nipppk_niph: '199309212019031011', jurusan: 'Teknik Elektro, Informatika, dan Bisnis', program_studi: 'Sistem Informasi' },
        { nama: 'Desy Ridho Rahayu', nip_nipppk_niph: '199512172020122021', jurusan: 'Teknik Elektro, Informatika, dan Bisnis', program_studi: 'Teknik Elektro' }
    ];
    
    // Filter staff by NIP if idFilter is provided
    let filteredStaff = staff;
    if (idFilter) {
        filteredStaff = staff.filter(s => s.nip_nipppk_niph.includes(idFilter));
    }
    
    // Generate data based on document type
    if (docType === 'surat_tugas') {
        // Define fields for surat_tugas
        const mockFields = {
            timestamp: 'date',
            nama: 'string',
            nip_nipppk_niph: 'string',
            jurusan: 'string',
            program_studi: 'string',
            nama_kegiatan: 'string',
            penyelenggara_kegiatan: 'string',
            nomor_surat_undangan: 'string',
            tanggal_surat_undangan: 'date',
            tanggal_pelaksanaan_kegiatan: 'date',
            tanggal_surat_tugas: 'date',
            alamat_venue: 'string',
            kota_kab_kegiatan: 'string',
            kehadiran_sebagai: 'string',
            dokumen_pendukung: 'string',
            status_progress: 'string',
            keterangan: 'string'
        };
        
        const kegiatan = [
            'Seminar Nasional Teknologi Informasi',
            'Workshop Artificial Intelligence',
            'Pelatihan Data Science',
            'Konferensi Internasional',
            'Kunjungan Industri'
        ];
        
        const penyelenggara = [
            'Universitas Indonesia',
            'Institut Teknologi Bandung',
            'Kementerian Pendidikan dan Kebudayaan',
            'IEEE Indonesia Section',
            'Microsoft Indonesia'
        ];
        
        const kota = ['Balikpapan', 'Jakarta', 'Surabaya', 'Bandung', 'Online'];
        const kehadiran = ['Peserta', 'Pemakalah', 'Pembicara', 'Moderator', 'Panitia'];
        const status = ['Diajukan', 'Diproses', 'Ditinjau', 'Disetujui', 'Selesai'];
        
        // Generate documents
        for (let i = 0; i < Math.min(3, filteredStaff.length); i++) {
            const staff = filteredStaff[i % filteredStaff.length];
            const doc = {};
            
            // Create random document based on fields
            Object.keys(mockFields).forEach(field => {
                const fieldType = mockFields[field];
                
                if (fieldType === 'date') {
                    // Generate a random date
                    const date = new Date();
                    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
                    doc[field] = date.toISOString();
                } else if (field === 'nama') {
                    doc[field] = staff.nama;
                } else if (field === 'nip_nipppk_niph') {
                    doc[field] = staff.nip_nipppk_niph;
                } else if (field === 'jurusan') {
                    doc[field] = staff.jurusan;
                } else if (field === 'program_studi') {
                    doc[field] = staff.program_studi;
                } else if (field === 'nama_kegiatan') {
                    doc[field] = kegiatan[Math.floor(Math.random() * kegiatan.length)];
                } else if (field === 'penyelenggara_kegiatan') {
                    doc[field] = penyelenggara[Math.floor(Math.random() * penyelenggara.length)];
                } else if (field === 'nomor_surat_undangan') {
                    doc[field] = `${Math.floor(Math.random() * 1000)}/UN.ITK/${new Date().getFullYear()}`;
                } else if (field === 'kota_kab_kegiatan') {
                    doc[field] = kota[Math.floor(Math.random() * kota.length)];
                } else if (field === 'kehadiran_sebagai') {
                    doc[field] = kehadiran[Math.floor(Math.random() * kehadiran.length)];
                } else if (field === 'status_progress') {
                    doc[field] = status[Math.floor(Math.random() * status.length)];
                } else if (field === 'alamat_venue') {
                    doc[field] = `Gedung ${Math.floor(Math.random() * 10) + 1}, Lantai ${Math.floor(Math.random() * 5) + 1}`;
                } else if (field === 'dokumen_pendukung') {
                    doc[field] = 'https://example.com/dokumen_pendukung.pdf';
                } else if (field === 'keterangan') {
                    doc[field] = 'Dokumen ini dibuat untuk demo. Ini adalah data dummy.';
                } else {
                    doc[field] = `Value for ${field}`;
                }
            });
            
            mockData.push(doc);
        }
    } else if (docType === 'ttd_dekanat') {
        // Define fields for ttd_dekanat
        const mockFields = {
            timestamp: 'date',
            nama: 'string',
            nip_nipppk_niph: 'string',
            jurusan: 'string',
            program_studi: 'string',
            jenis_dokumen: 'string',
            judul_kegiatan: 'string',
            file_dokumen_ttd: 'string',
            pimpinan_ttd: 'string',
            status_persetujuan: 'string',
            keterangan: 'string',
            file_dokumen_sah: 'string'
        };
        
        const jenisDokumen = [
            'Surat Keputusan',
            'Surat Rekomendasi',
            'Surat Keterangan',
            'Berita Acara',
            'Laporan Akhir'
        ];
        
        const judulKegiatan = [
            'Pengesahan SK Kepanitiaan Dies Natalis',
            'Pengesahan Surat Rekomendasi Beasiswa',
            'Pengesahan Laporan Penggunaan Dana Penelitian',
            'Pengesahan Dokumen Kerjasama Industri',
            'Pengesahan SK Pembimbing Tugas Akhir'
        ];
        
        const pimpinanTtd = [
            'Dekan',
            'Wakil Dekan Bidang Akademik dan Kemahasiswaan',
            'Wakil Dekan Bidang Keuangan dan Umum',
            'Ketua Jurusan',
            'Koordinator Program Studi'
        ];
        
        const status = ['Diajukan', 'Diproses', 'Ditinjau', 'Disetujui', 'Selesai'];
        
        // Generate documents
        for (let i = 0; i < Math.min(3, filteredStaff.length); i++) {
            const staff = filteredStaff[i % filteredStaff.length];
            const doc = {};
            
            // Create random document based on fields
            Object.keys(mockFields).forEach(field => {
                const fieldType = mockFields[field];
                
                if (fieldType === 'date') {
                    // Generate a random date
                    const date = new Date();
                    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
                    doc[field] = date.toISOString();
                } else if (field === 'nama') {
                    doc[field] = staff.nama;
                } else if (field === 'nip_nipppk_niph') {
                    doc[field] = staff.nip_nipppk_niph;
                } else if (field === 'jurusan') {
                    doc[field] = staff.jurusan;
                } else if (field === 'program_studi') {
                    doc[field] = staff.program_studi;
                } else if (field === 'jenis_dokumen') {
                    doc[field] = jenisDokumen[Math.floor(Math.random() * jenisDokumen.length)];
                } else if (field === 'judul_kegiatan') {
                    doc[field] = judulKegiatan[Math.floor(Math.random() * judulKegiatan.length)];
                } else if (field === 'pimpinan_ttd') {
                    doc[field] = pimpinanTtd[Math.floor(Math.random() * pimpinanTtd.length)];
                } else if (field === 'status_persetujuan') {
                    doc[field] = status[Math.floor(Math.random() * status.length)];
                } else if (field === 'file_dokumen_ttd') {
                    doc[field] = 'https://example.com/dokumen_untuk_ttd.pdf';
                } else if (field === 'file_dokumen_sah') {
                    doc[field] = 'https://example.com/dokumen_sudah_sah.pdf';
                } else if (field === 'keterangan') {
                    doc[field] = 'Dokumen ini dibuat untuk demo. Ini adalah data dummy.';
                } else {
                    doc[field] = `Value for ${field}`;
                }
            });
            
            mockData.push(doc);
        }
    } else if (docType === 'peminjaman_sarpras') {
        // Define fields for peminjaman_sarpras
        const mockFields = {
            timestamp: 'date',
            nama: 'string',
            nip_nipppk_niph: 'string',
            jurusan: 'string',
            program_studi: 'string',
            jenis_sarpras: 'string',
            nama_sarpras: 'string',
            keperluan: 'string',
            tanggal_penggunaan: 'date',
            waktu_penggunaan: 'string',
            penanggung_jawab: 'string',
            status: 'string',
            keterangan: 'string'
        };
        
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
        
        const waktuPenggunaan = [
            '08:00 - 10:00',
            '10:00 - 12:00',
            '13:00 - 15:00',
            '15:00 - 17:00',
            'Seharian (08:00 - 17:00)'
        ];
        
        const status = ['Diajukan', 'Diproses', 'Ditinjau', 'Disetujui', 'Selesai'];
        
        // Generate documents
        for (let i = 0; i < Math.min(3, filteredStaff.length); i++) {
            const staff = filteredStaff[i % filteredStaff.length];
            const doc = {};
            
            // Create random document based on fields
            Object.keys(mockFields).forEach(field => {
                const fieldType = mockFields[field];
                
                if (fieldType === 'date') {
                    // Generate a random date
                    const date = new Date();
                    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
                    doc[field] = date.toISOString();
                } else if (field === 'nama') {
                    doc[field] = staff.nama;
                } else if (field === 'nip_nipppk_niph') {
                    doc[field] = staff.nip_nipppk_niph;
                } else if (field === 'jurusan') {
                    doc[field] = staff.jurusan;
                } else if (field === 'program_studi') {
                    doc[field] = staff.program_studi;
                } else if (field === 'jenis_sarpras') {
                    doc[field] = jenisSarpras[Math.floor(Math.random() * jenisSarpras.length)];
                } else if (field === 'nama_sarpras') {
                    doc[field] = namaSarpras[Math.floor(Math.random() * namaSarpras.length)];
                } else if (field === 'keperluan') {
                    doc[field] = keperluan[Math.floor(Math.random() * keperluan.length)];
                } else if (field === 'waktu_penggunaan') {
                    doc[field] = waktuPenggunaan[Math.floor(Math.random() * waktuPenggunaan.length)];
                } else if (field === 'penanggung_jawab') {
                    doc[field] = staff.nama;
                } else if (field === 'status') {
                    doc[field] = status[Math.floor(Math.random() * status.length)];
                } else if (field === 'keterangan') {
                    doc[field] = 'Dokumen ini dibuat untuk demo. Ini adalah data dummy.';
                } else {
                    doc[field] = `Value for ${field}`;
                }
            });
            
            mockData.push(doc);
        }
    }
    
    return mockData;
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
                    <td colspan="8" class="text-center py-4">
                        <div class="alert alert-info mb-0">
                            <i class="fas fa-info-circle me-2"></i> Tidak ada dokumen yang ditemukan
                        </div>
                    </td>
                </tr>
            `;
        }
        
        // Show the results container even if empty
        if (resultsContainer) {
            resultsContainer.style.display = 'block';
        }
        
        return;
    }
    
    // Determine which fields to display in the table
    // Get all fields from the first document
    const allFields = Object.keys(data[0]);
    
    // Filter fields to display in the table (exclude some fields for better UI)
    const tableFields = allFields.filter(field => 
        !EXCLUDED_TABLE_FIELDS.some(pattern => field.includes(pattern))
    );
    
    // Make sure we have an "action" column at the end
    if (!tableFields.includes('action')) {
        tableFields.push('action');
    }
    
    // Add table headers
    if (tableHeader) {
        tableFields.forEach(field => {
            const th = document.createElement('th');
            
            // Make the header title more readable
            let headerName = field
                .replace(/_/g, ' ') // Replace underscores with spaces
                .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word
            
            th.textContent = headerName;
            
            // Set width for some common columns
            if (field === 'timestamp' || field.includes('tanggal')) {
                th.style.width = '120px';
            } else if (field === 'nama') {
                th.style.width = '180px';
            } else if (field === 'nip_nipppk_niph') {
                th.style.width = '120px';
            } else if (field.includes('status')) {
                th.style.width = '100px';
            } else if (field === 'action') {
                th.style.width = '80px';
            }
            
            tableHeader.appendChild(th);
        });
    }
    
    // Add table rows
    if (tableBody) {
        data.forEach(doc => {
            const row = document.createElement('tr');
            
            // Add cells based on fields
            tableFields.forEach(field => {
                const cell = document.createElement('td');
                
                if (field === 'action') {
                    // Create action button
                    const button = document.createElement('button');
                    button.className = 'btn btn-sm btn-outline-primary';
                    button.innerHTML = '<i class="fas fa-eye"></i> Detail';
                    button.setAttribute('data-bs-toggle', 'modal');
                    button.setAttribute('data-bs-target', '#documentDetailModal');
                    button.onclick = () => showDocumentDetail(doc, docType);
                    cell.appendChild(button);
                } else if (STATUS_FIELD_NAMES.includes(field)) {
                    // Format status with appropriate color
                    const status = doc[field] || 'Pending';
                    const statusClass = STATUS_COLORS[status] || 'secondary';
                    cell.innerHTML = `<span class="badge bg-${statusClass}">${status}</span>`;
                } else if (isDateField(field)) {
                    // Format dates
                    cell.textContent = formatDate(doc[field]);
                } else {
                    // Display regular content
                    cell.textContent = doc[field] || '-';
                }
                
                row.appendChild(cell);
            });
            
            tableBody.appendChild(row);
        });
    }
    
    // Show the results container
    if (resultsContainer) {
        resultsContainer.style.display = 'block';
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Check if a field is a date field
 * @param {string} fieldName - The field name to check
 * @returns {boolean} - True if it's a date field
 */
function isDateField(fieldName) {
    return DATE_FIELD_PATTERNS.some(pattern => fieldName.toLowerCase().includes(pattern));
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
    
    // Create content from all available fields in the document
    let content = '<div class="row">';
    
    // Left column - Basic info
    content += '<div class="col-md-6">';
    content += '<h5 class="border-bottom pb-2 mb-3">Informasi Umum</h5>';
    
    // Add common fields if they exist
    const commonFields = ['timestamp', 'nama', 'nip_nipppk_niph', 'jurusan', 'program_studi'];
    commonFields.forEach(field => {
        if (doc[field] !== undefined) {
            const label = field
                .replace(/_/g, ' ')
                .replace(/\b\w/g, char => char.toUpperCase());
            
            let value = doc[field];
            if (isDateField(field)) {
                value = formatDate(value);
            }
            
            content += `<p><strong>${label}:</strong> ${value || '-'}</p>`;
        }
    });
    
    // Add status field if it exists (try different status field names)
    const statusField = STATUS_FIELD_NAMES.find(field => doc[field] !== undefined);
    if (statusField) {
        const status = doc[statusField];
        const statusClass = STATUS_COLORS[status] || 'secondary';
        content += `<p><strong>Status:</strong> <span class="badge bg-${statusClass}">${status}</span></p>`;
    }
    
    content += '</div>';
    
    // Right column - document specific fields
    content += '<div class="col-md-6">';
    content += `<h5 class="border-bottom pb-2 mb-3">Detail ${DOC_TYPES[docType].name}</h5>`;
    
    // Get all fields excluding the common fields
    const detailFields = Object.keys(doc).filter(field => 
        !commonFields.includes(field) && 
        !STATUS_FIELD_NAMES.includes(field) &&
        field !== 'keterangan'
    );
    
    detailFields.forEach(field => {
        const label = field
            .replace(/_/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
        
        // Special handling for specific fields
        if (field.includes('file') && doc[field]) {
            // File links
            const iconClass = field.includes('sah') ? 'fa-download' : 'fa-external-link-alt';
            const linkText = field.includes('sah') ? 'Unduh Dokumen' : 'Lihat Dokumen';
            content += `<p><strong>${label}:</strong> <a href="${doc[field]}" target="_blank">${linkText} <i class="fas ${iconClass}"></i></a></p>`;
        } else if (isDateField(field)) {
            // Format dates
            content += `<p><strong>${label}:</strong> ${formatDate(doc[field])}</p>`;
        } else {
            // Regular fields
            content += `<p><strong>${label}:</strong> ${doc[field] || '-'}</p>`;
        }
    });
    
    content += '</div>';
    
    // Bottom section - Keterangan if it exists
    if (doc.keterangan) {
        content += '<div class="col-12 mt-4">';
        content += '<h5 class="border-bottom pb-2 mb-3">Keterangan</h5>';
        content += `<p>${doc.keterangan}</p>`;
        content += '</div>';
    }
    
    content += '</div>'; // End row
    
    // Timeline
    content += '<div class="mt-4">';
    content += '<h5 class="border-bottom pb-2 mb-3">Timeline Dokumen</h5>';
    
    content += '<div class="timeline">';
    
    // Create timeline based on status
    const allStatuses = ['Diajukan', 'Diproses', 'Ditinjau', 'Disetujui', 'Selesai'];
    const statusField = STATUS_FIELD_NAMES.find(field => doc[field] !== undefined);
    let currentStatus = statusField ? doc[statusField] : 'Diajukan';
    const currentStatusIndex = allStatuses.indexOf(currentStatus);
    
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