/**
 * Layanan Administrasi Prima FSTI
 * 3D Animations using Three.js
 */

// Global variables
let container3D, scene, camera, renderer, controls;
let documentGroup, documentPages = [];
let flowGroup, flowLines = [];
let organizationCube;
let isAnimating = true;
let clock = new THREE.Clock();

/**
 * Initialize 3D animation containers
 */
function init3DAnimations() {
    // Initialize all 3D containers
    initHero3D();
    initDocumentFlow3D();
    initOrganizationChart3D();
    
    // Start animation loop
    animate();
    
    // Add resize handler
    window.addEventListener('resize', onWindowResize);
    
    // Add pause/resume on visibility change
    document.addEventListener('visibilitychange', toggleAnimation);
}

/**
 * Initialize 3D animation for hero section
 */
function initHero3D() {
    // Get container
    container3D = document.getElementById('hero-3d-container');
    if (!container3D) return;
    
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(50, container3D.clientWidth / container3D.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container3D.clientWidth, container3D.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container3D.appendChild(renderer.domElement);
    
    // Add orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create floating document
    createFloatingDocument();
}

/**
 * Create floating 3D document for hero section
 */
function createFloatingDocument() {
    documentGroup = new THREE.Group();
    
    // Create pages
    const pageGeometry = new THREE.PlaneGeometry(2, 3, 1, 1);
    
    // Main page
    const pageTexture1 = createDocumentTexture('Layanan Administrasi', 'FSTI');
    const pageMaterial1 = new THREE.MeshLambertMaterial({ 
        map: pageTexture1, 
        side: THREE.DoubleSide,
        transparent: true
    });
    const page1 = new THREE.Mesh(pageGeometry, pageMaterial1);
    page1.position.z = 0.05;
    documentGroup.add(page1);
    documentPages.push(page1);
    
    // Second page
    const pageTexture2 = createDocumentTexture('Surat Pengajuan', 'Dokumen Akademik');
    const pageMaterial2 = new THREE.MeshLambertMaterial({ 
        map: pageTexture2, 
        side: THREE.DoubleSide,
        transparent: true
    });
    const page2 = new THREE.Mesh(pageGeometry, pageMaterial2);
    page2.position.z = 0.02;
    page2.position.x = 0.1;
    page2.position.y = -0.1;
    page2.rotation.z = THREE.Math.degToRad(5);
    documentGroup.add(page2);
    documentPages.push(page2);
    
    // Third page
    const pageTexture3 = createDocumentTexture('Layanan', 'Mahasiswa & Dosen');
    const pageMaterial3 = new THREE.MeshLambertMaterial({ 
        map: pageTexture3, 
        side: THREE.DoubleSide,
        transparent: true
    });
    const page3 = new THREE.Mesh(pageGeometry, pageMaterial3);
    page3.position.z = -0.02;
    page3.position.x = -0.1;
    page3.position.y = -0.2;
    page3.rotation.z = THREE.Math.degToRad(-7);
    documentGroup.add(page3);
    documentPages.push(page3);
    
    // Add group to scene
    scene.add(documentGroup);
    
    // Position the document group
    documentGroup.position.y = 0.5;
}

/**
 * Create document texture with text
 */
function createDocumentTexture(title, subtitle) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 768;
    
    const context = canvas.getContext('2d');
    
    // Background with slight gradient
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#f0f4ff');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add border
    context.strokeStyle = '#2f4dd3';
    context.lineWidth = 10;
    context.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    // Add header background
    context.fillStyle = '#2f4dd3';
    context.fillRect(30, 30, canvas.width - 60, 100);
    
    // Add FSTI logo
    const logoSize = 60;
    context.fillStyle = '#ffffff';
    context.beginPath();
    context.arc(70, 80, logoSize / 2, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#2f4dd3';
    context.font = 'bold 30px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('FSTI', 70, 80);
    
    // Add title
    context.fillStyle = '#ffffff';
    context.font = 'bold 40px Arial';
    context.textAlign = 'center';
    context.fillText(title, canvas.width / 2 + 30, 80);
    
    // Add subtitle
    context.fillStyle = '#2f4dd3';
    context.font = 'bold 50px Arial';
    context.fillText(subtitle, canvas.width / 2, 200);
    
    // Add content lines
    context.fillStyle = '#333333';
    context.font = '20px Arial';
    context.textAlign = 'left';
    
    for (let i = 0; i < 15; i++) {
        const lineWidth = Math.random() * 350 + 50;
        context.fillRect(80, 280 + i * 30, lineWidth, 8);
    }
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    return texture;
}

/**
 * Initialize 3D animation for document flow
 */
function initDocumentFlow3D() {
    // Get container
    const flowContainer = document.getElementById('flow-3d-container');
    if (!flowContainer) return;
    
    // Create scene
    const flowScene = new THREE.Scene();
    flowScene.background = new THREE.Color(0xf8f9fa);
    
    // Create camera
    const flowCamera = new THREE.PerspectiveCamera(50, flowContainer.clientWidth / flowContainer.clientHeight, 0.1, 1000);
    flowCamera.position.set(0, 0, 10);
    
    // Create renderer
    const flowRenderer = new THREE.WebGLRenderer({ antialias: true });
    flowRenderer.setSize(flowContainer.clientWidth, flowContainer.clientHeight);
    flowRenderer.setPixelRatio(window.devicePixelRatio);
    flowContainer.appendChild(flowRenderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    flowScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    flowScene.add(directionalLight);
    
    // Create document flow
    flowGroup = new THREE.Group();
    
    // Create nodes
    const nodeGeometry = new THREE.BoxGeometry(1, 1, 0.2);
    const nodeMaterials = [
        new THREE.MeshLambertMaterial({ color: 0x2f4dd3 }), // Submission
        new THREE.MeshLambertMaterial({ color: 0x5a75e6 }), // Verification
        new THREE.MeshLambertMaterial({ color: 0x8a9ce9 }), // Review
        new THREE.MeshLambertMaterial({ color: 0x4caf50 }), // Approval
        new THREE.MeshLambertMaterial({ color: 0x2196f3 })  // Distribution
    ];
    
    const nodePositions = [
        new THREE.Vector3(-6, 0, 0),    // Submission
        new THREE.Vector3(-3, 0, 0),    // Verification
        new THREE.Vector3(0, 0, 0),     // Review
        new THREE.Vector3(3, 0, 0),     // Approval
        new THREE.Vector3(6, 0, 0)      // Distribution
    ];
    
    // Create nodes
    const nodes = [];
    for (let i = 0; i < 5; i++) {
        const node = new THREE.Mesh(nodeGeometry, nodeMaterials[i]);
        node.position.copy(nodePositions[i]);
        flowGroup.add(node);
        nodes.push(node);
    }
    
    // Create connecting lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x2f4dd3 });
    
    for (let i = 0; i < 4; i++) {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            nodePositions[i],
            nodePositions[i + 1]
        ]);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        flowGroup.add(line);
        flowLines.push(line);
    }
    
    // Add animated document
    const docGeometry = new THREE.PlaneGeometry(0.8, 1, 1, 1);
    const docTexture = createDocumentTexture('Dokumen', 'FSTI');
    const docMaterial = new THREE.MeshLambertMaterial({ 
        map: docTexture, 
        side: THREE.DoubleSide,
        transparent: true
    });
    
    const flowDoc = new THREE.Mesh(docGeometry, docMaterial);
    flowDoc.position.copy(nodePositions[0]);
    flowDoc.position.y = 1.5;
    flowGroup.add(flowDoc);
    
    // Animation for the document
    const docTween = new TWEEN.Tween(flowDoc.position)
        .to({ x: nodePositions[4].x }, 10000)
        .delay(1000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(() => {
            // Make the document float up and down
            flowDoc.position.y = 1.5 + Math.sin(Date.now() * 0.002) * 0.2;
            // Make the document rotate slightly
            flowDoc.rotation.z = Math.sin(Date.now() * 0.001) * 0.1;
        })
        .onComplete(() => {
            // Restart animation
            flowDoc.position.x = nodePositions[0].x;
            docTween.start();
        })
        .start();
    
    // Add the group to the scene
    flowScene.add(flowGroup);
    
    // Create animation loop for this scene
    function animateFlow() {
        if (!isAnimating) return;
        
        requestAnimationFrame(animateFlow);
        
        // Rotate each node
        nodes.forEach(node => {
            node.rotation.y += 0.01;
        });
        
        // Update tweens
        TWEEN.update();
        
        // Render the scene
        flowRenderer.render(flowScene, flowCamera);
    }
    
    // Start animation
    animateFlow();
}

/**
 * Initialize 3D animation for organization chart
 */
function initOrganizationChart3D() {
    // Get container
    const orgContainer = document.getElementById('org-3d-container');
    if (!orgContainer) return;
    
    // Create scene
    const orgScene = new THREE.Scene();
    orgScene.background = new THREE.Color(0xf8f9fa);
    
    // Create camera
    const orgCamera = new THREE.PerspectiveCamera(50, orgContainer.clientWidth / orgContainer.clientHeight, 0.1, 1000);
    orgCamera.position.set(0, 0, 12);
    
    // Create renderer
    const orgRenderer = new THREE.WebGLRenderer({ antialias: true });
    orgRenderer.setSize(orgContainer.clientWidth, orgContainer.clientHeight);
    orgRenderer.setPixelRatio(window.devicePixelRatio);
    orgContainer.appendChild(orgRenderer.domElement);
    
    // Add orbit controls
    const orgControls = new THREE.OrbitControls(orgCamera, orgRenderer.domElement);
    orgControls.enableDamping = true;
    orgControls.dampingFactor = 0.05;
    orgControls.enableZoom = false;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    orgScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    orgScene.add(directionalLight);
    
    // Create organization chart
    const orgGroup = new THREE.Group();
    
    // Create positions for nodes (hierarchical structure)
    const positions = [
        // Level 1 - Dekan
        new THREE.Vector3(0, 4, 0),
        
        // Level 2 - Wakil Dekan
        new THREE.Vector3(-3, 2, 0),
        new THREE.Vector3(3, 2, 0),
        
        // Level 3 - Kaprodi
        new THREE.Vector3(-6, 0, 0),
        new THREE.Vector3(-2, 0, 0),
        new THREE.Vector3(2, 0, 0),
        new THREE.Vector3(6, 0, 0),
        
        // Level 4 - Staff/Dosen
        new THREE.Vector3(-7, -2, 0),
        new THREE.Vector3(-5, -2, 0),
        new THREE.Vector3(-3, -2, 0),
        new THREE.Vector3(-1, -2, 0),
        new THREE.Vector3(1, -2, 0),
        new THREE.Vector3(3, -2, 0),
        new THREE.Vector3(5, -2, 0),
        new THREE.Vector3(7, -2, 0),
    ];
    
    // Create node materials with different colors based on hierarchy
    const nodeMaterials = [
        new THREE.MeshLambertMaterial({ color: 0x2f4dd3 }),  // Dekan
        new THREE.MeshLambertMaterial({ color: 0x5a75e6 }),  // Wakil Dekan
        new THREE.MeshLambertMaterial({ color: 0x8a9ce9 }),  // Kaprodi
        new THREE.MeshLambertMaterial({ color: 0xc5cdf4 })   // Staff/Dosen
    ];
    
    // Create nodes
    const nodes = [];
    positions.forEach((position, index) => {
        let nodeGeometry;
        let level;
        
        // Determine hierarchy level and geometry
        if (index === 0) {
            // Dekan
            nodeGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
            level = 0;
        } else if (index <= 2) {
            // Wakil Dekan
            nodeGeometry = new THREE.BoxGeometry(1.1, 1.1, 1.1);
            level = 1;
        } else if (index <= 6) {
            // Kaprodi
            nodeGeometry = new THREE.BoxGeometry(1, 1, 1);
            level = 2;
        } else {
            // Staff/Dosen
            nodeGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
            level = 3;
        }
        
        const node = new THREE.Mesh(nodeGeometry, nodeMaterials[level]);
        node.position.copy(position);
        orgGroup.add(node);
        nodes.push(node);
    });
    
    // Create connecting lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x2f4dd3 });
    
    // Connect Dekan to Wakil Dekan
    for (let i = 1; i <= 2; i++) {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            positions[0],
            positions[i]
        ]);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        orgGroup.add(line);
    }
    
    // Connect Wakil Dekan to Kaprodi
    for (let i = 3; i <= 6; i++) {
        const parentIndex = i <= 4 ? 1 : 2; // First or second Wakil Dekan
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            positions[parentIndex],
            positions[i]
        ]);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        orgGroup.add(line);
    }
    
    // Connect Kaprodi to Staff/Dosen
    for (let i = 7; i <= 14; i++) {
        const parentIndex = 3 + Math.floor((i - 7) / 2); // Distribute staff to Kaprodi
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            positions[parentIndex],
            positions[i]
        ]);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        orgGroup.add(line);
    }
    
    // Add labels
    const titles = ['Dekan', 'Wakil Dekan I', 'Wakil Dekan II', 'Kaprodi TI', 'Kaprodi SI', 'Kaprodi DS', 'Kaprodi MI'];
    
    for (let i = 0; i < 7; i++) {
        const label = createTextLabel(titles[i]);
        label.position.copy(positions[i]);
        label.position.y -= 1;
        orgGroup.add(label);
    }
    
    // Add the group to the scene
    orgScene.add(orgGroup);
    
    // Create animation loop for this scene
    function animateOrg() {
        if (!isAnimating) return;
        
        requestAnimationFrame(animateOrg);
        
        // Rotate each node
        nodes.forEach(node => {
            node.rotation.x += 0.005;
            node.rotation.y += 0.005;
        });
        
        // Update controls
        orgControls.update();
        
        // Render the scene
        orgRenderer.render(orgScene, orgCamera);
    }
    
    // Start animation
    animateOrg();
}

