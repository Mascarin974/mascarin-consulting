// Monitoring Module - Security Event Tracking
// Mascarin Consulting - Client-side activity monitoring

class SecurityMonitor {
    constructor() {
        this.EVENTS_KEY = 'mascarinSecurityEvents';
        this.MAX_EVENTS = 1000; // Maximum events to store
        this.suspiciousPatterns = {
            rapidClicks: { threshold: 10, window: 5000 }, // 10 clicks in 5s
            rapidSubmits: { threshold: 3, window: 10000 }, // 3 submits in 10s
            suspiciousNavigation: { threshold: 20, window: 30000 } // 20 nav changes in 30s
        };
    }

    /**
     * Log a security event
     * @param {string} type - Event type (login_failed, suspicious_activity, etc.)
     * @param {Object} data - Additional event data
     */
    logEvent(type, data = {}) {
        const event = {
            id: this.generateId(),
            type,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            ...data
        };

        const events = this.getEvents();
        events.push(event);

        // Keep only recent events
        const recentEvents = events.slice(-this.MAX_EVENTS);

        try {
            localStorage.setItem(this.EVENTS_KEY, JSON.stringify(recentEvents));
        } catch (e) {
            console.error('Failed to log security event:', e);
        }

        // Check for suspicious patterns
        this.detectSuspiciousActivity(recentEvents);

        return event.id;
    }

    /**
     * Get all security events
     * @returns {Array}
     */
    getEvents() {
        try {
            const data = localStorage.getItem(this.EVENTS_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Failed to retrieve security events:', e);
            return [];
        }
    }

    /**
     * Get events by type
     * @param {string} type 
     * @param {number} limit - Maximum number of events to return
     * @returns {Array}
     */
    getEventsByType(type, limit = 100) {
        const events = this.getEvents();
        return events
            .filter(e => e.type === type)
            .slice(-limit)
            .reverse();
    }

    /**
     * Get recent events (last N minutes)
     * @param {number} minutes 
     * @returns {Array}
     */
    getRecentEvents(minutes = 60) {
        const cutoff = Date.now() - (minutes * 60 * 1000);
        return this.getEvents().filter(e => e.timestamp >= cutoff);
    }

    /**
     * Detect suspicious activity patterns
     * @param {Array} events 
     */
    detectSuspiciousActivity(events) {
        const now = Date.now();

        // Check rapid clicks
        const recentClicks = events.filter(e =>
            e.type === 'click' &&
            now - e.timestamp < this.suspiciousPatterns.rapidClicks.window
        );

        if (recentClicks.length >= this.suspiciousPatterns.rapidClicks.threshold) {
            this.logEvent('suspicious_activity', {
                pattern: 'rapid_clicks',
                count: recentClicks.length,
                severity: 'medium'
            });
            console.warn('🚨 Suspicious activity detected: Rapid clicks');
        }

        // Check rapid form submissions
        const recentSubmits = events.filter(e =>
            e.type === 'form_submit' &&
            now - e.timestamp < this.suspiciousPatterns.rapidSubmits.window
        );

        if (recentSubmits.length >= this.suspiciousPatterns.rapidSubmits.threshold) {
            this.logEvent('suspicious_activity', {
                pattern: 'rapid_submits',
                count: recentSubmits.length,
                severity: 'high'
            });
            console.warn('🚨 Suspicious activity detected: Rapid form submissions');
        }
    }

    /**
     * Track click events
     * @param {Event} event 
     */
    trackClick(event) {
        const target = event.target;
        this.logEvent('click', {
            element: target.tagName,
            id: target.id,
            class: target.className,
            text: target.textContent?.substring(0, 50)
        });
    }

    /**
     * Track form submissions
     * @param {string} formId 
     * @param {Object} metadata 
     */
    trackFormSubmit(formId, metadata = {}) {
        this.logEvent('form_submit', {
            formId,
            ...metadata
        });
    }

    /**
     * Track navigation
     * @param {string} from 
     * @param {string} to 
     */
    trackNavigation(from, to) {
        this.logEvent('navigation', { from, to });
    }

    /**
     * Track authentication events
     * @param {boolean} success 
     * @param {string} email 
     */
    trackAuth(success, email = '') {
        this.logEvent(success ? 'login_success' : 'login_failed', {
            email: email.replace(/@.*$/, '@***'), // Partial masking
            success
        });
    }

    /**
     * Get security summary
     * @returns {Object}
     */
    getSummary() {
        const events = this.getRecentEvents(24 * 60); // Last 24h

        const summary = {
            total: events.length,
            byType: {},
            suspicious: events.filter(e => e.type === 'suspicious_activity'),
            failedLogins: events.filter(e => e.type === 'login_failed'),
            successfulLogins: events.filter(e => e.type === 'login_success')
        };

        // Count by type
        events.forEach(e => {
            summary.byType[e.type] = (summary.byType[e.type] || 0) + 1;
        });

        return summary;
    }

    /**
     * Export events as JSON
     * @returns {string}
     */
    exportEvents() {
        const events = this.getEvents();
        return JSON.stringify({
            exported: new Date().toISOString(),
            count: events.length,
            events
        }, null, 2);
    }

    /**
     * Clear old events (older than N days)
     * @param {number} days 
     */
    clearOldEvents(days = 30) {
        const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
        const events = this.getEvents();
        const recentEvents = events.filter(e => e.timestamp >= cutoff);

        localStorage.setItem(this.EVENTS_KEY, JSON.stringify(recentEvents));

        return {
            removed: events.length - recentEvents.length,
            remaining: recentEvents.length
        };
    }

    /**
     * Clear all events
     */
    clearAllEvents() {
        localStorage.removeItem(this.EVENTS_KEY);
    }

    /**
     * Generate unique event ID
     * @returns {string}
     */
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Initialize automatic tracking
     */
    initAutoTracking() {
        // Track all button clicks
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.classList.contains('btn')) {
                this.trackClick(e);
            }
        });

        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            this.logEvent('visibility_change', {
                hidden: document.hidden
            });
        });

        // Clean old events on initialization (keep last 30 days)
        this.clearOldEvents(30);

        console.log('✅ Security monitoring initialized');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityMonitor;
}
