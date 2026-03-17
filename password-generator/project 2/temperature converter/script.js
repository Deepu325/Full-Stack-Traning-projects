/**
 * Temperature Converter Application
 * Converts temperatures between Celsius, Fahrenheit, and Kelvin
 */

// Get DOM elements
const temperatureInput = document.getElementById('temperatureInput');
const unitSelect = document.getElementById('unitSelect');
const celsiusResult = document.getElementById('celsiusResult');
const fahrenheitResult = document.getElementById('fahrenheitResult');
const kelvinResult = document.getElementById('kelvinResult');
const errorMessage = document.getElementById('errorMessage');

// Test examples for quick testing
const testExamples = [
    { value: 37, unit: 'celsius', name: 'Body Temperature' },
    { value: 32, unit: 'fahrenheit', name: 'Freezing Point' },
    { value: 273.15, unit: 'kelvin', name: 'Absolute Zero + 273.15' },
    { value: 100, unit: 'celsius', name: 'Boiling Point' }
];

/**
 * Convert temperature from any unit to Celsius
 * @param {number} value - Temperature value
 * @param {string} unit - Current unit (celsius, fahrenheit, kelvin)
 * @returns {number} Temperature in Celsius
 */
function toCelsius(value, unit) {
    switch(unit) {
        case 'celsius':
            return value;
        case 'fahrenheit':
            // Formula: °C = (°F − 32) × 5/9
            return (value - 32) * 5/9;
        case 'kelvin':
            // Formula: °C = K - 273.15
            return value - 273.15;
        default:
            return 0;
    }
}

/**
 * Convert temperature from Celsius to Fahrenheit
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} Temperature in Fahrenheit
 */
function toFahrenheit(celsius) {
    // Formula: °F = (°C × 9/5) + 32
    return (celsius * 9/5) + 32;
}

/**
 * Convert temperature from Celsius to Kelvin
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} Temperature in Kelvin
 */
function toKelvin(celsius) {
    // Formula: K = °C + 273.15
    return celsius + 273.15;
}

/**
 * Validate input value
 * @param {string} input - Input value to validate
 * @returns {boolean} True if input is valid
 */
function isValidInput(input) {
    // Check if input is empty
    if (input === '') {
        return false;
    }
    
    // Check if input is a valid number
    const number = parseFloat(input);
    if (isNaN(number)) {
        return false;
    }
    
    // Check for reasonable temperature ranges
    // Allow Kelvin values as low as 0 (absolute zero)
    const unit = unitSelect.value;
    if (unit === 'kelvin' && number < 0) {
        return false;
    }
    
    return true;
}

/**
 * Display error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    
    // Clear error after 3 seconds
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 3000);
}

/**
 * Clear error message
 */
function clearError() {
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
}

/**
 * Format number to 2 decimal places
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
    return parseFloat(num.toFixed(2));
}

/**
 * Update all temperature results based on input
 */
function updateResults() {
    clearError();
    
    const inputValue = temperatureInput.value;
    const currentUnit = unitSelect.value;
    
    // Validate input
    if (!isValidInput(inputValue)) {
        if (inputValue === '') {
            // Reset all results to dash
            celsiusResult.textContent = '-';
            fahrenheitResult.textContent = '-';
            kelvinResult.textContent = '-';
        } else {
            showError('Please enter a valid number');
            celsiusResult.textContent = '-';
            fahrenheitResult.textContent = '-';
            kelvinResult.textContent = '-';
        }
        return;
    }
    
    const value = parseFloat(inputValue);
    
    // Special validation for Kelvin (cannot be below 0)
    if (currentUnit === 'kelvin' && value < 0) {
        showError('Kelvin temperature cannot be below 0 K (absolute zero)');
        celsiusResult.textContent = '-';
        fahrenheitResult.textContent = '-';
        kelvinResult.textContent = '-';
        return;
    }
    
    // Convert input to Celsius (base unit)
    const celsius = toCelsius(value, currentUnit);
    
    // Convert from Celsius to all units
    const fahrenheit = toFahrenheit(celsius);
    const kelvin = toKelvin(celsius);
    
    // Update result displays with animation
    updateResultDisplay(celsiusResult, formatNumber(celsius));
    updateResultDisplay(fahrenheitResult, formatNumber(fahrenheit));
    updateResultDisplay(kelvinResult, formatNumber(kelvin));
}

/**
 * Update result display with animation
 * @param {HTMLElement} element - Result element to update
 * @param {number} value - New value to display
 */
function updateResultDisplay(element, value) {
    element.textContent = value;
    
    // Add animation class
    element.classList.remove('updated');
    // Trigger reflow to restart animation
    void element.offsetWidth;
    element.classList.add('updated');
}

/**
 * Load a test example
 * @param {number} index - Index of test example
 */
function testExample(index) {
    const example = testExamples[index];
    temperatureInput.value = example.value;
    unitSelect.value = example.unit;
    updateResults();
}

/**
 * Event Listeners
 */
temperatureInput.addEventListener('input', updateResults);
unitSelect.addEventListener('change', updateResults);

/**
 * Initialize on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    // Clear initial state
    clearError();
    
    // Example inputs and outputs for testing:
    // 
    // TEST CASE 1: 0°C
    // Input: 0, Unit: Celsius
    // Expected Output:
    //   - Celsius: 0
    //   - Fahrenheit: 32
    //   - Kelvin: 273.15
    //
    // TEST CASE 2: 32°F (Freezing Point)
    // Input: 32, Unit: Fahrenheit
    // Expected Output:
    //   - Celsius: 0
    //   - Fahrenheit: 32
    //   - Kelvin: 273.15
    //
    // TEST CASE 3: 273.15K (Absolute Zero + 273.15)
    // Input: 273.15, Unit: Kelvin
    // Expected Output:
    //   - Celsius: 0
    //   - Fahrenheit: 32
    //   - Kelvin: 273.15
    //
    // TEST CASE 4: 37°C (Normal Body Temperature)
    // Input: 37, Unit: Celsius
    // Expected Output:
    //   - Celsius: 37
    //   - Fahrenheit: 98.6
    //   - Kelvin: 310.15
    //
    // TEST CASE 5: 100°C (Boiling Point)
    // Input: 100, Unit: Celsius
    // Expected Output:
    //   - Celsius: 100
    //   - Fahrenheit: 212
    //   - Kelvin: 373.15
    //
    // TEST CASE 6: -40 (Same in Celsius and Fahrenheit)
    // Input: -40, Unit: Celsius (or Fahrenheit)
    // Expected Output:
    //   - Celsius: -40
    //   - Fahrenheit: -40
    //   - Kelvin: 233.15
});
