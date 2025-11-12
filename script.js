// ------------------------------------------------------------------
// --- Hamburger Menu Script (Updated with Animation) ---
// ------------------------------------------------------------------

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// Ensure both elements exist before adding the listener
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        // Toggle active class on menu (slide/fade the menu container)
        navLinks.classList.toggle('active');
        
        // Toggle active class on hamburger (animate the icon, e.g., turn lines into an X)
        hamburger.classList.toggle('active');
    });
}

// ------------------------------------------------------------------
// --- REVIEWS CAROUSEL SCRIPT ---
// ------------------------------------------------------------------

// Wait for the DOM to be ready before running the script
document.addEventListener('DOMContentLoaded', () => {
    const trackContainer = document.querySelector('.carousel-track-container');
    const track = document.querySelector('.carousel-track');

    // Check if carousel elements exist before running
    if (!track) {
        console.log("Carousel track not found. Script not running.");
        return;
    }

    const slides = Array.from(track.children);
    const nextButton = document.getElementById('carousel-right');
    const prevButton = document.getElementById('carousel-left');
    const dotsNav = document.querySelector('.carousel-indicators');

    let slidesPerView = getSlidesPerView();
    let totalSlides = slides.length;
    let totalPages = Math.ceil(totalSlides / slidesPerView);
    let currentPage = 0;

    // --- 1. Create Dots ---
    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('button');
        dot.classList.add('indicator-dot');
        if (i === 0) dot.classList.add('active');
        dot.dataset.page = i;
        dotsNav.appendChild(dot);
    }
    const dots = Array.from(dotsNav.children);

    // --- 2. Helper Functions ---

    // Get how many slides are visible based on CSS
    function getSlidesPerView() {
        const card = slides[0];
        if (!card) return 1;
        
        // Calculate based on the flex-basis or width
        const cardWidth = card.getBoundingClientRect().width;
        const trackWidth = trackContainer.getBoundingClientRect().width;

        // Add a small tolerance for fractional widths
        let count = Math.round(trackWidth / cardWidth);
        return Math.max(1, count); // Ensure at least 1
    }

    // Move track to the correct page
    function moveToPage(pageIndex) {
        const slideWidth = slides[0].getBoundingClientRect().width;
        
        // Move by the width of *one slide* multiplied by the number of slides *per view*
        const offset = slideWidth * slidesPerView * pageIndex;
        track.style.transform = `translateX(-${offset}px)`;
        
        currentPage = pageIndex;
        updateUI();
    }

    // Update dots and arrows
    function updateUI() {
        // Update Dots
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentPage]) {
            dots[currentPage].classList.add('active');
        }

        // Update Arrows (Visibility)
        if (currentPage === 0) {
            prevButton.classList.add('hidden');
        } else {
            prevButton.classList.remove('hidden');
        }

        if (currentPage === totalPages - 1) {
            nextButton.classList.add('hidden');
        } else {
            nextButton.classList.remove('hidden');
        }
    }

    // Recalculate everything on window resize
    function handleResize() {
        slidesPerView = getSlidesPerView();
        totalPages = Math.ceil(totalSlides / slidesPerView);

        // Remove old dots and create new ones
        dotsNav.innerHTML = '';
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.classList.add('indicator-dot');
            dot.dataset.page = i;
            dotsNav.appendChild(dot);
        }
        
        // Re-assign dots array
        dots.splice(0, dots.length, ...Array.from(dotsNav.children));

        // Go to the first page and update UI
        moveToPage(0);
    }

    // --- 3. Event Listeners ---

    // Next Button
    nextButton.addEventListener('click', e => {
        if (currentPage < totalPages - 1) {
            moveToPage(currentPage + 1);
        }
    });

    // Previous Button
    prevButton.addEventListener('click', e => {
        if (currentPage > 0) {
            moveToPage(currentPage - 1);
        }
    });

    // Dots Navigation
    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('button.indicator-dot');
        if (!targetDot) return;

        const targetPage = parseInt(targetDot.dataset.page);
        moveToPage(targetPage);
    });

    // Window Resize
    // Use a debounce function to avoid firing too often
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 250);
    });

    // --- 4. Initial Setup ---
    // Set initial position and UI state
    moveToPage(0);
});

// ------------------------------------------------------------------
// --- FAQ ACCORDION SCRIPT ---
// ------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length === 0) return;

    // --- 1. Logic for Toggling Classes and Icons (Handles state and closing others) ---

    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');
        const icon = item.querySelector('.faq-icon');

        questionButton.addEventListener('click', () => {
            // Check if the clicked item is already active
            const wasActive = item.classList.contains('active');

            // 1. Close all other items and reset their icons
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                // Ensure icon element exists before attempting to set textContent
                const otherIcon = otherItem.querySelector('.faq-icon');
                if (otherIcon) {
                    otherIcon.textContent = '+';
                }
            });

            // 2. If it wasn't active, open it
            if (!wasActive) {
                item.classList.add('active');
                icon.textContent = '–'; // Change to minus
            }
            // If it was active, it's now closed (by step 1)
        });
    });

    // --- 2. Initial Setup (Setting max-height for CSS transition) ---

    const firstItem = document.querySelector('.faq-item.active');
    if (firstItem) {
        const answer = firstItem.querySelector('.faq-answer');
        // We set max-height directly on load so it's open
        if (answer) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    }

    // --- 3. Logic for Setting max-height (Handles smooth animation) ---
    // Re-calculate scrollHeight on click for smooth animation

    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        // This listener ensures the CSS transition works correctly 
        // by calculating the exact height *after* the state changes.
        questionButton.addEventListener('click', () => {
            if (item.classList.contains('active')) {
                // Set max-height to the specific height of its content
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                // Reset max-height to 0 for the closing transition
                answer.style.maxHeight = '0px';
            }
        });
    });
});

// ------------------------------------------------------------------
// --- SCROLL TO TOP SCRIPT ---
// ------------------------------------------------------------------

// Get the button element
const scrollTopBtn = document.getElementById('scrollTopBtn');

// Add a check to ensure the button exists before attaching listeners
if (scrollTopBtn) {
    
    // Listen for scroll events to control button visibility
    window.addEventListener('scroll', () => {
        // Check how far we've scrolled (e.g., past half the viewport height)
        // window.innerHeight is roughly the height of the Home section
        const scrollThreshold = window.innerHeight / 2;

        if (window.scrollY > scrollThreshold) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // Scroll back to top when clicked
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}