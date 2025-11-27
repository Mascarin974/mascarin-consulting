// Sanitizer Module - XSS Protection & Input Validation
// Mascarin Consulting - Client-side data sanitization

class InputSanitizer {
    constructor() {
        // HTML entities to encode
        this.htmlEntities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;'
        };

        // Dangerous patterns to detect
        this.dangerousPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi, // Event handlers like onclick, onerror, etc.
            /<embed\b/gi,
            /<object\b/gi
        ];
    }

    /**
     * Encode HTML special characters
     * @param {string} str 
     * @returns {string}
     */
    encodeHTML(str) {
        if (typeof str !== 'string') return '';

        return str.replace(/[&<>"'\/]/g, char => this.htmlEntities[char]);
    }

    /**
     * Strip all HTML tags from string
     * @param {string} str 
     * @returns {string}
     */
    stripHTML(str) {
        if (typeof str !== 'string') return '';

        return str.replace(/<[^>]*>/g, '');
    }

    /**
     * Sanitize text input (safe for display with textContent)
     * @param {string} input 
     * @returns {string}
     */
    sanitizeText(input) {
        if (typeof input !== 'string') return '';

        // Remove dangerous patterns
        let sanitized = input;
        this.dangerousPatterns.forEach(pattern => {
            sanitized = sanitized.replace(pattern, '');
        });

        // Trim whitespace
        return sanitized.trim();
    }

    /**
     * Sanitize HTML (safe for innerHTML - removes scripts but keeps formatting)
     * @param {string} html 
     * @returns {string}
     */
    sanitizeHTML(html) {
        if (typeof html !== 'string') return '';

        let sanitized = html;

        // Remove dangerous tags and patterns
        this.dangerousPatterns.forEach(pattern => {
            sanitized = sanitized.replace(pattern, '');
        });

        return sanitized.trim();
    }

    /**
     * Validate and sanitize email
     * @param {string} email 
     * @returns {Object} { valid: boolean, sanitized: string }
     */
    sanitizeEmail(email) {
        if (typeof email !== 'string') {
            return { valid: false, sanitized: '' };
        }

        const sanitized = email.toLowerCase().trim();
        const emailRegex = /^[a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        const valid = emailRegex.test(sanitized);

        return { valid, sanitized: valid ? sanitized : '' };
    }

    /**
     * Validate and sanitize phone number (French format)
     * @param {string} phone 
     * @returns {Object} { valid: boolean, sanitized: string }
     */
    sanitizePhone(phone) {
        if (typeof phone !== 'string') {
            return { valid: false, sanitized: '' };
        }

        // Remove all non-digit characters
        let sanitized = phone.replace(/\D/g, '');

        // French phone formats: 0XXXXXXXXX or +33XXXXXXXXX
        const validFormats = [
            /^0[1-9]\d{8}$/,  // 0612345678
            /^33[1-9]\d{8}$/  // 33612345678
        ];

        const valid = validFormats.some(regex => regex.test(sanitized));

        // Format for display: 06 12 34 56 78
        if (valid && sanitized.startsWith('0')) {
            sanitized = sanitized.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
        }

        return { valid, sanitized: valid ? sanitized : '' };
    }

    /**
     * Sanitize name (letters, spaces, hyphens, apostrophes only)
     * @param {string} name 
     * @returns {string}
     */
    sanitizeName(name) {
        if (typeof name !== 'string') return '';

        // Remove anything that's not letter, space, hyphen, or apostrophe
        const sanitized = name.replace(/[^a-zA-Z\u00C0-\u00FF\s'-]/g, '').trim();

        // Capitalize first letter of each word
        return sanitized.replace(/\b\w/g, char => char.toUpperCase());
    }

    /**
     * Sanitize date (YYYY-MM-DD format)
     * @param {string} date 
     * @returns {Object} { valid: boolean, sanitized: string }
     */
    sanitizeDate(date) {
        if (typeof date !== 'string') {
            return { valid: false, sanitized: '' };
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!dateRegex.test(date)) {
            return { valid: false, sanitized: '' };
        }

        // Verify it's a real date
        const dateObj = new Date(date);
        const valid = dateObj instanceof Date && !isNaN(dateObj);

        return { valid, sanitized: valid ? date : '' };
    }

    /**
     * Sanitize time (HH:MM format)
     * @param {string} time 
     * @returns {Object} { valid: boolean, sanitized: string }
     */
    sanitizeTime(time) {
        if (typeof time !== 'string') {
            return { valid: false, sanitized: '' };
        }

        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        const valid = timeRegex.test(time);

        return { valid, sanitized: valid ? time : '' };
    }

    /**
     * Sanitize number
     * @param {string|number} num 
     * @param {Object} options - { min, max, decimals }
     * @returns {Object} { valid: boolean, sanitized: number }
     */
    sanitizeNumber(num, options = {}) {
        const parsed = typeof num === 'string' ? parseFloat(num) : num;

        if (isNaN(parsed)) {
            return { valid: false, sanitized: 0 };
        }

        let valid = true;
        let sanitized = parsed;

        // Check min/max
        if (options.min !== undefined && sanitized < options.min) {
            valid = false;
        }
        if (options.max !== undefined && sanitized > options.max) {
            valid = false;
        }

        // Round to decimals
        if (options.decimals !== undefined) {
            sanitized = parseFloat(sanitized.toFixed(options.decimals));
        }

        return { valid, sanitized: valid ? sanitized : 0 };
    }

    /**
     * Sanitize all fields in an object based on a schema
     * @param {Object} data 
     * @param {Object} schema - { fieldName: 'type' }
     * @returns {Object} { valid: boolean, sanitized: Object, errors: Array }
     */
    sanitizeObject(data, schema) {
        const sanitized = {};
        const errors = [];
        let valid = true;

        for (const [field, type] of Object.entries(schema)) {
            const value = data[field];

            switch (type) {
                case 'text':
                    sanitized[field] = this.sanitizeText(value);
                    break;

                case 'html':
                    sanitized[field] = this.sanitizeHTML(value);
                    break;

                case 'email':
                    const emailResult = this.sanitizeEmail(value);
                    sanitized[field] = emailResult.sanitized;
                    if (!emailResult.valid && value) {
                        errors.push(`${field}: Email invalide`);
                        valid = false;
                    }
                    break;

                case 'phone':
                    const phoneResult = this.sanitizePhone(value);
                    sanitized[field] = phoneResult.sanitized;
                    if (!phoneResult.valid && value) {
                        errors.push(`${field}: Numéro de téléphone invalide`);
                        valid = false;
                    }
                    break;

                case 'name':
                    sanitized[field] = this.sanitizeName(value);
                    break;

                case 'date':
                    const dateResult = this.sanitizeDate(value);
                    sanitized[field] = dateResult.sanitized;
                    if (!dateResult.valid && value) {
                        errors.push(`${field}: Date invalide`);
                        valid = false;
                    }
                    break;

                case 'time':
                    const timeResult = this.sanitizeTime(value);
                    sanitized[field] = timeResult.sanitized;
                    if (!timeResult.valid && value) {
                        errors.push(`${field}: Heure invalide`);
                        valid = false;
                    }
                    break;

                default:
                    sanitized[field] = this.sanitizeText(value);
            }
        }

        return { valid, sanitized, errors };
    }

    /**
     * Detect potential XSS attempts
     * @param {string} input 
     * @returns {boolean}
     */
    detectXSS(input) {
        if (typeof input !== 'string') return false;

        return this.dangerousPatterns.some(pattern => pattern.test(input));
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputSanitizer;
}
