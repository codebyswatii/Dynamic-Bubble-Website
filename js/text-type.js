class TextTyper {
    constructor(element, options = {}) {
        this.element = element;
        // Default options matching the React component logic where possible
        this.text = options.text || [element.textContent.trim()]; // Default to existing text
        this.typingSpeed = options.typingSpeed || 25; // Faster default for long text
        this.deletingSpeed = options.deletingSpeed || 30;
        this.pauseDuration = options.pauseDuration || 2000;
        this.loop = options.loop !== undefined ? options.loop : false; // Default no loop for long paragraphs
        this.initialDelay = options.initialDelay || 500;
        this.cursorCharacter = options.cursorCharacter || '_';

        // State
        this.displayedText = '';
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isWaiting = false;

        // Setup DOM
        this.element.classList.add('text-type');
        this.element.innerHTML = '';

        this.contentSpan = document.createElement('span');
        this.contentSpan.className = 'text-type__content';
        this.element.appendChild(this.contentSpan);

        this.cursorSpan = document.createElement('span');
        this.cursorSpan.className = 'text-type__cursor';
        this.cursorSpan.textContent = this.cursorCharacter;
        this.element.appendChild(this.cursorSpan);

        // Observer to start when visible
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.start();
                    this.observer.disconnect();
                }
            });
        }, { threshold: 0.1 });

        this.observer.observe(this.element);
    }

    start() {
        setTimeout(() => this.tick(), this.initialDelay);
    }

    tick() {
        const currentString = this.text[this.currentTextIndex];

        if (this.isDeleting) {
            this.displayedText = currentString.substring(0, this.displayedText.length - 1);
        } else {
            this.displayedText = currentString.substring(0, this.displayedText.length + 1);
        }

        this.contentSpan.textContent = this.displayedText;

        let delta = this.typingSpeed;

        if (this.isDeleting) {
            delta = this.deletingSpeed;
        }

        if (!this.isDeleting && this.displayedText === currentString) {
            // Finished typing sentence
            if (!this.loop && this.currentTextIndex === this.text.length - 1) {
                // End of all texts and no loop
                this.cursorSpan.style.display = 'none'; // Optional: hide cursor at end
                return;
            }

            delta = this.pauseDuration;
            this.isDeleting = true;
        } else if (this.isDeleting && this.displayedText === '') {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.text.length;
            delta = 500; // Small pause before typing next
        }

        setTimeout(() => this.tick(), delta);
    }
}

// Auto-initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Select hero subtitles
    const subtitles = document.querySelectorAll('.hero-subtitle');

    subtitles.forEach(subtitle => {
        // We only want to animate if it hasn't been initialized
        if (!subtitle.dataset.textTypeInitialized) {
            new TextTyper(subtitle, {
                // You can customize per-element via attributes if needed
                // loop: false
            });
            subtitle.dataset.textTypeInitialized = 'true';
        }
    });
});
