// === Date Picker Logic ===

class DatePicker {
    constructor() {
        this.displayDateInput = document.getElementById('displayDate');
        this.dobFinalADInput = document.getElementById('dobFinalAD');
        this.datePickerModal = document.getElementById('datePickerModal');
        this.closePickerBtn = document.querySelector('.close-picker');
        this.confirmDateBtn = document.getElementById('confirmDateBtn');
        this.npYearList = document.getElementById('npYearList');
        this.npMonthList = document.getElementById('npMonthList');
        this.npDayList = document.getElementById('npDayList');
        this.pickerHeaderTitle = document.querySelector('.datepicker-header h3');
        this.radioBS = document.getElementById('modeBS');
        this.radioAD = document.getElementById('modeAD');

        // State
        this.currentMode = 'BS';
        this.selectedBS = { year: 2055, month: 0, day: 1 };
        this.selectedAD = { year: 1998, month: 3, day: 14 };

        // Month names
        this.monthsBS = ["Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin", "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"];
        this.monthsAD = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        this.init();
    }

    init() {
        if (!this.displayDateInput) return;

        // Mode switch listeners
        this.radioBS.addEventListener('change', () => {
            if (this.radioBS.checked) this.switchMode('BS');
        });
        this.radioAD.addEventListener('change', () => {
            if (this.radioAD.checked) this.switchMode('AD');
        });

        // Open picker
        this.displayDateInput.addEventListener('click', () => {
            this.datePickerModal.classList.add('active');
            this.initPickerState();
        });

        // Close picker
        this.closePickerBtn.addEventListener('click', () => {
            this.datePickerModal.classList.remove('active');
        });

        // Confirm date
        this.confirmDateBtn.addEventListener('click', () => this.confirmDate());
    }

    switchMode(newMode) {
        this.currentMode = newMode;
        this.pickerHeaderTitle.innerText = this.currentMode === 'BS' ? 'Select Nepali Date' : 'Select English Date';

        const NPDate = getNepaliDateClass();
        if (NPDate && this.dobFinalADInput.value) {
            try {
                const [y, m, d] = this.dobFinalADInput.value.split('-').map(Number);
                if (this.currentMode === 'AD') {
                    this.selectedAD = { year: y, month: m - 1, day: d };
                } else {
                    const adDate = new Date(y, m - 1, d);
                    const bsDate = new NPDate(adDate);
                    this.selectedBS = { year: bsDate.getYear(), month: bsDate.getMonth(), day: bsDate.getDate() };
                }
                this.updateDisplay();
            } catch (e) {
                console.error("Mode switch logic warning, resetting defaults", e);
            }
        } else {
            this.updateDisplay();
        }
    }

    generateRange(start, end) {
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    populatePicker() {
        this.npYearList.innerHTML = '';
        this.npMonthList.innerHTML = '';
        this.npDayList.innerHTML = '';

        if (this.currentMode === 'BS') {
            this.generateRange(1990, 2090).forEach(year => this.createPickerItem(this.npYearList, year, year, 'year'));
            this.monthsBS.forEach((m, i) => this.createPickerItem(this.npMonthList, m, i, 'month'));
            this.generateRange(1, 32).forEach(d => this.createPickerItem(this.npDayList, d, d, 'day'));
        } else {
            const currYear = new Date().getFullYear();
            this.generateRange(1940, currYear).forEach(year => this.createPickerItem(this.npYearList, year, year, 'year'));
            this.monthsAD.forEach((m, i) => this.createPickerItem(this.npMonthList, m, i, 'month'));
            this.generateRange(1, 31).forEach(d => this.createPickerItem(this.npDayList, d, d, 'day'));
        }
    }

    createPickerItem(container, text, value, type) {
        const el = document.createElement('div');
        el.className = `picker-item ${type}-${value}`;
        el.innerText = text;
        el.onclick = () => this.scrollToItem(container, el, type, value);
        container.appendChild(el);
    }

    scrollToItem(container, item, type, value) {
        if (this.currentMode === 'BS') {
            this.selectedBS[type] = value;
        } else {
            this.selectedAD[type] = value;
        }

        container.querySelectorAll('.picker-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        container.scrollTo({
            top: item.offsetTop - (container.clientHeight / 2) + (item.clientHeight / 2),
            behavior: 'smooth'
        });
    }

    initPickerState() {
        this.populatePicker();
        setTimeout(() => {
            const state = this.currentMode === 'BS' ? this.selectedBS : this.selectedAD;
            ['year', 'month', 'day'].forEach(type => {
                let val = state[type];
                let item = document.querySelector(`.picker-item.${type}-${val}`);
                if (item) item.click();
            });
        }, 50);
    }

    confirmDate() {
        const NPDate = getNepaliDateClass();
        try {
            if (this.currentMode === 'BS' && NPDate) {
                const bsDate = new NPDate(this.selectedBS.year, this.selectedBS.month, this.selectedBS.day);
                const adDate = new Date(bsDate.valueOf());

                if (isNaN(adDate.getTime())) throw new Error("Invalid Date");

                this.selectedAD = { year: adDate.getFullYear(), month: adDate.getMonth(), day: adDate.getDate() };
            }
            this.dobFinalADInput.value = `${this.selectedAD.year}-${pad(this.selectedAD.month + 1)}-${pad(this.selectedAD.day)}`;
            this.updateDisplay();
            this.datePickerModal.classList.remove('active');
        } catch (e) {
            console.error(e);
            showToast("Invalid date selection. Please check the Nepali date (some months do not have 32 days).", 'error');
        }
    }

    updateDisplay() {
        if (!this.dobFinalADInput.value) return;
        const state = this.currentMode === 'BS' ? this.selectedBS : this.selectedAD;
        const months = this.currentMode === 'BS' ? this.monthsBS : this.monthsAD;
        this.displayDateInput.value = `${state.year} ${months[state.month]} ${state.day}`;
    }
}

// Initialize date picker when DOM is ready
function initDatePicker() {
    if (document.getElementById('displayDate')) {
        new DatePicker();
    }
}
