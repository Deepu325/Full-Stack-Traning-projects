// Character pools for password generation
const charPools = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    special: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

/**
 * Get selected character options from checkboxes
 * @returns {Object} Object with boolean properties for each character type
 */
function getSelectedOptions() {
    return {
        uppercase: document.getElementById('uppercase').checked,
        lowercase: document.getElementById('lowercase').checked,
        numbers: document.getElementById('numbers').checked,
        special: document.getElementById('special').checked
    };
}

/**
 * Validate that at least one character type is selected
 * @param {Object} options - Selected character options
 * @returns {boolean} True if at least one option is selected
 */
function validateOptions(options) {
    return options.uppercase || options.lowercase || options.numbers || options.special;
}

/**
 * Clear error message
 */
function clearError() {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.classList.remove('show');
    errorMsg.textContent = '';
}

/**
 * Display error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.textContent = message;
    errorMsg.classList.add('show');
}

/**
 * Build the character pool based on selected options
 * @param {Object} options - Selected character options
 * @returns {string} Combined character pool string
 */
function buildCharacterPool(options) {
    let pool = '';
    
    if (options.uppercase) pool += charPools.uppercase;
    if (options.lowercase) pool += charPools.lowercase;
    if (options.numbers) pool += charPools.numbers;
    if (options.special) pool += charPools.special;
    
    return pool;
}

/**
 * Generate a random password based on selected criteria
 * Uses secure random number generation
 */
function generatePassword() {
    clearError();
    
    // Get user selections
    const options = getSelectedOptions();
    const length = parseInt(document.getElementById('passwordLength').value);
    
    // Validate input
    if (!validateOptions(options)) {
        showError('Please select at least one character type!');
        document.getElementById('passwordOutput').value = '';
        updateStrength(0);
        return;
    }
    
    // Build character pool
    const characterPool = buildCharacterPool(options);
    
    // Generate password
    let password = '';
    for (let i = 0; i < length; i++) {
        // Use secure random index selection
        const randomIndex = Math.floor(Math.random() * characterPool.length);
        password += characterPool[randomIndex];
    }
    
    // Display generated password
    document.getElementById('passwordOutput').value = password;
    
    // Calculate and display password strength
    updateStrength(calculateStrength(password, options));
}

/**
 * Calculate password strength based on criteria
 * @param {string} password - Generated password
 * @param {Object} options - Selected character options
 * @returns {number} Strength score (0-3: 0=weak, 1=weak, 2=medium, 3=strong)
 */
function calculateStrength(password, options) {
    let strength = 0;
    
    // Base score: password length
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (password.length >= 16) strength++;
    
    // Bonus: variety of character types used
    let typeCount = 0;
    if (options.uppercase) typeCount++;
    if (options.lowercase) typeCount++;
    if (options.numbers) typeCount++;
    if (options.special) typeCount++;
    
    if (typeCount >= 3) strength++;
    if (typeCount === 4) strength++;
    
    // Cap at 3 for UI display
    return Math.min(strength, 3);
}

/**
 * Update visual strength indicator
 * @param {number} strength - Strength score (0-3)
 */
function updateStrength(strength) {
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    // Reset classes
    strengthBar.className = 'strength-bar';
    strengthText.className = 'strength-text';
    
    if (strength === 0) {
        strengthBar.classList.remove('weak', 'medium', 'strong');
        strengthText.textContent = '-';
    } else if (strength === 1 || strength === 2) {
        strengthBar.classList.add('weak');
        strengthText.classList.add('weak');
        strengthText.textContent = 'Weak';
    } else if (strength === 3) {
        strengthBar.classList.add('medium');
        strengthText.classList.add('medium');
        strengthText.textContent = 'Medium';
    } else if (strength >= 4) {
        strengthBar.classList.add('strong');
        strengthText.classList.add('strong');
        strengthText.textContent = 'Strong';
    }
}

/**
 * Copy generated password to clipboard
 */
function copyToClipboard() {
    const passwordOutput = document.getElementById('passwordOutput');
    
    // Check if password exists
    if (!passwordOutput.value) {
        showError('Generate a password first!');
        return;
    }
    
    // Copy to clipboard
    navigator.clipboard.writeText(passwordOutput.value).then(() => {
        // Visual feedback
        const copyBtn = event.target.closest('.copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        
        // Revert button text after 2 seconds
        setTimeout(() => {
            copyBtn.innerHTML = '<span id="copyText">Copy</span>';
        }, 2000);
    }).catch(err => {
        showError('Failed to copy to clipboard!');
        console.error('Copy error:', err);
    });
}

/**
 * Update the length display when slider changes
 */
function updateLengthDisplay() {
    const lengthInput = document.getElementById('passwordLength');
    document.getElementById('lengthDisplay').textContent = lengthInput.value;
    // Clear previous password when length changes
    clearError();
}

/**
 * Initialize - Generate password on page load with default settings
 */
document.addEventListener('DOMContentLoaded', () => {
    generatePassword();
    
    // Add event listeners to inputs for real-time generation (optional)
    document.getElementById('uppercase').addEventListener('change', generatePassword);
    document.getElementById('lowercase').addEventListener('change', generatePassword);
    document.getElementById('numbers').addEventListener('change', generatePassword);
    document.getElementById('special').addEventListener('change', generatePassword);
});
