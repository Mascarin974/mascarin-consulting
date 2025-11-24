// CSRF Protection Module
// Mascarin Consulting - Cross-Site Request Forgery Protection

class CSRFProtection {
    constructor() {
        this.TOKEN_KEY = 'mascarinCSRFToken';
        this.SESSION_KEY = 'mascarinSessionId';
        this.TOKEN_LIFETIME = 3600000; // 1 hour in ms
    }

    /**
     * Generate a new CSRF token
     * @returns {string}
     */
    generateToken() {
        const token = {
            value: this.randomString(32),
            created: Date.now(),
            sessionId: this.getSessionId()
        };

        sessionStorage.setItem(this.TOKEN_KEY, JSON.stringify(token));
        return token.value;
    }

    /**
     * Get current CSRF token (creates new one if expired)
     * @returns {string}
     */
    getToken() {
        try {
            const stored = sessionStorage.getItem(this.TOKEN_KEY);
            if (!stored) {
                return this.generateToken();
            }

            const token = JSON.parse(stored);
            const age = Date.now() - token.created;

            // Regenerate if expired
            if (age > this.TOKEN_LIFETIME) {
                return this.generateToken();
            }

            return token.value;
        } catch (e) {
            console.error('CSRF token error:', e);
            return this.generateToken();
        }
    }

    /**
     * Validate CSRF token
     * @param {string} tokenValue 
     * @returns {boolean}
     */
    validateToken(tokenValue) {
        try {
            const stored = sessionStorage.getItem(this.TOKEN_KEY);
            if (!stored) return false;

            const token = JSON.parse(stored);
            const age = Date.now() - token.created;

            // Check expiration
            if (age > this.TOKEN_LIFETIME) {
                return false;
            }

            // Check session match
            if (token.sessionId !== this.getSessionId()) {
                return false;
            }

            // Check token value
            return token.value === tokenValue;
        } catch (e) {
            console.error('CSRF validation error:', e);
            return false;
        }
    }

    /**
     * Get or create session ID
     * @returns {string}
     */
    getSessionId() {
        let sessionId = sessionStorage.getItem(this.SESSION_KEY);
        if (!sessionId) {
            sessionId = this.randomString(16);
            sessionStorage.setItem(this.SESSION_KEY, sessionId);
        }
        return sessionId;
    }

    /**
     * Add CSRF token to form
     * @param {HTMLFormElement} form 
     */
    addTokenToForm(form) {
        // Remove existing token if any
        const existing = form.querySelector('input[name="csrf_token"]');
        if (existing) {
            existing.remove();
        }

        // Add new token
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'csrf_token';
        input.value = this.getToken();
        form.appendChild(input);
    }

    /**
     * Validate form CSRF token
     * @param {HTMLFormElement} form 
     * @returns {boolean}
     */
    validateForm(form) {
        const tokenInput = form.querySelector('input[name="csrf_token"]');
        if (!tokenInput) {
            console.warn('CSRF token missing from form');
            return false;
        }

        return this.validateToken(tokenInput.value);
    }

    /**
     * Add honeypot field to form
     * @param {HTMLFormElement} form 
     */
    addHoneypot(form) {
        // Remove existing honeypot if any
        const existing = form.querySelector('input[name="website"]');
        if (existing) {
            existing.remove();
        }

        // Create honeypot field (bots will fill it, humans won't see it)
        const honeypot = document.createElement('input');
        honeypot.type = 'text';
        honeypot.name = 'website';
        honeypot.value = '';
        honeypot.style.position = 'absolute';
        honeypot.style.left = '-9999px';
        honeypot.style.width = '1px';
        honeypot.style.height = '1px';
        honeypot.setAttribute('tabindex', '-1');
        honeypot.setAttribute('autocomplete', 'off');
        honeypot.setAttribute('aria-hidden', 'true');

        form.appendChild(honeypot);
    }

    /**
     * Check if honeypot was triggered
     * @param {HTMLFormElement} form 
     * @returns {boolean} true if bot detected
     */
    checkHoneypot(form) {
        const honeypot = form.querySelector('input[name="website"]');
        if (!honeypot) return false;

        // If honeypot is filled, it's likely a bot
        return honeypot.value.trim() !== '';
    }

    /**
     * Add timestamp validation to form
     * @param {HTMLFormElement} form 
     */
    addTimestamp(form) {
        const existing = form.querySelector('input[name="form_timestamp"]');
        if (existing) {
            existing.remove();
        }

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'form_timestamp';
        input.value = Date.now().toString();
        form.appendChild(input);
    }

