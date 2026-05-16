let activeTabMode = 'manual';
let currentPage = 1;

window.advRegHours = 0;
window.advOt125 = 0;
window.advOt150 = 0;
window.advWorkDays = 0;

// --- ניהול דפים וסרגל התקדמות ---

function showPage(pageNum) {
    // הסתרת כל הדפים
    for (let i = 1; i <= 5; i++) {
        const page = document.getElementById(`page-${i}`);
        if (page) {
            page.classList.add('hidden');
            page.classList.remove('block');
        }
    }

    // הצגת הדף המבוקש
    const activePage = document.getElementById(`page-${pageNum}`);
    if (activePage) {
        activePage.classList.remove('hidden');
        activePage.classList.add('block');
    }

    const wizardProgress = document.getElementById('wizard-progress');
    const mainHeader = document.getElementById('main-header');

    // אם אנחנו מציגים את דף התוצאה (5), נעלים את סרגל ההתקדמות והכותרת הכללית 
    // כדי ליצור תחושה של "דף חדש" ללא החלפת טאב אמיתית.
    if (pageNum === 5) {
        if (wizardProgress) {
            wizardProgress.classList.add('hidden');
            wizardProgress.classList.remove('flex');
        }
        if (mainHeader) {
            mainHeader.classList.add('hidden');
        }
    } else {
        if (wizardProgress) {
            wizardProgress.classList.remove('hidden');
            wizardProgress.classList.add('flex');
        }
        if (mainHeader) {
            mainHeader.classList.remove('hidden');
        }

        // עדכון סרגל ההתקדמות הוויזואלי ל-4 שלבים (המקסימום הוא 3 קטעי קו)
        const lineWidth = ((pageNum - 1) / 3) * 100;
        document.getElementById('progress-line').style.width = `calc(${lineWidth}%)`;
        if (document.dir === 'rtl') {
            document.getElementById('progress-line').style.right = '0';
            document.getElementById('progress-line').style.left = 'auto';
        }

        for (let i = 1; i <= 4; i++) {
            const indContainer = document.getElementById(`indicator-${i}`);
            if (!indContainer) continue;

            const ind = indContainer.querySelector('div');
            const text = indContainer.querySelector('span');

            // איפוס סגנונות
            ind.className = "w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md border-4 border-white transition-colors duration-300";
            text.className = "text-xs mt-2 font-medium absolute -bottom-6 w-20 text-center transition-colors";

            if (i < pageNum) {
                // שלבים שהושלמו
                ind.classList.add('bg-blue-600', 'text-white');
                text.classList.add('text-slate-700');
            } else if (i === pageNum) {
                // שלב נוכחי
                ind.classList.add('bg-blue-600', 'text-white', 'ring-4', 'ring-blue-100');
                text.classList.add('text-blue-700', 'font-bold');
            } else {
                // שלבים עתידיים
                ind.classList.add('bg-slate-200', 'text-slate-500', 'shadow-sm');
                text.classList.add('text-slate-400');
            }
        }
    }

    currentPage = pageNum;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevPage(pageNum) {
    showPage(pageNum - 1);
}

// --- אימות שדות לפני מעבר דף ---

function validateAndNext(pageNum) {
    let isValid = true;
    const errorMsg = document.getElementById(`error-msg-${pageNum}`);
    let hebrewError = false;

    if (pageNum === 1) {
        const fields = ['first-name', 'last-name', 'workplace', 'job-role'];
        const hebrewRegex = /^[א-ת\s]+$/;

        fields.forEach(id => {
            const el = document.getElementById(id);
            const value = el.value.trim();

            if (!value || !hebrewRegex.test(value)) {
                isValid = false;
                el.classList.add('border-red-500', 'ring-red-500', 'bg-red-50');
                el.classList.remove('border-slate-300', 'focus:ring-blue-500');
                if (value && !hebrewRegex.test(value)) hebrewError = true;
            } else {
                el.classList.remove('border-red-500', 'ring-red-500', 'bg-red-50');
                el.classList.add('border-slate-300', 'focus:ring-blue-500');
            }
        });
        if (!isValid) {
            errorMsg.innerText = hebrewError ? "נא למלא את כל שדות החובה בעברית בלבד." : "נא למלא את כל שדות החובה.";
        }

    } else if (pageNum === 2) {
        const fields = ['global-salary', 'hourly-wage'];
        fields.forEach(id => {
            const el = document.getElementById(id);
            if (!el.value.trim()) {
                isValid = false;
                el.classList.add('border-red-500', 'ring-red-500', 'bg-red-50');
                el.classList.remove('border-slate-300', 'focus:ring-indigo-500');
            } else {
                el.classList.remove('border-red-500', 'ring-red-500', 'bg-red-50');
                el.classList.add('border-slate-300', 'focus:ring-indigo-500');
            }
        });

    } else if (pageNum === 3) {
        if (activeTabMode === 'manual') {
            const fields = ['total-hours', 'total-days'];
            fields.forEach(id => {
                const el = document.getElementById(id);
                if (!el.value.trim()) {
                    isValid = false;
                    el.classList.add('border-red-500', 'ring-red-500', 'bg-red-50');
                    el.classList.remove('border-slate-300', 'focus:ring-teal-500');
                } else {
                    el.classList.remove('border-red-500', 'ring-red-500', 'bg-red-50');
                    el.classList.add('border-slate-300', 'focus:ring-teal-500');
                }
            });
        }
    }

    if (!isValid) {
        errorMsg.classList.remove('hidden');
        return;
    }

    errorMsg.classList.add('hidden');
    showPage(pageNum + 1);
}

function validateAndCalculate() {
    const el = document.getElementById('travel-expenses');
    const errorMsg = document.getElementById('error-msg-4');

    if (!el.value.trim()) {
        el.classList.add('border-red-500', 'ring-red-500', 'bg-red-50');
        el.classList.remove('border-slate-300', 'focus:ring-amber-500');
        errorMsg.classList.remove('hidden');
        return;
    } else {
        el.classList.remove('border-red-500', 'ring-red-500', 'bg-red-50');
        el.classList.add('border-slate-300', 'focus:ring-amber-500');
        errorMsg.classList.add('hidden');
    }

    calculateSalary();
}

// --- ניהול טאבים (רגיל / מתקדם) ---

function switchTab(tabName) {
    activeTabMode = tabName;

    document.getElementById('tab-manual').classList.add('hidden');
    document.getElementById('tab-manual').classList.remove('block');
    document.getElementById('tab-advanced').classList.add('hidden');
    document.getElementById('tab-advanced').classList.remove('block');

    document.getElementById('btn-manual').classList.remove('active', 'bg-teal-500', 'text-white');
    document.getElementById('btn-advanced').classList.remove('active', 'bg-teal-500', 'text-white');

    document.getElementById('tab-' + tabName).classList.remove('hidden');
    document.getElementById('tab-' + tabName).classList.add('block');

    const btn = document.getElementById('btn-' + tabName);
    btn.classList.add('active', 'bg-teal-500', 'text-white');
}

function addTimeRow() {
    const tbody = document.getElementById('time-body');
    const tr = document.createElement('tr');
    tr.className = "border-b border-slate-200 hover:bg-slate-100 transition-colors";
    tr.innerHTML = `
            <td class="p-1"><input type="time" class="time-start w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-500 outline-none text-center" onchange="updateAdvancedHours()"></td>
            <td class="p-1"><input type="time" class="time-end w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-500 outline-none text-center" onchange="updateAdvancedHours()"></td>
            <td class="row-total font-bold p-2 text-slate-800">0.00</td>
            <td class="row-reg text-emerald-600 p-2">0.00</td>
            <td class="row-125 text-amber-500 p-2">0.00</td>
            <td class="row-150 text-red-500 p-2">0.00</td>
            <td class="p-1"><button class="text-red-400 hover:text-red-600 font-bold" onclick="this.closest('tr').remove(); updateAdvancedHours();" title="הסר שורה">✖</button></td>
        `;
    tbody.appendChild(tr);
}

function updateAdvancedHours() {
    let totalReg = 0, total125 = 0, total150 = 0, daysCount = 0;
    const rows = document.querySelectorAll('#time-body tr');

    rows.forEach(row => {
        const startInput = row.querySelector('.time-start');
        const endInput = row.querySelector('.time-end');
        if (!startInput || !endInput) return;

        const start = startInput.value;
        const end = endInput.value;

        let rowTotal = 0, reg = 0, ot125 = 0, ot150 = 0;

        if (start && end) {
            daysCount++;
            const startTime = new Date(`1970-01-01T${start}:00`);
            const endTime = new Date(`1970-01-01T${end}:00`);
            let diff = (endTime - startTime) / (1000 * 60 * 60);
            if (diff < 0) diff += 24;
            rowTotal = diff;

            reg = Math.min(rowTotal, 8);
            ot125 = Math.max(0, Math.min(rowTotal - 8, 2));
            ot150 = Math.max(0, rowTotal - 10);

            totalReg += reg;
            total125 += ot125;
            total150 += ot150;
        }
        row.querySelector('.row-total').innerText = rowTotal.toFixed(2);
        row.querySelector('.row-reg').innerText = reg.toFixed(2);
        row.querySelector('.row-125').innerText = ot125.toFixed(2);
        row.querySelector('.row-150').innerText = ot150.toFixed(2);
    });

    document.getElementById('calc-reg').innerText = totalReg.toFixed(2);
    document.getElementById('calc-125').innerText = total125.toFixed(2);
    document.getElementById('calc-150').innerText = total150.toFixed(2);

    window.advRegHours = totalReg;
    window.advOt125 = total125;
    window.advOt150 = total150;
    window.advWorkDays = daysCount;
}

// --- חישוב ותוצאות ---

function calculateSalary() {
    // --- שאיבת פרטים אישיים והצגתם בתלוש ---
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const fullName = `${firstName} ${lastName}`.trim();
    const workplace = document.getElementById('workplace').value.trim();
    const role = document.getElementById('job-role').value.trim();

    document.getElementById('res-emp-name').innerText = fullName;
    document.getElementById('res-emp-workplace').innerText = workplace;
    document.getElementById('res-emp-role').innerText = role;

    // --- חישובי המחשבון ---
    const globalSalary = parseFloat(document.getElementById('global-salary').value) || 0;
    const hourlyWage = parseFloat(document.getElementById('hourly-wage').value) || 0;

    let regHours = 0, ot125Hours = 0, ot150Hours = 0, workDays = 0;

    if (activeTabMode === 'manual') {
        const manualTotalHours = parseFloat(document.getElementById('total-hours').value) || 0;
        workDays = parseFloat(document.getElementById('total-days').value) || 0;

        if (workDays > 0 && manualTotalHours > 0) {
            const maxRegHours = workDays * 8;
            const max125Hours = workDays * 2;

            regHours = Math.min(manualTotalHours, maxRegHours);
            const remainderHours = Math.max(0, manualTotalHours - regHours);

            ot125Hours = Math.min(remainderHours, max125Hours);
            ot150Hours = Math.max(0, remainderHours - ot125Hours);
        } else {
            regHours = manualTotalHours;
            ot125Hours = 0;
            ot150Hours = 0;
        }
    } else {
        regHours = window.advRegHours || 0;
        ot125Hours = window.advOt125 || 0;
        ot150Hours = window.advOt150 || 0;
        workDays = window.advWorkDays || 0;
    }

    const vacationDays = parseFloat(document.getElementById('vacation-days').value) || 0;
    const sickDays = parseFloat(document.getElementById('sick-days').value) || 0;
    const unpaidDays = parseFloat(document.getElementById('unpaid-days').value) || 0;
    const travelExpenses = parseFloat(document.getElementById('travel-expenses').value) || 0;
    const creditPoints = parseFloat(document.getElementById('credit-points').value) || 0;
    const dedOther = parseFloat(document.getElementById('deduction-other').value) || 0;

    const dailyWageForHourly = (hourlyWage * 8) + (hourlyWage * 2 * 1.25);

    let unpaidLeaveDeduction = 0;
    if (globalSalary > 0 && unpaidDays > 0) {
        unpaidLeaveDeduction = unpaidDays * (globalSalary / 22);
    }

    let baseSalaryToPay = 0;
    if (globalSalary > 0) {
        baseSalaryToPay = globalSalary - unpaidLeaveDeduction;
        if (baseSalaryToPay < 0) baseSalaryToPay = 0;
    } else {
        baseSalaryToPay = regHours * hourlyWage;
    }

    const otPay = (ot125Hours * hourlyWage * 1.25) + (ot150Hours * hourlyWage * 1.5);

    let vacationPay = 0;
    if (globalSalary > 0) {
        vacationPay = vacationDays * (globalSalary / 22);
    } else {
        vacationPay = vacationDays * dailyWageForHourly;
    }

    let dailyWageForSickPay = 0;
    if (globalSalary > 0) {
        dailyWageForSickPay = globalSalary / 30;
    } else {
        dailyWageForSickPay = dailyWageForHourly;
    }

    let sickPayMultiplier = 0;
    if (sickDays === 1) sickPayMultiplier = 0;
    else if (sickDays === 2) sickPayMultiplier = 0.5;
    else if (sickDays === 3) sickPayMultiplier = 1.0;
    else if (sickDays >= 4) sickPayMultiplier = 1.0 + (sickDays - 3);
    const sickPay = sickPayMultiplier * dailyWageForSickPay;

    const grossSalary = baseSalaryToPay + otPay + vacationPay + sickPay + travelExpenses;

    const reducedBracketLimit = 7522;
    let btlTax = 0, healthTax = 0;

    if (grossSalary <= reducedBracketLimit) {
        btlTax = grossSalary * 0.004;
        healthTax = grossSalary * 0.031;
    } else {
        btlTax = (reducedBracketLimit * 0.004) + ((grossSalary - reducedBracketLimit) * 0.0295);
        healthTax = (reducedBracketLimit * 0.031) + ((grossSalary - reducedBracketLimit) * 0.05);
    }

    let incomeTax = 0;
    if (grossSalary > 0) incomeTax += Math.min(grossSalary, 7010) * 0.10;
    if (grossSalary > 7010) incomeTax += Math.min(grossSalary - 7010, 3050) * 0.14;
    if (grossSalary > 10060) incomeTax += Math.min(grossSalary - 10060, 6090) * 0.20;
    if (grossSalary > 16150) incomeTax += (grossSalary - 16150) * 0.31;

    const creditPointValue = 242;
    const taxDiscount = creditPoints * creditPointValue;
    incomeTax = Math.max(0, incomeTax - taxDiscount);

    const netSalary = grossSalary - incomeTax - btlTax - healthTax - dedOther;

    document.getElementById('res-base-gross').innerText = (globalSalary > 0 ? globalSalary : baseSalaryToPay).toFixed(2) + ' ₪';

    const unpaidRow = document.getElementById('row-unpaid-deduction');
    if (unpaidLeaveDeduction > 0) {
        unpaidRow.style.display = 'flex';
        document.getElementById('res-unpaid').innerText = '-' + unpaidLeaveDeduction.toFixed(2) + ' ₪';
    } else {
        unpaidRow.style.display = 'none';
    }

    document.getElementById('res-hourly-rate').innerText = hourlyWage.toFixed(2) + ' ₪';
    document.getElementById('res-total-days').innerText = workDays;
    document.getElementById('res-total-hours').innerText = regHours.toFixed(2);

    const ot125Row = document.getElementById('row-ot-125');
    if (ot125Hours > 0) {
        ot125Row.style.display = 'flex';
        document.getElementById('res-ot-125').innerText = ot125Hours.toFixed(2);
    } else {
        ot125Row.style.display = 'none';
    }

    const ot150Row = document.getElementById('row-ot-150');
    if (ot150Hours > 0) {
        ot150Row.style.display = 'flex';
        document.getElementById('res-ot-150').innerText = ot150Hours.toFixed(2);
    } else {
        ot150Row.style.display = 'none';
    }

    const otRow = document.getElementById('row-overtime');
    if (otPay > 0) {
        otRow.style.display = 'flex';
        document.getElementById('res-overtime').innerText = otPay.toFixed(2) + ' ₪';
    } else {
        otRow.style.display = 'none';
    }

    document.getElementById('res-vacation').innerText = vacationPay.toFixed(2) + ' ₪';
    document.getElementById('res-sick').innerText = sickPay.toFixed(2) + ' ₪';
    document.getElementById('res-travel').innerText = travelExpenses.toFixed(2) + ' ₪';
    document.getElementById('res-gross').innerText = grossSalary.toFixed(2) + ' ₪';

    document.getElementById('res-tax').innerText = '-' + incomeTax.toFixed(2) + ' ₪';
    document.getElementById('res-btl').innerText = '-' + btlTax.toFixed(2) + ' ₪';
    document.getElementById('res-health').innerText = '-' + healthTax.toFixed(2) + ' ₪';
    document.getElementById('res-other').innerText = '-' + dedOther.toFixed(2) + ' ₪';
    document.getElementById('res-net').innerText = netSalary.toFixed(2) + ' ₪';

    // מעבר לדף התוצאה (עמוד 5) המשמש כעת כ"דף חדש" ללא האשף
    showPage(5);
}

function clearAllData() {
    // איפוס כל הנתונים וחזרה לדף הראשון
    const inputs = document.querySelectorAll('input[type="text"], input[type="number"]');
    inputs.forEach(input => {
        if (input.id !== 'credit-points') input.value = '';
    });

    document.getElementById('credit-points').value = "2.25";
    document.getElementById('vacation-days').value = "0";
    document.getElementById('sick-days').value = "0";
    document.getElementById('unpaid-days').value = "0";
    document.getElementById('deduction-other').value = "0";

    document.getElementById('time-body').innerHTML = '';
    addTimeRow();

    window.advRegHours = 0; window.advOt125 = 0; window.advOt150 = 0; window.advWorkDays = 0;
    document.getElementById('calc-reg').innerText = "0.00";
    document.getElementById('calc-125').innerText = "0.00";
    document.getElementById('calc-150').innerText = "0.00";

    // הסרת שגיאות
    const allInputs = document.querySelectorAll('input');
    allInputs.forEach(el => {
        el.classList.remove('border-red-500', 'ring-red-500', 'bg-red-50');
    });
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`error-msg-${i}`).classList.add('hidden');
    }

    switchTab('manual');
    showPage(1);
}

