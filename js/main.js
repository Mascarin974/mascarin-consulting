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
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
      header.style.height = '70px';
    } else {
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)';
      header.style.height = '80px';
    }
  });

  // ================================================
  // CONTACT FORM SUBMISSION
  // ================================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('Contact form submitted!');

      const request = {
        id: 'contact_' + Date.now(),
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
        status: 'unread',
        date: new Date().toISOString()
      };

      console.log('Contact request:', request);

      let contacts = [];
      try {
        contacts = JSON.parse(localStorage.getItem('mascarinContactRequests') || '[]');
      } catch (e) {
        contacts = [];
      }

      contacts.push(request);
      localStorage.setItem('mascarinContactRequests', JSON.stringify(contacts));

      alert('✅ Votre message a bien été envoyé !');
      contactForm.reset();
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
      document.getElementById('rdv-modal').classList.add('active');
      document.getElementById('rdv-form').style.display = 'block';
      document.getElementById('rdv-success').style.display = 'none';
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
      console.log('RDV form submitted!');

      // Get form data
      const request = {
        id: 'request_' + Date.now(),
        clientName: document.getElementById('rdv-name').value,
        clientEmail: document.getElementById('rdv-email').value,
        clientPhone: document.getElementById('rdv-phone').value,
        serviceType: document.getElementById('rdv-service').value,
        preferredDate: document.getElementById('rdv-date').value,
        preferredTime: document.getElementById('rdv-time').value,
        message: document.getElementById('rdv-message').value,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      console.log('RDV request:', request);

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

      console.log('✅ Appointment request saved:', request);
    });
  } else {
    console.error('RDV form not found!');
  }
});
