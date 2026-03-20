// Get references to HTML elements
const temperatureInput = document.getElementById('temperature-input');
const unitSelect = document.getElementById('unit-select');
const convertBtn = document.getElementById('convert-btn');
const errorMessage = document.getElementById('error-message');
const celsiusResult = document.getElementById('celsius-result');
const fahrenheitResult = document.getElementById('fahrenheit-result');
const kelvinResult = document.getElementById('kelvin-result');

// Add event listener to the convert button
convertBtn.addEventListener('click', convertTemperature);

// Function to convert temperature
function convertTemperature() {
    // Get the input value and selected unit
    const inputValue = temperatureInput.value.trim();
    const selectedUnit = unitSelect.value;

    // Validate input: check if it's a number and not empty
    if (inputValue === '' || isNaN(inputValue)) {
        // Show error message
        errorMessage.textContent = 'Please enter a valid number.';
        errorMessage.style.display = 'block';
        // Hide results
        hideResults();
        return;
    }

    // Hide error message
    errorMessage.style.display = 'none';

    // Convert input to number
    const temp = parseFloat(inputValue);

    // Convert to Celsius first
    let celsius;
    if (selectedUnit === 'celsius') {
        celsius = temp;
    } else if (selectedUnit === 'fahrenheit') {
        celsius = fahrenheitToCelsius(temp);
    } else if (selectedUnit === 'kelvin') {
        celsius = kelvinToCelsius(temp);
    }

    // Now convert Celsius to the other units
    const fahrenheit = celsiusToFahrenheit(celsius);
    const kelvin = celsiusToKelvin(celsius);

    // Display results
    celsiusResult.textContent = `Celsius: ${celsius.toFixed(2)} °C`;
    fahrenheitResult.textContent = `Fahrenheit: ${fahrenheit.toFixed(2)} °F`;
    kelvinResult.textContent = `Kelvin: ${kelvin.toFixed(2)} K`;
}

// Conversion functions
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

function celsiusToKelvin(celsius) {
    return celsius + 273.15;
}

function fahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5/9;
}

function kelvinToCelsius(kelvin) {
    return kelvin - 273.15;
}

// Function to hide results
function hideResults() {
    celsiusResult.textContent = '';
    fahrenheitResult.textContent = '';
    kelvinResult.textContent = '';
}