window.onload = function () {
    addTimeRow();
    // הצגת הדף הראשון בעת טעינה
    showPage(1);
};

// --- הפעלת מקש Enter למעבר בין שדות (כמו Tab) ---
document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        const active = document.activeElement;

        // אנחנו מתערבים רק אם המשתמש נמצא בתוך שדה קלט
        if (active.tagName === 'INPUT') {
            e.preventDefault(); // מניעת התנהגות ברירת מחדל כמו ריענון העמוד

            const currentPageEl = document.getElementById('page-' + currentPage);
            if (!currentPageEl) return;

            // שולפים את כל שדות הקלט שגלויים כרגע בדף הנוכחי
            const inputs = Array.from(currentPageEl.querySelectorAll('input')).filter(el => el.offsetParent !== null && !el.disabled);
            const currentIndex = inputs.indexOf(active);

            if (currentIndex > -1) {
                if (currentIndex < inputs.length - 1) {
                    // אם זה לא השדה האחרון, קפוץ לשדה הבא
                    inputs[currentIndex + 1].focus();
                } else {
                    // אם זה השדה האחרון, לחץ אוטומטית על הכפתור המרכזי של הדף (המשך / חשב)
                    if (currentPage === 4) {
                        validateAndCalculate();
                    } else if (currentPage < 5) {
                        validateAndNext(currentPage);
                    }
                }
            }
        }
    }
});

window.onload = function () {
    addTimeRow();
    // הצגת הדף הראשון בעת טעינה
    showPage(1);
};