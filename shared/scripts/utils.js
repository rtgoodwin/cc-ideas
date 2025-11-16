/**
 * Shared Utilities for CC-Ideas Prototypes
 * Common functions used across multiple prototypes
 */

'use strict';

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

const Storage = {
    /**
     * Get item from localStorage with JSON parsing
     * @param {string} key - The key to retrieve
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} The parsed value or default
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },

    /**
     * Set item in localStorage with JSON stringification
     * @param {string} key - The key to set
     * @param {*} value - The value to store
     * @returns {boolean} Success status
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    },

    /**
     * Remove item from localStorage
     * @param {string} key - The key to remove
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    /**
     * Clear all items from localStorage
     */
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

// ============================================
// FETCH HELPERS
// ============================================

const API = {
    /**
     * Fetch data from an API with error handling
     * @param {string} url - The URL to fetch
     * @param {Object} options - Fetch options
     * @returns {Promise<*>} The response data
     */
    async get(url, options = {}) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API GET error:', error);
            throw error;
        }
    },

    /**
     * Post data to an API
     * @param {string} url - The URL to post to
     * @param {*} data - The data to send
     * @param {Object} options - Fetch options
     * @returns {Promise<*>} The response data
     */
    async post(url, data, options = {}) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                body: JSON.stringify(data),
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API POST error:', error);
            throw error;
        }
    }
};

// ============================================
// DEVICE DETECTION
// ============================================

const Device = {
    /**
     * Check if user is on a mobile device
     * @returns {boolean}
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    /**
     * Check if user is on iOS
     * @returns {boolean}
     */
    isIOS() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    },

    /**
     * Check if user is on Android
     * @returns {boolean}
     */
    isAndroid() {
        return /Android/i.test(navigator.userAgent);
    },

    /**
     * Check if device supports touch
     * @returns {boolean}
     */
    hasTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    /**
     * Get viewport width
     * @returns {number}
     */
    getViewportWidth() {
        return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    },

    /**
     * Get viewport height
     * @returns {number}
     */
    getViewportHeight() {
        return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    }
};

// ============================================
// DOM UTILITIES
// ============================================

const DOM = {
    /**
     * Create an element with attributes and children
     * @param {string} tag - HTML tag name
     * @param {Object} attrs - Attributes to set
     * @param {Array|string} children - Child elements or text
     * @returns {HTMLElement}
     */
    create(tag, attrs = {}, children = []) {
        const element = document.createElement(tag);

        // Set attributes
        Object.entries(attrs).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else if (key.startsWith('on')) {
                const event = key.substring(2).toLowerCase();
                element.addEventListener(event, value);
            } else {
                element.setAttribute(key, value);
            }
        });

        // Append children
        if (typeof children === 'string') {
            element.textContent = children;
        } else if (Array.isArray(children)) {
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else if (child instanceof HTMLElement) {
                    element.appendChild(child);
                }
            });
        }

        return element;
    },

    /**
     * Query selector with type safety
     * @param {string} selector - CSS selector
     * @param {HTMLElement} parent - Parent element (default: document)
     * @returns {HTMLElement|null}
     */
    select(selector, parent = document) {
        return parent.querySelector(selector);
    },

    /**
     * Query selector all
     * @param {string} selector - CSS selector
     * @param {HTMLElement} parent - Parent element (default: document)
     * @returns {HTMLElement[]}
     */
    selectAll(selector, parent = document) {
        return Array.from(parent.querySelectorAll(selector));
    },

    /**
     * Add event listener with automatic cleanup
     * @param {HTMLElement} element - Element to attach listener to
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     * @param {Object} options - Event options
     */
    on(element, event, handler, options = {}) {
        element.addEventListener(event, handler, options);
        return () => element.removeEventListener(event, handler, options);
    }
};

// ============================================
// FORMATTING UTILITIES
// ============================================

const Format = {
    /**
     * Format number with thousands separator
     * @param {number} num - Number to format
     * @returns {string}
     */
    number(num) {
        return num.toLocaleString();
    },

    /**
     * Format currency
     * @param {number} amount - Amount to format
     * @param {string} currency - Currency code (default: USD)
     * @returns {string}
     */
    currency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency
        }).format(amount);
    },

    /**
     * Format date
     * @param {Date|string} date - Date to format
     * @param {Object} options - Intl.DateTimeFormat options
     * @returns {string}
     */
    date(date, options = {}) {
        const dateObj = date instanceof Date ? date : new Date(date);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            ...options
        }).format(dateObj);
    },

    /**
     * Format relative time (e.g., "2 hours ago")
     * @param {Date|string} date - Date to format
     * @returns {string}
     */
    relativeTime(date) {
        const dateObj = date instanceof Date ? date : new Date(date);
        const now = new Date();
        const diffMs = now - dateObj;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return Format.date(dateObj);
    },

    /**
     * Truncate text with ellipsis
     * @param {string} text - Text to truncate
     * @param {number} maxLength - Maximum length
     * @returns {string}
     */
    truncate(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }
};

// ============================================
// DEBOUNCE & THROTTLE
// ============================================

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function}
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in ms
 * @returns {Function}
 */
function throttle(func, limit = 300) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// VALIDATION
// ============================================

const Validate = {
    /**
     * Validate email address
     * @param {string} email - Email to validate
     * @returns {boolean}
     */
    email(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * Validate URL
     * @param {string} url - URL to validate
     * @returns {boolean}
     */
    url(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Check if value is empty
     * @param {*} value - Value to check
     * @returns {boolean}
     */
    isEmpty(value) {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string') return value.trim().length === 0;
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === 'object') return Object.keys(value).length === 0;
        return false;
    }
};

// ============================================
// NOTIFICATION/TOAST
// ============================================

const Toast = {
    /**
     * Show a toast notification
     * @param {string} message - Message to display
     * @param {string} type - Type of toast (info, success, warning, danger)
     * @param {number} duration - Duration in ms
     */
    show(message, type = 'info', duration = 3000) {
        // Create toast element
        const toast = DOM.create('div', {
            className: `alert alert-${type}`,
            style: 'position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 300px; animation: slideInRight 0.3s ease;'
        }, message);

        // Add to body
        document.body.appendChild(toast);

        // Remove after duration
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};

// ============================================
// EXPORT FOR MODULE USAGE
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Storage,
        API,
        Device,
        DOM,
        Format,
        debounce,
        throttle,
        Validate,
        Toast
    };
}
