// ===================================
// Mobile Navigation Toggle
// ===================================

const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navbarMenu = document.querySelector('.navbar-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');

        // Update aria-expanded for accessibility
        const isExpanded = navbarMenu.classList.contains('active');
        mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.navbar-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navbarMenu.classList.remove('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
});

// ===================================
// Active Navigation State
// ===================================

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-menu a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Set active link on page load
document.addEventListener('DOMContentLoaded', setActiveNavLink);

// ===================================
// Scroll Reveal Animations
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            // Stop observing once revealed (animation only plays once)
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with scroll-reveal class
document.addEventListener('DOMContentLoaded', () => {
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    scrollRevealElements.forEach(el => observer.observe(el));
});

// ===================================
// Smooth Scrolling for Anchor Links
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Only prevent default for actual anchor links (not just "#")
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===================================
// Form Validation & Submission
// ===================================

const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Reset previous errors
        const errorElements = document.querySelectorAll('.form-group.error');
        errorElements.forEach(el => el.classList.remove('error'));

        let isValid = true;

        // Validate Name
        const nameInput = document.getElementById('name');
        if (nameInput && nameInput.value.trim() === '') {
            showError(nameInput, 'Please enter your name');
            isValid = false;
        }

        // Validate Email
        const emailInput = document.getElementById('email');
        if (emailInput) {
            const emailValue = emailInput.value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (emailValue === '') {
                showError(emailInput, 'Please enter your email');
                isValid = false;
            } else if (!emailPattern.test(emailValue)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }
        }

        // Validate Service Selection
        const serviceInput = document.getElementById('service');
        if (serviceInput && serviceInput.value === '') {
            showError(serviceInput, 'Please select a service');
            isValid = false;
        }

        // Validate Message
        const messageInput = document.getElementById('message');
        if (messageInput && messageInput.value.trim() === '') {
            showError(messageInput, 'Please enter a message');
            isValid = false;
        }

        // If form is valid, show success message
        if (isValid) {
            showSuccessMessage();
            contactForm.reset();
        }
    });
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');

    const errorElement = formGroup.querySelector('.form-error');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function showSuccessMessage() {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #48BB78, #38A169);
            color: white;
            padding: 1.5rem;
            border-radius: 0.75rem;
            margin-bottom: 2rem;
            text-align: center;
            box-shadow: 0 10px 15px -3px rgba(72, 187, 120, 0.3);
            animation: fadeInUp 0.5s ease-out;
        ">
            <h3 style="margin: 0 0 0.5rem 0; color: white;">Thank You! 🎉</h3>
            <p style="margin: 0; opacity: 0.95;">We've received your message and will get back to you within 24 hours.</p>
        </div>
    `;

    // Insert before form
    contactForm.parentNode.insertBefore(successDiv, contactForm);

    // Scroll to success message
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.style.transition = 'opacity 0.5s ease-out';
        successDiv.style.opacity = '0';
        setTimeout(() => successDiv.remove(), 500);
    }, 5000);
}

// ===================================
// Navbar Shadow on Scroll
// ===================================

let lastScroll = 0;
const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }

        lastScroll = currentScroll;
    });
}

// ===================================
// FAQ Accordion Toggle
// ===================================

const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.closest('.faq-item');
        const isActive = faqItem.classList.contains('active');

        // Close all other FAQ items for accordion effect
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
                const btn = item.querySelector('.faq-question');
                if (btn) {
                    btn.setAttribute('aria-expanded', 'false');
                }
            }
        });

        // Toggle current item
        faqItem.classList.toggle('active');
        question.setAttribute('aria-expanded', !isActive);

        // Smooth scroll to item if opening and not fully visible
        if (!isActive) {
            setTimeout(() => {
                const rect = faqItem.getBoundingClientRect();
                const isFullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

                if (!isFullyVisible) {
                    faqItem.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
            }, 300); // Wait for animation to start
        }
    });
});

// ===================================
// Newsletter Form Handler
// ===================================

const newsletterForm = document.getElementById('newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();

        // Simple email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailPattern.test(email)) {
            // Show success message
            showNewsletterSuccess();
            emailInput.value = '';
        } else {
            alert('Please enter a valid email address');
        }
    });
}

function showNewsletterSuccess() {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10B981, #059669);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-family: var(--font-family);
    `;
    successDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.5rem;">✅</span>
            <div>
                <strong style="display: block; margin-bottom: 0.25rem;">Success!</strong>
                <span style="font-size: 0.875rem; opacity: 0.95;">You've subscribed to our newsletter</span>
            </div>
        </div>
    `;

    document.body.appendChild(successDiv);

    // Remove after 4 seconds
    setTimeout(() => {
        successDiv.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        successDiv.style.opacity = '0';
        successDiv.style.transform = 'translateX(100%)';
        setTimeout(() => successDiv.remove(), 300);
    }, 4000);
}

// Add slideInRight animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// Dynamic Copyright Year
// ===================================

const copyrightYear = document.getElementById('copyright-year');
if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
}
