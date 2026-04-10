// ===== Authentication Functions =====

/**
 * Check if user is logged in by checking localStorage
 */
function isUserLoggedIn() {
    return localStorage.getItem('user_logged_in') === 'true';
}

/**
 * Log out user
 */
function logoutUser() {
    fetch('../backend/auth_api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'action=logout'
    })
    .then(response => response.json())
    .then(data => {
        localStorage.removeItem('user_logged_in');
        localStorage.removeItem('user_name');
        window.location.href = 'index.html';
    });
}

/**
 * Update authentication menu based on login status
 */
function updateAuthMenu() {
    const authMenu = document.getElementById('authMenu');
    const userMenuDropdown = document.getElementById('userMenuDropdown');

    if (!authMenu || !userMenuDropdown) return;

    // Check session by trying to load cart (requires user_id in session)
    fetch('../backend/product_api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'action=get_cart'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            // User is logged in
            authMenu.style.display = 'none';
            userMenuDropdown.style.display = 'block';
            
            // Get user name from a separate call or session
            fetch('../backend/product_api.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'action=get_user'
            })
            .then(response => response.json())
            .then(userData => {
                if (userData.user) {
                    document.getElementById('userName').textContent = userData.user.full_name || userData.user.username;
                }
            })
            .catch(err => console.log('Could not fetch user data'));
        } else {
            // User is not logged in
            authMenu.style.display = 'block';
            userMenuDropdown.style.display = 'none';
        }
    })
    .catch(error => {
        authMenu.style.display = 'block';
        userMenuDropdown.style.display = 'none';
    });
}

// ===== Cart Functions =====

/**
 * Update cart count in the navbar
 */
function updateCartCount() {
    if (!isUserLoggedIn()) {
        document.getElementById('cartCount').textContent = '0';
        return;
    }

    fetch('../backend/product_api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'action=get_cart'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            document.getElementById('cartCount').textContent = data.count;
        }
    })
    .catch(error => console.log('Error updating cart count'));
}

// ===== Utility Functions =====

/**
 * Format currency to INR format
 */
function formatCurrency(amount) {
    return '₹' + parseFloat(amount).toFixed(2);
}

/**
 * Format date to readable format
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

/**
 * Debounce function for search
 */
function debounce(func, wait) {
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
 * Show notification
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles if not already in CSS
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '9999';
    notification.style.maxWidth = '400px';
    notification.style.animation = 'slideIn 0.3s ease-in-out';
    
    if (type === 'success') {
        notification.style.backgroundColor = '#d4edda';
        notification.style.color = '#155724';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#f8d7da';
        notification.style.color = '#721c24';
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== Form Validation =====

/**
 * Validate email format
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate phone number
 */
function validatePhone(phone) {
    if (!phone) return true; // Optional field
    const re = /^[0-9]{10}$/;
    return re.test(phone.replace(/\D/g, ''));
}

/**
 * Validate password strength
 */
function validatePasswordStrength(password) {
    if (password.length < 6) {
        return { strength: 'weak', message: 'Password must be at least 6 characters' };
    }
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        return { strength: 'medium', message: 'Mix uppercase, lowercase, and numbers for stronger password' };
    }
    return { strength: 'strong', message: 'Strong password' };
}

// ===== API Helper Functions =====

/**
 * Make API call
 */
async function apiCall(endpoint, data) {
    try {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });

        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API Error:', error);
        return { status: false, message: 'An error occurred' };
    }
}

// ===== Page Load Events =====

/**
 * Initialize on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on every page load
    updateCartCount();
    
    // Update auth menu on every page load
    if (document.getElementById('authMenu')) {
        updateAuthMenu();
    }
});

// ===== Animation Styles =====

// Add animation styles to head if not present
if (!document.querySelector('style[data-animations]')) {
    const style = document.createElement('style');
    style.setAttribute('data-animations', '');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== Service Worker Registration =====

/**
 * Register service worker for offline functionality (optional)
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker can be added here if needed
    });
}
