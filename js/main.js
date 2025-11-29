console.log('main.js loaded - FIX APPLIED');
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('nav');

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        // Close menu when clicking a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Header Scroll Effect
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                header.style.height = '70px';
            } else {
                header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)';
                header.style.height = '80px';
            }
        });
    }

    // ================================================
    // CONTACT FORM SUBMISSION
    // ================================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            try {
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const message = document.getElementById('message').value;

                const request = {
                    id: 'contact_' + Date.now(),
                    name: name,
                    email: email,
                    message: message,
                    status: 'unread',
                    date: new Date().toISOString()
                };

                let contacts = [];
                const saved = localStorage.getItem('mascarinContacts');

                if (saved) {
                    try {
                        contacts = JSON.parse(saved);
                    } catch (e) {
                        console.error('Error parsing localStorage:', e);
                        contacts = [];
                    }
                }

                if (!Array.isArray(contacts)) {
                    contacts = [];
                }

                contacts.push(request);
                const newContent = JSON.stringify(contacts);
                localStorage.setItem('mascarinContacts', newContent);

                // Verify save
                const verify = localStorage.getItem('mascarinContacts');
                if (verify === newContent) {
                    alert('✅ Votre message a bien été envoyé !');
                    contactForm.reset();
                } else {
                    alert('❌ Erreur lors de la sauvegarde du message. Veuillez réessayer.');
                }

            } catch (error) {
                console.error('Error in contact form:', error);
                alert('Une erreur est survenue: ' + error.message);
            }
        });
    }

    // ================================================
    // RDV MODAL HANDLING
    // ================================================

    // Open RDV Modal
    const navCta = document.querySelector('.nav-cta');
    if (navCta) {
        navCta.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.getElementById('rdv-modal');
            if (modal) {
                modal.classList.add('active');
                document.getElementById('rdv-form').style.display = 'block';
                document.getElementById('rdv-success').style.display = 'none';
            }
        });
    }

    // Close RDV Modal
    const closeRdvModal = document.getElementById('close-rdv-modal');
    if (closeRdvModal) {
        closeRdvModal.addEventListener('click', () => {
            document.getElementById('rdv-modal').classList.remove('active');
            document.getElementById('rdv-form').reset();
        });
    }

    const cancelRdv = document.getElementById('cancel-rdv');
    if (cancelRdv) {
        cancelRdv.addEventListener('click', () => {
            document.getElementById('rdv-modal').classList.remove('active');
            document.getElementById('rdv-form').reset();
        });
    }

    const closeSuccess = document.getElementById('close-success');
    if (closeSuccess) {
        closeSuccess.addEventListener('click', () => {
            document.getElementById('rdv-modal').classList.remove('active');
            document.getElementById('rdv-form').reset();
        });
    }

    // Close modal on overlay click
    const rdvModal = document.getElementById('rdv-modal');
    if (rdvModal) {
        rdvModal.addEventListener('click', (e) => {
            if (e.target.id === 'rdv-modal') {
                document.getElementById('rdv-modal').classList.remove('active');
                document.getElementById('rdv-form').reset();
            }
        });
    }

    // Handle RDV form submission
    const rdvForm = document.getElementById('rdv-form');
    if (rdvForm) {
        rdvForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const request = {
                id: 'request_' + Date.now(),
                name: document.getElementById('rdv-name').value,
                email: document.getElementById('rdv-email').value,
                phone: document.getElementById('rdv-phone').value,
                service: document.getElementById('rdv-service').value,
                preferredDate: document.getElementById('rdv-date').value,
                preferredTime: document.getElementById('rdv-time').value,
                message: document.getElementById('rdv-message').value,
                status: 'pending',
                date: new Date().toISOString()
            };

            // Get existing requests from localStorage
            let requests = [];
            const savedRequests = localStorage.getItem('mascarinRequests');
            if (savedRequests) {
                try {
                    requests = JSON.parse(savedRequests);
                } catch (e) {
                    console.error('Error loading requests:', e);
                    requests = [];
                }
            }

            // Add new request
            requests.push(request);

            // Save to localStorage
            localStorage.setItem('mascarinRequests', JSON.stringify(requests));

            // Show success message
            document.getElementById('rdv-form').style.display = 'none';
            document.getElementById('rdv-success').style.display = 'block';

            // Reset form
            rdvForm.reset();
        });
    }
    // ================================================
    // ADMIN SHORTCUT
    // ================================================
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && (e.key === 'L' || e.key === 'l')) {
            e.preventDefault();
            window.location.href = './admin-dashboard.html';
        }
    });
});
