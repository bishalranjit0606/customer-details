document.addEventListener('DOMContentLoaded', () => {
    // === Variables ===
    const displayDateInput = document.getElementById('displayDate');
    const dobFinalADInput = document.getElementById('dobFinalAD');
    const form = document.getElementById('customerForm');
    const scriptURL = "https://script.google.com/macros/s/AKfycbxNLXcw6gMQ9vbgdFoDXg0QrTyDpVtJEzZCNsWgV6LdWoyn9Mp94yBy_qlFhu_9bEaVUg/exec";

    // Inputs for Validation
    const fullNameInput = document.getElementById('fullName');
    const mobileInput = document.getElementById('mobileNumber');
    const emailInput = document.getElementById('email');
    const consentInput = document.getElementById('consent');

    // Toggle Inputs
    const radioBS = document.getElementById('modeBS');
    const radioAD = document.getElementById('modeAD');

    // Custom Picker Elements
    const datePickerModal = document.getElementById('datePickerModal');
    const closePickerBtn = document.querySelector('.close-picker');
    const confirmDateBtn = document.getElementById('confirmDateBtn');
    const npYearList = document.getElementById('npYearList');
    const npMonthList = document.getElementById('npMonthList');
    const npDayList = document.getElementById('npDayList');
    const pickerHeaderTitle = document.querySelector('.datepicker-header h3');

    // State
    let currentMode = 'BS';
    let selectedBS = { year: 2055, month: 0, day: 1 };
    let selectedAD = { year: 1998, month: 3, day: 14 };

    // Helper: Nepali Date Library Access
    const getNepaliDateClass = () => {
        if (typeof NepaliDateConverter !== 'undefined') return NepaliDateConverter;
        if (typeof NepaliDate !== 'undefined') {
            return NepaliDate.default || NepaliDate;
        }
        return null;
    };

    const pad = (n) => n.toString().padStart(2, '0');

    // === 0. Real-time Validation ===
    // Prevent numbers in Name
    fullNameInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[0-9]/g, '');
    });

    // Prevent non-numbers in Mobile
    mobileInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    // === 1. Mode Switch Logic ===
    const switchMode = (newMode) => {
        currentMode = newMode;
        pickerHeaderTitle.innerText = currentMode === 'BS' ? 'Select Nepali Date' : 'Select English Date';

        const NPDate = getNepaliDateClass();
        if (NPDate && dobFinalADInput.value) {
            try {
                const [y, m, d] = dobFinalADInput.value.split('-').map(Number);
                if (currentMode === 'AD') {
                    selectedAD = { year: y, month: m - 1, day: d };
                } else {
                    const adDate = new Date(y, m - 1, d);
                    const bsDate = new NPDate(adDate);
                    selectedBS = { year: bsDate.getYear(), month: bsDate.getMonth(), day: bsDate.getDate() };
                }
                updateDisplay();
            } catch (e) {
                console.error("Mode switch logic warning, resetting defaults", e);
                // Fallback if conversion fails (e.g. invalid date boundaries)
            }
        } else {
            updateDisplay();
        }
    };

    radioBS.addEventListener('change', () => { if (radioBS.checked) switchMode('BS'); });
    radioAD.addEventListener('change', () => { if (radioAD.checked) switchMode('AD'); });

    // === 2. Picker Population Logic ===
    const monthsBS = ["Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin", "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"];
    const monthsAD = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const generateRange = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

    const populatePicker = () => {
        npYearList.innerHTML = ''; npMonthList.innerHTML = ''; npDayList.innerHTML = '';

        if (currentMode === 'BS') {
            generateRange(1990, 2090).forEach(year => createPickerItem(npYearList, year, year, 'year'));
            monthsBS.forEach((m, i) => createPickerItem(npMonthList, m, i, 'month'));
            generateRange(1, 32).forEach(d => createPickerItem(npDayList, d, d, 'day'));
        } else {
            const currYear = new Date().getFullYear();
            generateRange(1940, currYear).forEach(year => createPickerItem(npYearList, year, year, 'year'));
            monthsAD.forEach((m, i) => createPickerItem(npMonthList, m, i, 'month'));
            generateRange(1, 31).forEach(d => createPickerItem(npDayList, d, d, 'day'));
        }
    };

    const createPickerItem = (container, text, value, type) => {
        const el = document.createElement('div');
        el.className = `picker-item ${type}-${value}`;
        el.innerText = text;
        el.onclick = () => scrollToItem(container, el, type, value);
        container.appendChild(el);
    };

    const scrollToItem = (container, item, type, value) => {
        if (currentMode === 'BS') {
            selectedBS[type] = value;
        } else {
            selectedAD[type] = value;
        }

        container.querySelectorAll('.picker-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        container.scrollTo({ top: item.offsetTop - (container.clientHeight / 2) + (item.clientHeight / 2), behavior: 'smooth' });
    };

    const initPickerState = () => {
        populatePicker();
        // Delay to allow DOM update
        setTimeout(() => {
            const state = currentMode === 'BS' ? selectedBS : selectedAD;
            ['year', 'month', 'day'].forEach(type => {
                // Ensure value exists in picker (handle 32nd day edge cases visually later or just select max)
                let val = state[type];
                let item = document.querySelector(`.picker-item.${type}-${val}`);
                if (item) item.click();
            });
        }, 50);
    };

    displayDateInput.addEventListener('click', () => {
        datePickerModal.classList.add('active');
        initPickerState();
    });

    closePickerBtn.addEventListener('click', () => datePickerModal.classList.remove('active'));

    // === 3. Confirm & Sync Logic ===
    confirmDateBtn.addEventListener('click', () => {
        const NPDate = getNepaliDateClass();
        try {
            if (currentMode === 'BS' && NPDate) {
                // NepaliDateConverter uses 0-indexed months
                const bsDate = new NPDate(selectedBS.year, selectedBS.month, selectedBS.day);

                // Fix: Use valueOf() to get timestamp as toJsDate() is missing in this version
                const adDate = new Date(bsDate.valueOf());

                // Validate if adDate is valid (invalid BS dates usually result in weird AD dates)
                if (isNaN(adDate.getTime())) throw new Error("Invalid Date");

                selectedAD = { year: adDate.getFullYear(), month: adDate.getMonth(), day: adDate.getDate() };
            }
            dobFinalADInput.value = `${selectedAD.year}-${pad(selectedAD.month + 1)}-${pad(selectedAD.day)}`;
            updateDisplay();
            datePickerModal.classList.remove('active');
        } catch (e) {
            console.error(e);
            showToast("Invalid date selection. Please check the Nepali date (some months do not have 32 days).", 'error');
        }
    });

    const updateDisplay = () => {
        if (!dobFinalADInput.value) return;
        const state = currentMode === 'BS' ? selectedBS : selectedAD;
        const months = currentMode === 'BS' ? monthsBS : monthsAD;
        displayDateInput.value = `${state.year} ${months[state.month]} ${state.day}`;
    };

    // === 5. Premium Notification System (Toast) ===
    const showToast = (message, type = 'info') => {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const iconMap = {
            success: 'ph-check-circle',
            error: 'ph-warning-circle',
            info: 'ph-info'
        };

        toast.innerHTML = `
            <div class="toast-icon"><i class="ph-fill ${iconMap[type]}"></i></div>
            <div class="toast-message">${message}</div>
            <button class="toast-close"><i class="ph-bold ph-x"></i></button>
        `;

        // Close button logic
        toast.querySelector('.toast-close').onclick = () => removeToast(toast);

        // Auto remove
        setTimeout(() => removeToast(toast), 4000);

        container.appendChild(toast);
    };

    const removeToast = (toast) => {
        toast.classList.add('hiding');
        toast.addEventListener('animationend', () => toast.remove());
    };

    // === 4. Secure & Optimistic Form Submission ===
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // --- Validation ---
        // 1. Mobile
        if (!/^[0-9]{10}$/.test(mobileInput.value.trim())) {
            showError(mobileInput, 'Please enter a valid 10-digit mobile number.');
            showToast('Please enter a valid 10-digit mobile number.', 'error');
            return;
        }

        // 2. Email (Optional but must be valid if entered)
        if (emailInput.value.trim() !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                showError(emailInput, 'Please enter a valid email address.');
                showToast('Please enter a valid email address.', 'error');
                return;
            }
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

        // --- Optimistic UI Update ---
        const btn = form.querySelector('.submit-btn');
        const btnText = btn.querySelector('.btn-text');
        const originalText = btnText.innerText;

        btn.disabled = true;
        btnText.innerText = 'Success!';
        btn.style.background = 'var(--success)';

        // Instant Success Toast
        showToast('Registration successful! Welcome to LuxeMobile.', 'success');

        // Collect Data
        const formData = new FormData(form);
        const interests = Array.from(formData.getAll('interests')).join(', ');
        formData.set('interests', interests);

        // Send Request (Background) //
        // Even if it fails, we showed success. 
        // We will only alert if it fails.
        // We can delay the reset slightly to let user see "Success"

        fetch(scriptURL, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                console.log("Data saved successfully");
                // Keep the success state
            })
            .catch(error => {
                console.error('Error!', error.message);
                // Revert UI on critical failure only if needed, 
                // but for "Optimistic" speed, we usually assume success.
                // However, if it fails, we should probably tell them slightly later or just log it.
                // For this user request: "as soon as button is clicked, data is saved" -> implies UI feedback.
                showToast('Notice: Sync issue. Please check internet connection.', 'error');
                btn.disabled = false;
                btnText.innerText = 'Try Again';
                btn.style.background = '';
            });

        // Reset Form Immediately (or after short delay for visual confirmation)
        setTimeout(() => {
            form.reset();
            dobFinalADInput.value = '';
            displayDateInput.value = '';

            // Revert Button
            btn.disabled = false;
            btnText.innerText = originalText;
            btn.style.background = '';

        }, 2000); // 2s delay just to let them see "Success!" on the button
    });

    const showError = (input, msg) => {
        const group = input.closest('.input-group');
        group.classList.add('error');
        // If there's an error span, update it? 
        // For now just alert or rely on CSS
        // const errorSpan = group.querySelector('.error-message') || group.querySelector('.helper-text');
    };

    // Remove error highlights on focus
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', () => {
            const group = input.closest('.input-group');
            if (group) group.classList.remove('error');
        });
    });
    // === 6. Theme Toggle Logic ===
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = themeToggleBtn.querySelector('i');

    // Check saved theme or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.replace('ph-moon', 'ph-sun');
        } else {
            themeIcon.classList.replace('ph-sun', 'ph-moon');
        }
    }
});