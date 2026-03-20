// Form validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'red';
            isValid = false;
        } else {
            input.style.borderColor = '#ddd';
        }
    });

    return isValid;
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add event listeners for form validation
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('booking-form');
    const contactForm = document.getElementById('contact-form');

    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            if (!validateForm('booking-form')) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            if (!validateForm('contact-form')) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    }
});