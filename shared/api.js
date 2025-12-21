// === API Submission Handler ===

/**
 * Initialize form submission
 */
function initFormSubmission(scriptURL, brandName = 'LuxeMobile') {
    const form = document.getElementById('customerForm');
    if (!form) return;

    const mobileInput = document.getElementById('mobileNumber');
    const emailInput = document.getElementById('email');
    const dobFinalADInput = document.getElementById('dobFinalAD');
    const consentInput = document.getElementById('consent');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // --- Validation ---
        // 1. Mobile
        if (!validateMobile(mobileInput.value)) {
            showError(mobileInput, 'Please enter a valid 10-digit mobile number.');
            showToast('Please enter a valid 10-digit mobile number.', 'error');
            return;
        }

        // 2. Email (Optional but must be valid if entered)
        if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address.');
            showToast('Please enter a valid email address.', 'error');
            return;
        }

        // 3. DOB
        if (!dobFinalADInput.value) {
            showToast('Please select your date of birth.', 'error');
            return;
        }

        // 4. Consent
        if (!consentInput.checked) {
            showToast('You must agree to receive offers and updates to register.', 'error');
            return;
        }

        // 5. Additional required fields (product, business, etc.)
        const requiredFields = form.querySelectorAll('input[required], select[required]');
        let hasError = false;
        requiredFields.forEach(field => {
            if (field.type !== 'checkbox' && field.type !== 'radio' && !validateRequired(field.value)) {
                showError(field, 'This field is required.');
                hasError = true;
            }
        });

        if (hasError) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }

        // --- Optimistic UI Update ---
        const btn = form.querySelector('.submit-btn');
        const btnText = btn.querySelector('.btn-text');
        const originalText = btnText.innerText;

        btn.disabled = true;
        btnText.innerText = 'Success!';
        btn.style.background = 'var(--success)';

        // Instant Success Toast
        showToast(`Registration successful! Welcome to ${brandName}.`, 'success');

        // Collect Data
        const formData = new FormData(form);
        const interests = Array.from(formData.getAll('interests')).join(', ');
        formData.set('interests', interests);

        // Combine Warranty logic (if inputs exist)
        const wValEl = document.getElementById('warrantyValue');
        const wUnitEl = document.getElementById('warrantyUnit');

        if (wValEl && wUnitEl) {
            const wVal = wValEl.value;
            const wUnit = wUnitEl.value;
            if (wVal && wUnit) {
                formData.set('warrantyPeriod', `${wVal} ${wUnit}`);
            }
        }

        // Send Request (Background)
        fetch(scriptURL, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                console.log("Data saved successfully");
            })
            .catch(error => {
                console.error('Error!', error.message);
                showToast('Notice: Sync issue. Please check internet connection.', 'error');
                btn.disabled = false;
                btnText.innerText = 'Try Again';
                btn.style.background = '';
            });

        // Reset Form
        setTimeout(() => {
            form.reset();
            dobFinalADInput.value = '';
            const displayDateInput = document.getElementById('displayDate');
            if (displayDateInput) displayDateInput.value = '';

            // Revert Button
            btn.disabled = false;
            btnText.innerText = originalText;
            btn.style.background = '';
        }, 2000);
    });
}
