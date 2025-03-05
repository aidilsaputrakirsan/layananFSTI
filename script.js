/**
 * Layanan Administrasi Prima FSTI
 * Main JavaScript File
 */

// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animation library
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
    
    // Hide preloader when page is loaded
    setTimeout(function() {
        document.getElementById('preloader').style.display = 'none';
    }, 500);
    
    // Navigation handling
    setupNavigation();
    
    // Scroll events
    handleScrollEvents();
    
    // Form submissions
    setupFormHandlers();
    
    // Initialize all tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

/**
 * Setup navigation functionality
 */
function setupNavigation() {
    // Get all navigation links with data-section attribute
    const navLinks = document.querySelectorAll('.nav-link[data-section], .dropdown-item[data-section]');
    
    // Add click event to each navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section id
            const targetId = this.getAttribute('data-section');
            
            // Navigate to the section
            navigateToSection(targetId);
            
            // Close the mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
    
    // Handle initial load - check if URL has a hash
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        setTimeout(() => {
            navigateToSection(targetId);
        }, 300);
    }
}

/**
 * Navigate to a specific section
 * @param {string} sectionId - The ID of the section to navigate to
 */
function navigateToSection(sectionId) {
    // Hide all sections
    const allSections = document.querySelectorAll('.section');
    allSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Update URL hash without scrolling
        history.pushState(null, null, '#' + sectionId);
        
        // Update active state in navigation
        updateActiveNavLink(sectionId);
        
        // Scroll to top of the section
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Add zoom-in animation to the section
        targetSection.classList.add('zoom-in');
        setTimeout(() => {
            targetSection.classList.remove('zoom-in');
        }, 500);
    }
}

/**
 * Update active state in navigation links
 * @param {string} activeSectionId - The ID of the active section
 */
function updateActiveNavLink(activeSectionId) {
    // Remove active class from all links
    const allLinks = document.querySelectorAll('.nav-link, .dropdown-item');
    allLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to links pointing to the active section
    const activeLinks = document.querySelectorAll(`.nav-link[data-section="${activeSectionId}"], .dropdown-item[data-section="${activeSectionId}"]`);
    activeLinks.forEach(link => {
        link.classList.add('active');
        
        // If the link is in a dropdown, also activate the dropdown toggle
        const dropdownParent = link.closest('.dropdown');
        if (dropdownParent) {
            const dropdownToggle = dropdownParent.querySelector('.dropdown-toggle');
            if (dropdownToggle) {
                dropdownToggle.classList.add('active');
            }
        }
    });
}

/**
 * Handle scroll events
 */
function handleScrollEvents() {
    // Add scrolled class to navbar on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Show/hide back-to-top button
        const backToTop = document.querySelector('.back-to-top');
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });
    
    // Back to top button click event
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Setup form handlers
 */
function setupFormHandlers() {
    // Mahasiswa tracking form
    const trackingFormMhs = document.getElementById('trackingFormMahasiswa');
    if (trackingFormMhs) {
        trackingFormMhs.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading animation
            document.getElementById('loadingAnimation').style.display = 'block';
            
            // Simulate data loading (replace with actual API call)
            setTimeout(() => {
                // Hide loading animation
                document.getElementById('loadingAnimation').style.display = 'none';
                
                // Get form values
                const nim = document.getElementById('nim').value;
                const docType = document.getElementById('docTypeMhs').value;
                
                // Generate dummy data for demonstration
                const dummyData = generateTrackingData(nim, docType, 'mahasiswa');
                
                // Display results
                displayTrackingResults(dummyData, 'trackingResultsMhs');
                
                // Show results container
                const resultsContainer = trackingFormMhs.closest('.tracking-form').nextElementSibling;
                resultsContainer.style.display = 'block';
                
                // Scroll to results
                resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 1500);
        });
    }
    
    // Dosen tracking form
    const trackingFormDs = document.getElementById('trackingFormDosen');
    if (trackingFormDs) {
        trackingFormDs.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading animation
            document.getElementById('loadingAnimation').style.display = 'block';
            
            // Simulate data loading (replace with actual API call)
            setTimeout(() => {
                // Hide loading animation
                document.getElementById('loadingAnimation').style.display = 'none';
                
                // Get form values
                const nip = document.getElementById('nip').value;
                const docType = document.getElementById('docTypeDs').value;
                
                // Generate dummy data for demonstration
                const dummyData = generateTrackingData(nip, docType, 'dosen');
                
                // Display results
                displayTrackingResults(dummyData, 'trackingResultsDs');
                
                // Show results container
                const resultsContainer = trackingFormDs.closest('.tracking-form').nextElementSibling;
                resultsContainer.style.display = 'block';
                
                // Scroll to results
                resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 1500);
        });
    }
}