/**
 * Create text label for 3D scene
 */
function createTextLabel(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.fillStyle = '#2f4dd3';
    context.font = 'bold 24px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    // Create sprite material
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(2, 0.5, 1);
    
    return sprite;
}

/**
 * Global animation loop
 */
function animate() {
    if (!isAnimating) return;
    
    requestAnimationFrame(animate);
    
    // Update controls
    if (controls) controls.update();
    
    // Animate documents floating
    animateDocuments();
    
    // Render main scene
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

/**
 * Animate floating documents
 */
function animateDocuments() {
    if (!documentPages || documentPages.length === 0) return;
    
    const time = clock.getElapsedTime();
    
    // Float each page slightly differently
    documentPages.forEach((page, index) => {
        page.position.y = Math.sin(time * (0.5 + index * 0.1)) * 0.1;
        page.rotation.z = THREE.Math.degToRad(Math.sin(time * (0.2 + index * 0.05)) * 3 + (index === 0 ? 0 : index === 1 ? 5 : -7));
    });
    
    // Rotate the entire document group
    if (documentGroup) {
        documentGroup.rotation.y = time * 0.3;
    }
}

/**
 * Handle window resize
 */
function onWindowResize() {
    // Update main hero container
    if (container3D && camera && renderer) {
        camera.aspect = container3D.clientWidth / container3D.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container3D.clientWidth, container3D.clientHeight);
    }
    
    // Update other containers
    // Would need to update other scenes/renderers/cameras similarly
}

/**
 * Toggle animation when page visibility changes
 */
function toggleAnimation() {
    isAnimating = !document.hidden;
    
    if (isAnimating) {
        clock.start();
        animate();
    } else {
        clock.stop();
    }
}

// Initialize 3D animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add Three.js scripts dynamically
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/110/three.min.js', function() {
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.umd.min.js', function() {
            loadScript('https://cdn.jsdelivr.net/npm/three@0.110.0/examples/js/controls/OrbitControls.js', function() {
                // Initialize 3D animations after all scripts are loaded
                init3DAnimations();
            });
        });
    });
});

/**
 * Load script dynamically
 */
function loadScript(url, callback) {
    const script = document.createElement('script');
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}