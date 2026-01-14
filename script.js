document.addEventListener('DOMContentLoaded', () => {
    // Navigation Active State
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop()) {
            link.classList.add('active');
        }
    });

    // Simulation Filtering System
    const searchInput = document.getElementById('searchInput');
    const filterChips = document.querySelectorAll('.chip');
    const simCards = document.querySelectorAll('.sim-card');
    const gridContainer = document.getElementById('simulationsGrid');

    if (gridContainer) {
        // Search functionality
        searchInput?.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            filterSimulations(term, getActiveCategory());
        });

        // Category filter functionality
        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                // Remove active class from all chips
                filterChips.forEach(c => c.classList.remove('active'));
                // Add active class to clicked chip
                chip.classList.add('active');

                filterSimulations(searchInput.value.toLowerCase(), chip.dataset.category);
            });
        });

        // View toggle functionality
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const view = btn.dataset.view;
                if (view === 'list') {
                    gridContainer.style.gridTemplateColumns = '1fr';
                    simCards.forEach(card => card.style.flexDirection = 'row');
                } else {
                    gridContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
                    simCards.forEach(card => card.style.flexDirection = 'column');
                }
            });
        });

        // Check for category query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        if (categoryParam) {
            const targetChip = document.querySelector(`.chip[data-category="${categoryParam}"]`);
            if (targetChip) {
                filterChips.forEach(c => c.classList.remove('active'));
                targetChip.classList.add('active');
                filterSimulations(searchInput.value.toLowerCase(), categoryParam);
            }
        }
    }

    function getActiveCategory() {
        const activeChip = document.querySelector('.chip.active');
        return activeChip ? activeChip.dataset.category : 'all';
    }

    function filterSimulations(searchTerm, category) {
        simCards.forEach(card => {
            const title = card.querySelector('.sim-title').textContent.toLowerCase();
            const subtitle = card.querySelector('.sim-subtitle').textContent.toLowerCase();
            const cardCategories = card.dataset.category.split(' ');

            const matchesSearch = title.includes(searchTerm) || subtitle.includes(searchTerm);
            const matchesCategory = category === 'all' || cardCategories.includes(category);

            if (matchesSearch && matchesCategory) {
                card.style.display = 'flex';
                // Add small animation
                card.animate([
                    { opacity: 0, transform: 'scale(0.95)' },
                    { opacity: 1, transform: 'scale(1)' }
                ], { duration: 300, easing: 'ease-out' });
            } else {
                card.style.display = 'none';
            }
        });
    }
});

// Modal System
let currentSimulationUrl = '';

function openSimulation(url) {
    const modal = document.getElementById('simulationModal');
    const iframe = document.getElementById('simulationFrame');
    const title = document.getElementById('modalTitle');

    if (modal && iframe) {
        currentSimulationUrl = url;
        iframe.src = url;

        // Clean title from URL
        const cleanTitle = url.replace('.html', '').replace(/_/g, ' ').replace(/-/g, ' ');
        title.textContent = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeSimulation() {
    const modal = document.getElementById('simulationModal');
    const iframe = document.getElementById('simulationFrame');

    if (modal && iframe) {
        modal.classList.remove('active');
        setTimeout(() => {
            iframe.src = '';
            currentSimulationUrl = '';
        }, 300); // Wait for transition
        document.body.style.overflow = '';
    }
}

function openFullscreen(url) {
    // Open in new tab for true fullscreen experience
    window.open(url, '_blank');
}

function toggleFullscreenModal() {
    const modalContent = document.querySelector('.modal-content');
    if (!document.fullscreenElement) {
        modalContent.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Global functions for inline onclick handlers
window.openSimulation = openSimulation;
window.closeSimulation = closeSimulation;
window.openFullscreen = openFullscreen;
window.toggleFullscreenModal = toggleFullscreenModal;