/**
 * Generate dummy tracking data for demonstration
 * @param {string} id - NIM or NIP
 * @param {string} docType - Document type
 * @param {string} userType - 'mahasiswa' or 'dosen'
 * @returns {Array} - Array of tracking data objects
 */
function generateTrackingData(id, docType, userType) {
    // Document types based on user type
    const docTypes = {
        mahasiswa: {
            'surat_pengantar': 'Surat Pengantar',
            'surat_kp': 'Surat Kerja Praktek',
            'surat_rekomendasi': 'Surat Rekomendasi',
            'legalisasi': 'Legalisasi Dokumen',
            'perubahan_mk': 'Perubahan Mata Kuliah'
        },
        dosen: {
            'surat_tugas': 'Surat Tugas',
            'surat_kerjasama': 'Surat Kerjasama',
            'sk_mengajar': 'SK Mengajar',
            'sk_penelitian': 'SK Penelitian',
            'sk_pengabdian': 'SK Pengabdian'
        }
    };
    
    // Possible statuses
    const statuses = ['Diproses', 'Diverifikasi', 'Dalam Review', 'Ditandatangani', 'Selesai', 'Dibatalkan', 'Ditolak'];
    
    // Possible stages
    const stages = ['Pengajuan', 'Verifikasi Admin', 'Review Kaprodi', 'Review Dekan', 'Pengesahan', 'Distribusi'];
    
    // Generate random number of documents (1-3)
    const numDocs = Math.floor(Math.random() * 3) + 1;
    const results = [];
    
    for (let i = 0; i < numDocs; i++) {
        // Generate random date in the last 30 days
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        const dateStr = date.toISOString().split('T')[0];
        
        // Generate random status
        const statusIndex = Math.floor(Math.random() * statuses.length);
        const status = statuses[statusIndex];
        
        // Generate random stage based on status
        let stage;
        if (status === 'Selesai') {
            stage = 'Distribusi';
        } else if (status === 'Dibatalkan' || status === 'Ditolak') {
            stage = stages[Math.floor(Math.random() * 3)];
        } else {
            stage = stages[Math.min(statusIndex, stages.length - 1)];
        }
        
        // Generate estimated completion date (7-14 days after submission)
        const estDate = new Date(date);
        estDate.setDate(estDate.getDate() + 7 + Math.floor(Math.random() * 7));
        const estDateStr = estDate.toISOString().split('T')[0];
        
        // Create document object
        const doc = {
            docNumber: `DOC-${userType.charAt(0).toUpperCase()}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            docType: docType ? docTypes[userType][docType] : Object.values(docTypes[userType])[Math.floor(Math.random() * Object.values(docTypes[userType]).length)],
            dateSubmit: dateStr,
            status: status,
            stage: stage,
            estCompletion: estDateStr
        };
        
        results.push(doc);
    }
    
    return results;
}

/**
 * Display tracking results in the specified container
 * @param {Array} data - Array of tracking data objects
 * @param {string} containerId - ID of the container to display results
 */
function displayTrackingResults(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Clear previous results
    container.innerHTML = '';
    
    // Check if we have data
    if (data.length === 0) {
        container.innerHTML = '<tr><td colspan="6" class="text-center">Tidak ada dokumen yang ditemukan</td></tr>';
        return;
    }
    
    // Create HTML for each document
    data.forEach(doc => {
        const row = document.createElement('tr');
        
        // Set status class
        let statusClass = '';
        switch (doc.status) {
            case 'Selesai':
                statusClass = 'text-success';
                break;
            case 'Dibatalkan':
            case 'Ditolak':
                statusClass = 'text-danger';
                break;
            case 'Diproses':
            case 'Diverifikasi':
            case 'Dalam Review':
                statusClass = 'text-primary';
                break;
            case 'Ditandatangani':
                statusClass = 'text-info';
                break;
            default:
                statusClass = '';
        }
        
        // Create table row
        row.innerHTML = `
            <td>${doc.docNumber}</td>
            <td>${doc.docType}</td>
            <td>${formatDate(doc.dateSubmit)}</td>
            <td><span class="${statusClass} fw-bold">${doc.status}</span></td>
            <td>${doc.stage}</td>
            <td>${formatDate(doc.estCompletion)}</td>
        `;
        
        container.appendChild(row);
    });
}

/**
 * Format date string to Indonesian format
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {string} - Formatted date string
 */
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

/**
 * Add animation to elements when they enter the viewport
 */
function animateOnScroll() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    animatedElements.forEach(element => {
        if (isElementInViewport(element)) {
            element.classList.add('animated');
        }
    });
}

/**
 * Check if an element is in the viewport
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - True if element is in viewport
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

/**
 * Set up smooth scrolling for all links with hash
 */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Call animateOnScroll function on scroll
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);