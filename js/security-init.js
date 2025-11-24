// Initialisation des modules de sécurité
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔐 Initializing security modules...');

    try {
        // Initialize security classes
        window.securityManager = new SecurityManager();
        window.sanitizer = new InputSanitizer();
        window.csrfProtection = new CSRFProtection();
        window.securityMonitor = new SecurityMonitor();
        window.sessionManager = new SessionManager(30); // 30 minutes timeout

        // Initialize automatic protections
        window.csrfProtection.protectAllForms();
        window.securityMonitor.initAutoTracking();

        // Setup session timeout
        window.sessionManager.startMonitoring(
            // On timeout
            () => {
                alert('Votre session a expiré par inactivité. Vous allez être déconnecté.');
                sessionStorage.removeItem('adminAuthenticated');
                window.location.reload();
            },
            // On warning
            (minutesLeft) => {
                const shouldContinue = confirm(`Votre session va expirer dans ${minutesLeft} minute(s). Voulez-vous continuer ?`);
                if (shouldContinue) {
                    window.sessionManager.updateActivity();
                }
            }
        );

        console.log('✅ Security modules initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing security modules:', error);
    }
});

// Override original handleLogin if it exists
const originalSetupEventListeners = window.setupEventListeners;
if (typeof originalSetupEventListeners === 'function') {
    window.setupEventListeners = function () {
        originalSetupEventListeners();

        // Add security to login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', function (e) {
                e.preventDefault();
                e.stopPropagation();

                // Check if user is blocked
                const blockStatus = window.securityManager.isBlocked();
                const errorEl = document.getElementById('login-error');

                if (blockStatus.blocked) {
                    const timeLeft = window.securityManager.formatRemainingTime(blockStatus.remainingTime);
                    errorEl.textContent = `🔒 Trop de tentatives échouées. Veuillez réessayer dans ${timeLeft}.`;
                    errorEl.classList.add('show');
                    errorEl.style.color = 'var(--danger)';
                    return false;
                }

                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;

                //Sanitize inputs
                const emailResult = window.sanitizer.sanitizeEmail(email);

                if (!emailResult.valid) {
                    errorEl.textContent = 'Format d\'email invalide';
                    errorEl.classList.add('show');
                    document.getElementById('login-password').value = '';
                    return false;
                }

                // Check credentials (using global ADMIN_EMAIL and ADMIN_PASSWORD if they exist)
                const ADMIN_EMAIL = 'abonnelchristian@hotmail.com';
                const ADMIN_PASSWORD = 'Kheter@admin_masca974';

                if (emailResult.sanitized === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                    // Successful login
                    window.securityManager.resetAttempts();
                    sessionStorage.setItem('adminAuthenticated', 'true');
                    errorEl.classList.remove('show');

                    // Track successful login
                    window.securityMonitor.trackAuth(true, emailResult.sanitized);

                    // Show dashboard
                    document.getElementById('login-screen').style.display = 'none';
                    document.getElementById('dashboard').style.display = 'flex';
                    if (typeof window.updateDashboard === 'function') {
                        window.updateDashboard();
                    }
                } else {
                    // Failed login
                    const result = window.securityManager.recordFailedAttempt();

                    // Track failed login
                    window.securityMonitor.trackAuth(false, emailResult.sanitized);

                    // Clear password
                    document.getElementById('login-password').value = '';

                    if (result.blocked) {
                        const timeLeft = window.securityManager.formatRemainingTime(result.blockDuration);
                        errorEl.textContent = `🔒 Trop de tentatives échouées. Compte bloqué pour ${timeLeft}.`;
                        errorEl.style.color = 'var(--danger)';
                    } else {
                        errorEl.textContent = `❌ Identifiant ou mot de passe incorrect (${result.remainingAttempts} tentatives restantes)`;
                        errorEl.style.color = 'var(--warning)';
                    }

                    errorEl.classList.add('show');
                    console.warn(`Failed login attempt for: ${emailResult.sanitized}`);
                }

                return false;
            }, true); // Use capture to intercept before other handlers
        }

        // Add security to logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function () {
                // Stop session monitoring
                if (window.sessionManager) {
                    window.sessionManager.stopMonitoring();
                    window.sessionManager.reset();
                }

                // Log security event
                if (window.securityMonitor) {
                    window.securityMonitor.logEvent('logout');
                }
            });
        }
    };
}

console.log('🔐 Security integration script loaded');