    /**
     * Validate form submission time (prevent instant bot submissions)
     * @param {HTMLFormElement} form 
     * @param {number} minSeconds - Minimum time user should spend on form
     * @returns {boolean}
     */
    validateTimestamp(form, minSeconds = 3) {
        const timestampInput = form.querySelector('input[name="form_timestamp"]');
        if (!timestampInput) return true; // No timestamp = OK

        const formLoadTime = parseInt(timestampInput.value);
        const now = Date.now();
        const elapsed = (now - formLoadTime) / 1000; // seconds

        if (elapsed < minSeconds) {
            console.warn(`Form submitted too quickly: ${elapsed}s`);
            return false;
        }

        return true;
    }

    /**
     * Initialize CSRF protection for all forms
     */
    protectAllForms() {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            // Skip login form (it has its own protection)
            if (form.id === 'login-form') return;

            // Add CSRF token
            this.addTokenToForm(form);

            // Add honeypot
            this.addHoneypot(form);

            // Add timestamp
            this.addTimestamp(form);

            // Add submit event listener
            form.addEventListener('submit', (e) => {
                // Validate CSRF token
                if (!this.validateForm(form)) {
                    e.preventDefault();
                    console.error('CSRF validation failed');
                    alert('Erreur de sécurité. Veuillez recharger la page.');
                    return false;
                }

                // Check honeypot
                if (this.checkHoneypot(form)) {
                    e.preventDefault();
                    console.warn('Bot detected via honeypot');
                    // Silently fail for bots
                    return false;
                }

                // Validate timestamp
                if (!this.validateTimestamp(form)) {
                    e.preventDefault();
                    console.warn('Form submitted too quickly');
                    alert('Veuillez prendre le temps de remplir le formulaire.');
                    return false;
                }
            });
        });

        console.log(`✅ CSRF protection enabled for ${forms.length} forms`);
    }

    /**
     * Generate random string
     * @param {number} length 
     * @returns {string}
     */
    randomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const randomValues = new Uint8Array(length);
        crypto.getRandomValues(randomValues);

        for (let i = 0; i < length; i++) {
            result += chars[randomValues[i] % chars.length];
        }

        return result;
    }
}

// Session Timeout Manager
class SessionManager {
    constructor(timeoutMinutes = 30) {
        this.TIMEOUT = timeoutMinutes * 60 * 1000; // Convert to ms
        this.LAST_ACTIVITY_KEY = 'mascarinLastActivity';
        this.WARNING_TIME = 5 * 60 * 1000; // Warn 5 min before timeout
        this.warningShown = false;
        this.checkInterval = null;
    }

    /**
     * Update last activity timestamp
     */
    updateActivity() {
        sessionStorage.setItem(this.LAST_ACTIVITY_KEY, Date.now().toString());
        this.warningShown = false;
    }

    /**
     * Get time until timeout
     * @returns {number} milliseconds until timeout
     */
    getTimeUntilTimeout() {
        const lastActivity = parseInt(sessionStorage.getItem(this.LAST_ACTIVITY_KEY) || Date.now());
        const elapsed = Date.now() - lastActivity;
        return Math.max(0, this.TIMEOUT - elapsed);
    }

    /**
     * Check if session has timed out
     * @returns {boolean}
     */
    isTimedOut() {
        return this.getTimeUntilTimeout() === 0;
    }

    /**
     * Start monitoring session timeout
     * @param {Function} onTimeout - Callback when session times out
     * @param {Function} onWarning - Callback for timeout warning
     */
    startMonitoring(onTimeout, onWarning) {
        // Update activity on page load
        this.updateActivity();

        // Track user activity
        ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, () => this.updateActivity(), { passive: true });
        });

        // Check timeout every 30 seconds
        this.checkInterval = setInterval(() => {
            const timeLeft = this.getTimeUntilTimeout();

            if (timeLeft === 0) {
                clearInterval(this.checkInterval);
                if (onTimeout) onTimeout();
            } else if (timeLeft <= this.WARNING_TIME && !this.warningShown) {
                this.warningShown = true;
                if (onWarning) {
                    const minutesLeft = Math.ceil(timeLeft / 60000);
                    onWarning(minutesLeft);
                }
            }
        }, 30000); // Check every 30s

        console.log(`✅ Session timeout monitoring started (${this.TIMEOUT / 60000} minutes)`);
    }

    /**
     * Stop monitoring
     */
    stopMonitoring() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    /**
     * Reset session
     */
    reset() {
        sessionStorage.removeItem(this.LAST_ACTIVITY_KEY);
        this.warningShown = false;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CSRFProtection, SessionManager };
}
