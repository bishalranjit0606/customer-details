// === Validation Functions ===

/**
 * Validate mobile number (10 digits)
 */
function validateMobile(value) {
    return /^[0-9]{10}$/.test(value.trim());
}

/**
 * Validate email format
 */
function validateEmail(value) {
    if (value.trim() === '') return true; // Optional field
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Validate required field
 */
function validateRequired(value) {
    return value && value.trim() !== '';
}

/**
 * Show error on input
 */
function showError(input, message) {
    const group = input.closest('.input-group');
    if (group) {
        group.classList.add('error');
        const errorSpan = group.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.textContent = message;
        }
    }
}

/**
 * Clear error from input
 */
function clearError(input) {
    const group = input.closest('.input-group');
    if (group) {
        group.classList.remove('error');
    }
}

/**
 * Initialize real-time input sanitization
 */
function initInputSanitization() {
    // Prevent numbers in Name
    const fullNameInput = document.getElementById('fullName');
    if (fullNameInput) {
        fullNameInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[0-9]/g, '');
        });
    }

    // Prevent non-numbers in Mobile
    const mobileInput = document.getElementById('mobileNumber');
    if (mobileInput) {
        mobileInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }

    // Clear errors on focus
    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('focus', () => clearError(input));
    });
}
