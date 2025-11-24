// Security Module - Anti-Brute Force & Rate Limiting
// Mascarin Consulting - Client-side security layer

class SecurityManager {
    constructor() {
        this.LOGIN_ATTEMPTS_KEY = 'mascarinLoginAttempts';
        this.BLOCKED_UNTIL_KEY = 'mascarinBlockedUntil';
        this.MAX_ATTEMPTS = 5;
        this.BLOCK_DURATIONS = [30000, 300000, 1800000, 86400000]; // 30s, 5min, 30min, 24h
    }

    /**
     * Check if user is currently blocked from attempting login
     * @returns {Object} { blocked: boolean, remainingTime: number }
     */
    isBlocked() {
        const blockedUntil = localStorage.getItem(this.BLOCKED_UNTIL_KEY);

        if (!blockedUntil) {
            return { blocked: false, remainingTime: 0 };
        }

        const now = Date.now();
        const blockedTime = parseInt(blockedUntil);

        if (now < blockedTime) {
            const remainingTime = Math.ceil((blockedTime - now) / 1000);
            return { blocked: true, remainingTime };
        }

        // Block expired, clean up
        localStorage.removeItem(this.BLOCKED_UNTIL_KEY);
        return { blocked: false, remainingTime: 0 };
    }

    /**
     * Record a failed login attempt
     * @returns {Object} { blocked: boolean, remainingAttempts: number, blockDuration: number }
     */
    recordFailedAttempt() {
        const attempts = this.getAttempts();
        const now = Date.now();

        // Add new attempt
        attempts.push({
            timestamp: now,
            ip: 'client', // In a real app, this would be server-side
            userAgent: navigator.userAgent
        });

        // Clean old attempts (older than 15 minutes)
        const recentAttempts = attempts.filter(a => now - a.timestamp < 900000);

        // Save attempts
        localStorage.setItem(this.LOGIN_ATTEMPTS_KEY, JSON.stringify(recentAttempts));

        // Check if we need to block
        if (recentAttempts.length >= this.MAX_ATTEMPTS) {
            const blockIndex = Math.min(
                Math.floor(recentAttempts.length / this.MAX_ATTEMPTS) - 1,
                this.BLOCK_DURATIONS.length - 1
            );
            const blockDuration = this.BLOCK_DURATIONS[blockIndex];
            const blockedUntil = now + blockDuration;

            localStorage.setItem(this.BLOCKED_UNTIL_KEY, blockedUntil.toString());

            return {
                blocked: true,
                remainingAttempts: 0,
                blockDuration: Math.ceil(blockDuration / 1000)
            };
        }

        return {
            blocked: false,
            remainingAttempts: this.MAX_ATTEMPTS - recentAttempts.length,
            blockDuration: 0
        };
    }

    /**
     * Reset login attempts (called on successful login)
     */
    resetAttempts() {
        localStorage.removeItem(this.LOGIN_ATTEMPTS_KEY);
        localStorage.removeItem(this.BLOCKED_UNTIL_KEY);
    }

    /**
     * Get current login attempts
     * @returns {Array}
     */
    getAttempts() {
        try {
            const data = localStorage.getItem(this.LOGIN_ATTEMPTS_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error parsing login attempts:', e);
            return [];
        }
    }

    /**
     * Format remaining time for display
     * @param {number} seconds 
     * @returns {string}
     */
    formatRemainingTime(seconds) {
        if (seconds < 60) {
            return `${seconds} seconde${seconds > 1 ? 's' : ''}`;
        } else if (seconds < 3600) {
            const minutes = Math.ceil(seconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else if (seconds < 86400) {
            const hours = Math.ceil(seconds / 3600);
            return `${hours} heure${hours > 1 ? 's' : ''}`;
        } else {
            return '24 heures';
        }
    }

    /**
     * Get security log for admin review
     * @returns {Array}
     */
    getSecurityLog() {
        const attempts = this.getAttempts();
        return attempts.map(a => ({
            ...a,
            date: new Date(a.timestamp).toLocaleString('fr-FR')
        }));
    }

    /**
     * Clean old security logs (called periodically)
     */
    cleanOldLogs() {
        const now = Date.now();
        const attempts = this.getAttempts();

        // Keep only logs from last 7 days
        const recentLogs = attempts.filter(a => now - a.timestamp < 604800000);

        if (recentLogs.length !== attempts.length) {
            localStorage.setItem(this.LOGIN_ATTEMPTS_KEY, JSON.stringify(recentLogs));
        }
    }
}

// Rate Limiter for form submissions
class RateLimiter {
    constructor(maxRequests = 3, windowMs = 60000) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = new Map();
    }

    /**
     * Check if action is allowed
     * @param {string} key - Unique identifier for the action
     * @returns {Object} { allowed: boolean, retryAfter: number }
     */
    checkLimit(key) {
        const now = Date.now();
        const timestamps = this.requests.get(key) || [];

        // Remove old timestamps
        const recentTimestamps = timestamps.filter(t => now - t < this.windowMs);

        if (recentTimestamps.length >= this.maxRequests) {
            const oldestTimestamp = Math.min(...recentTimestamps);
            const retryAfter = Math.ceil((oldestTimestamp + this.windowMs - now) / 1000);

            return { allowed: false, retryAfter };
        }

        // Add current timestamp
        recentTimestamps.push(now);
        this.requests.set(key, recentTimestamps);

        return { allowed: true, retryAfter: 0 };
    }

    /**
     * Reset limit for a specific key
     * @param {string} key 
     */
    reset(key) {
        this.requests.delete(key);
    }

    /**
     * Clear all limits
     */
    clearAll() {
        this.requests.clear();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SecurityManager, RateLimiter };
}
