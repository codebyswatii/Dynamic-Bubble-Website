document.addEventListener('DOMContentLoaded', () => {
    // Ensure GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.error('GSAP is not loaded. CardNav requires GSAP.');
        return;
    }

    const navContainer = document.querySelector('.card-nav');
    if (!navContainer) return;

    const hamburger = document.querySelector('.hamburger-menu');
    const content = document.querySelector('.card-nav-content');
    const cards = document.querySelectorAll('.nav-card');
    
    // Configuration
    const ease = 'power3.out';
    let isExpanded = false;
    let tl = null;

    // Calculate the height needed for the expanded state
    const calculateHeight = () => {
        if (!navContainer) return 260; // Default desktop height
        
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (isMobile && content) {
             // Temporarily reset styles to measure natural height
             const prevVis = content.style.visibility;
             const prevPos = content.style.position;
             const prevH = content.style.height;
             const prevPointer = content.style.pointerEvents;
             
             content.style.visibility = 'visible';
             content.style.position = 'static';
             content.style.height = 'auto';
             content.style.pointerEvents = 'auto';
             
             // Force reflow
             // void content.offsetHeight;
             
             const contentHeight = content.scrollHeight;
             const topBarHeight = 60;
             const padding = 16;
             
             // Restore styles
             content.style.visibility = prevVis;
             content.style.position = prevPos;
             content.style.height = prevH;
             content.style.pointerEvents = prevPointer;
             
             return topBarHeight + contentHeight + padding;
        }
        return 260;
    };

    // Create the GSAP animation timeline
    const createTimeline = () => {
        // Initial setup
        if (!isExpanded) {
            gsap.set(navContainer, { height: 60 });
            gsap.set(cards, { y: 50, opacity: 0 });
        }

        const timeline = gsap.timeline({ paused: true });
        
        timeline.to(navContainer, {
            height: calculateHeight(),
            duration: 0.4,
            ease: ease
        });
        
        timeline.to(cards, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: ease,
            stagger: 0.08
        }, '-=0.1'); // Overlap slightly

        return timeline;
    };

    // Initialize animation timeline
    tl = createTimeline();

    // Toggle menu state
    const toggleMenu = () => {
        if (!tl) return;
        
        if (!isExpanded) {
            // Opening
            hamburger.classList.add('open');
            navContainer.classList.add('open');
            isExpanded = true;
            
            // Re-calculate timeline in case of resize/content change before open
            if(tl) tl.kill();
            tl = createTimeline();
            
            tl.play();
        } else {
            // Closing
            hamburger.classList.remove('open');
            
            tl.eventCallback('onReverseComplete', () => {
                navContainer.classList.remove('open');
                isExpanded = false;
                // Clean up callback
                tl.eventCallback('onReverseComplete', null);
            });
            tl.reverse();
        }
    };

    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
        // Accessibility
        hamburger.addEventListener('keydown', (e) => {
             if (e.key === 'Enter' || e.key === ' ') {
                 toggleMenu();
                 e.preventDefault();
             }
        });
    }

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if(isExpanded) {
                // If menu is open, refresh the timeline to adjust height
                if(tl) tl.kill();
                
                // Reset to ensure clean calculation
                // gsap.set(navContainer, { height: 'auto' }); 
                
                tl = createTimeline();
                tl.progress(1); // Jump to end state (open)
            } else {
                // If closed, just reset timeline for next open
                if(tl) tl.kill();
                tl = createTimeline();
            }
        }, 100);
    });
});
