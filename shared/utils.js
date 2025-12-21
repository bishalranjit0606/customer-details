// === Utility Functions ===

/**
 * Pad number with leading zero
 */
function pad(n) {
    return n.toString().padStart(2, '0');
}

/**
 * Get Nepali Date library class
 */
function getNepaliDateClass() {
    if (typeof NepaliDateConverter !== 'undefined') return NepaliDateConverter;
    if (typeof NepaliDate !== 'undefined') {
        return NepaliDate.default || NepaliDate;
    }
    return null;
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
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
}

/**
 * Remove toast notification
 */
function removeToast(toast) {
    toast.classList.add('hiding');
    toast.addEventListener('animationend', () => toast.remove());
}

/**
 * Initialize theme toggle
 */
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('themeToggle');
    if (!themeToggleBtn) return;

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
}
