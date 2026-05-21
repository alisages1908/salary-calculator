let currentStep = 1;
let activeTab = 'regular';
const totalSteps = 4;

setTimeout(calculateTableHours, 100);

function attemptGoToStep(targetStep) {
    if (targetStep > totalSteps || targetStep < 1) return;
    if (targetStep <= currentStep) {
        goToStep(targetStep);
        return;
    }
    let canProceed = true;
    for (let i = currentStep; i < targetStep; i++) {
        if (!validateSpecificStep(i)) {
            canProceed = false;
            goToStep(i);
            showError("נא למלא את כל שדות החובה בעברית או להשלים את הנתונים כדי להמשיך.");
            break;
        }
    }
    if (canProceed) {
        hideError();
        goToStep(targetStep);
    }
}

function validateSpecificStep(stepNum) {
    let isValid = true;
    const stepDiv = document.getElementById(`step-${stepNum}`);

    let inputs;
    if (stepNum === 3) {
        if (activeTab === 'regular') {
            inputs = stepDiv.querySelectorAll('.step-3-req');
        } else {
            inputs = [];
        }
    } else {
        inputs = stepDiv.querySelectorAll('input[required]');
    }

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('border-red-500', 'bg-red-50');
        } else {
            input.classList.remove('border-red-500', 'bg-red-50');
        }
    });

    if (stepNum === 1) {
        const hebRegex = /^[\u0590-\u05FF\s]+$/;
        inputs.forEach(input => {
            if (input.value && !hebRegex.test(input.value)) {
                isValid = false;
                input.classList.add('border-red-500', 'bg-red-50');
            }
        });
    }
    return isValid;
}

function goToStep(step) {
    document.querySelectorAll('.step-content').forEach(el => el.classList.add('step-hidden'));
    if (step <= totalSteps) {
        document.getElementById(`step-${step}`).classList.remove('step-hidden');
        document.getElementById('wizard-tracker').classList.remove('hidden');
        updateTracker(step);
    } else {
        document.getElementById('step-result').classList.remove('step-hidden');
        document.getElementById('wizard-tracker').classList.add('hidden');
    }
    currentStep = step;
}

function updateTracker(step) {
    for (let i = 1; i <= totalSteps; i++) {
        const ind = document.getElementById(`ind-${i}`);
        const text = document.getElementById(`ind-text-${i}`);

        if (i < step) {
            ind.className = "w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold bg-emerald-500 text-white transition-all shadow-md cursor-pointer hover:bg-emerald-600 hover:scale-105";
            ind.innerHTML = "✓";
            text.className = "mt-3 text-sm font-bold text-emerald-600";
        } else if (i === step) {
            ind.className = "w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold bg-blue-600 text-white transition-all ring-8 ring-blue-100 shadow-lg scale-110 cursor-pointer";
            ind.innerHTML = i;
            text.className = "mt-3 text-sm font-bold text-blue-700";
        } else {
            ind.className = "w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold bg-slate-200 text-slate-400 transition-all shadow-inner cursor-pointer hover:bg-slate-300 hover:scale-105";
            ind.innerHTML = i;
            text.className = "mt-3 text-sm font-semibold text-slate-400";
        }
    }
}

function showError(msg) {
    const errDiv = document.getElementById('global-error');
    errDiv.innerText = msg;
    errDiv.classList.remove('hidden');
}

function hideError() {
    document.getElementById('global-error').classList.add('hidden');
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const active = document.activeElement;
        if (active.tagName === 'INPUT') {
            const stepDiv = document.getElementById(currentStep <= totalSteps ? `step-${currentStep}` : 'step-result');
            const inputs = Array.from(stepDiv.querySelectorAll('input:not([type="hidden"]):not([disabled])')).filter(i => i.offsetParent !== null);
            const index = inputs.indexOf(active);
            if (index > -1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            } else {
                const btn = stepDiv.querySelector('.next-btn');
                if (btn) btn.click();
            }
        }
    }
});

function toggleTab(tabId) {
    activeTab = tabId;
    const btnAdv = document.getElementById('tab-btn-advanced');
    const btnReg = document.getElementById('tab-btn-regular');

    if (tabId === 'advanced') {
        document.getElementById('tab-advanced').classList.remove('hidden');
        document.getElementById('tab-advanced').classList.add('block');
        document.getElementById('tab-regular').classList.add('hidden');
        document.getElementById('tab-regular').classList.remove('block');

        btnAdv.className = "flex-1 py-3 rounded-md bg-white shadow-sm font-bold text-teal-700 border-t-2 border-teal-500 transition-all";
        btnReg.className = "flex-1 py-3 rounded-md font-bold text-slate-500 hover:bg-slate-200 transition-all border-t-2 border-transparent";
    } else {
        document.getElementById('tab-regular').classList.remove('hidden');
        document.getElementById('tab-regular').classList.add('block');
        document.getElementById('tab-advanced').classList.remove('block');
        document.getElementById('tab-advanced').classList.add('hidden');

        btnReg.className = "flex-1 py-3 rounded-md bg-white shadow-sm font-bold text-teal-700 border-t-2 border-teal-500 transition-all";
        btnAdv.className = "flex-1 py-3 rounded-md font-bold text-slate-500 hover:bg-slate-200 transition-all border-t-2 border-transparent";
    }
}

function addRow() {
    const table = document.getElementById("hours-table").getElementsByTagName('tbody')[0];
    const row = table.insertRow();
    row.className = "border-b border-slate-100 hover:bg-slate-50";
    row.innerHTML = `
                <td class="p-2"><input type="time" class="time-in w-full bg-slate-100 border-none rounded p-2 text-center focus:bg-white focus:ring-1 focus:ring-teal-400 outline-none" value="08:00" onchange="calculateTableHours()"></td>
                <td class="p-2"><input type="time" class="time-out w-full bg-slate-100 border-none rounded p-2 text-center focus:bg-white focus:ring-1 focus:ring-teal-400 outline-none" value="17:00" onchange="calculateTableHours()"></td>
                <td class="p-2 font-bold text-slate-800 row-total">0.00</td>
                <td class="p-2 font-bold text-green-600 row-100">0.00</td>
                <td class="p-2 font-bold text-yellow-500 row-125">0.00</td>
                <td class="p-2 font-bold text-red-500 row-150">0.00</td>
                <td class="p-2"><button onclick="removeRow(this)" class="text-slate-400 hover:text-red-600 font-bold text-lg">&times;</button></td>
            `;
    calculateTableHours();
}

function removeRow(btn) {
    const row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
    calculateTableHours();
}

let tableCalcData = { regular: 0, ot125: 0, ot150: 0, days: 0 };

function calculateTableHours() {
    const tbody = document.getElementById("hours-table").getElementsByTagName('tbody')[0];
    let total100 = 0, total125 = 0, total150 = 0;
    tableCalcData = { regular: 0, ot125: 0, ot150: 0, days: 0 };

    for (let i = 0; i < tbody.rows.length; i++) {
        const timeIn = tbody.rows[i].querySelector('.time-in').value;
        const timeOut = tbody.rows[i].querySelector('.time-out').value;

        let rowH = 0, row100 = 0, row125 = 0, row150 = 0;

        if (timeIn && timeOut) {
            const start = new Date("1970-01-01 " + timeIn);
            let end = new Date("1970-01-01 " + timeOut);
            if (end < start) end.setDate(end.getDate() + 1);

            rowH = (end - start) / (1000 * 60 * 60);
            tableCalcData.days += 1;

            if (rowH <= 8) {
                row100 = rowH;
            } else if (rowH <= 10) {
                row100 = 8;
                row125 = rowH - 8;
            } else {
                row100 = 8;
                row125 = 2;
                row150 = rowH - 10;
            }

            total100 += row100;
            total125 += row125;
            total150 += row150;
        }

        tbody.rows[i].querySelector('.row-total').innerText = rowH.toFixed(2);
        tbody.rows[i].querySelector('.row-100').innerText = row100.toFixed(2);
        tbody.rows[i].querySelector('.row-125').innerText = row125.toFixed(2);
        tbody.rows[i].querySelector('.row-150').innerText = row150.toFixed(2);
    }

    tableCalcData.regular = total100;
    tableCalcData.ot125 = total125;
    tableCalcData.ot150 = total150;

    document.getElementById("tbl-total-100").innerText = total100.toFixed(2);
    document.getElementById("tbl-total-125").innerText = total125.toFixed(2);
    document.getElementById("tbl-total-150").innerText = total150.toFixed(2);
}

function getVal(id) { return parseFloat(document.getElementById(id).value) || 0; }

function processFinalCalculation() {
    if (!validateSpecificStep(4)) {
        showError("נא למלא את כל שדות החובה כדי להמשיך.");
        return;
    }
    hideError();

    const monthInput = document.getElementById('salary-month').value;
    let displayMonth = "-";
    if (monthInput) {
        const [year, month] = monthInput.split('-');
        displayMonth = `<span class="inline-flex items-center gap-1.5" dir="rtl"><span>${year}</span><span class="text-blue-400 font-bold">/</span><span>${month}</span></span>`;
    }

    document.getElementById('res-name').innerText = document.getElementById('f-name').value + " " + document.getElementById('l-name').value;
    document.getElementById('res-workplace').innerText = document.getElementById('workplace').value;
    document.getElementById('res-role').innerText = document.getElementById('role').value;
    document.getElementById('res-month').innerHTML = displayMonth;

    const grossInput = getVal('gross-salary');
    const hourly = getVal('hourly-wage');
    const travel = getVal('travel-expenses');
    const taxPts = getVal('tax-points');
    const voluntaryDeduction = getVal('voluntary-deduction');

    const vacDays = getVal('vacation-days');
    const sickDaysInput = getVal('sick-days');
    const unpaidDays = getVal('unpaid-days');

    let baseSalary = 0;
    let totalHours = 0;
    let totalDays = 0;
    let regPay = 0, ot125Pay = 0, ot150Pay = 0;
    let unpaidDeduction = 0;

    const shiftHoursVal = 10.5;
    const dailyWage = hourly > 0 ? (hourly * shiftHoursVal) : (grossInput / 22);

    if (grossInput > 0) {
        baseSalary = grossInput;
        totalHours = getVal('total-hours');
        totalDays = getVal('total-days');

        if (unpaidDays > 0) {
            unpaidDeduction = (grossInput / 22) * unpaidDays;
            baseSalary -= unpaidDeduction;
        }

        document.getElementById('res-row-regular').classList.add('hidden');
        document.getElementById('res-row-ot125').classList.add('hidden');
        document.getElementById('res-row-ot150').classList.add('hidden');
    } else {
        if (activeTab === 'regular') {
            totalHours = getVal('total-hours');
            totalDays = getVal('total-days');

            let regH = Math.min(totalDays * 8, totalHours);
            let rem = totalHours - regH;
            let ot125H = Math.min(totalDays * 2, rem);
            let ot150H = rem - ot125H;

            regPay = regH * hourly;
            ot125Pay = ot125H * hourly * 1.25;
            ot150Pay = ot150H * hourly * 1.5;
        } else {
            totalDays = tableCalcData.days;
            totalHours = tableCalcData.regular + tableCalcData.ot125 + tableCalcData.ot150;

            regPay = tableCalcData.regular * hourly;
            ot125Pay = tableCalcData.ot125 * hourly * 1.25;
            ot150Pay = tableCalcData.ot150 * hourly * 1.5;
        }

        baseSalary = regPay + ot125Pay + ot150Pay;

        if (regPay > 0) { document.getElementById('res-row-regular').classList.remove('hidden'); document.getElementById('res-base-pay').innerText = regPay.toFixed(2) + " ₪"; }
        if (ot125Pay > 0) { document.getElementById('res-row-ot125').classList.remove('hidden'); document.getElementById('res-ot125').innerText = ot125Pay.toFixed(2) + " ₪"; }
        if (ot150Pay > 0) { document.getElementById('res-row-ot150').classList.remove('hidden'); document.getElementById('res-ot150').innerText = ot150Pay.toFixed(2) + " ₪"; }
    }

    if (unpaidDeduction > 0) {
        document.getElementById('res-row-unpaid').classList.remove('hidden');
        document.getElementById('res-unpaid').innerText = unpaidDeduction.toFixed(2) + " ₪";
    } else {
        document.getElementById('res-row-unpaid').classList.add('hidden');
    }

    let vacPay = vacDays * dailyWage;
    let sickPay = 0;
    for (let i = 1; i <= sickDaysInput; i++) {
        if (i === 1) sickPay += 0;
        else if (i === 2 || i === 3) sickPay += (dailyWage * 0.5);
        else sickPay += dailyWage;
    }

    const finalGross = baseSalary + vacPay + sickPay + travel;

    let incomeTax = 0;
    let tempGross = finalGross;
    if (tempGross > 0) {
        let brackets = [{ limit: 7010, rate: 0.10 }, { limit: 10060, rate: 0.14 }, { limit: 16150, rate: 0.20 }, { limit: 22440, rate: 0.31 }, { limit: 46690, rate: 0.35 }];
        let prevLimit = 0;
        for (let b of brackets) {
            if (finalGross > prevLimit) {
                let amountInBracket = Math.min(finalGross - prevLimit, b.limit - prevLimit);
                incomeTax += amountInBracket * b.rate;
            }
            prevLimit = b.limit;
        }
        incomeTax -= (taxPts * 242);
        if (incomeTax < 0) incomeTax = 0;
    }

    let btl = 0, health = 0;
    const reducedLimit = 7522;

    if (finalGross <= reducedLimit) {
        btl = finalGross * 0.004;
        health = finalGross * 0.031;
    } else {
        btl = (reducedLimit * 0.004) + ((finalGross - reducedLimit) * 0.0287);
        health = (reducedLimit * 0.031) + ((finalGross - reducedLimit) * 0.05);
    }

    const netSalary = finalGross - incomeTax - btl - health - voluntaryDeduction;

    document.getElementById('res-gross').innerText = (grossInput > 0 ? grossInput.toFixed(2) : finalGross.toFixed(2)) + " ₪";
    document.getElementById('res-hourly').innerText = hourly.toFixed(2) + " ₪";
    document.getElementById('res-hours').innerText = totalHours.toFixed(2);
    document.getElementById('res-days').innerText = totalDays;

    document.getElementById('res-travel').innerText = travel.toFixed(2) + " ₪";
    document.getElementById('res-vacation').innerText = vacPay.toFixed(2) + " ₪";
    document.getElementById('res-sick').innerText = sickPay.toFixed(2) + " ₪";

    document.getElementById('res-tax').innerText = incomeTax.toFixed(2) + " ₪";
    document.getElementById('res-btl').innerText = btl.toFixed(2) + " ₪";
    document.getElementById('res-health').innerText = health.toFixed(2) + " ₪";

    if (voluntaryDeduction > 0) {
        document.getElementById('res-box-voluntary').classList.remove('hidden');
        document.getElementById('res-voluntary').innerText = voluntaryDeduction.toFixed(2) + " ₪";
    } else {
        document.getElementById('res-box-voluntary').classList.add('hidden');
    }

    document.getElementById('res-net').innerText = netSalary.toFixed(2) + " ₪";
    goToStep(5);
}

function clearData() {
    document.getElementById('gross-salary').value = '';
    document.getElementById('hourly-wage').value = '';
    document.getElementById('salary-month').value = '';
    document.getElementById('tax-points').value = '2.25';

    document.getElementById('total-hours').value = '';
    document.getElementById('total-days').value = '';

    document.getElementById('vacation-days').value = '0';
    document.getElementById('sick-days').value = '0';
    document.getElementById('unpaid-days').value = '0';
    document.getElementById('travel-expenses').value = '';
    document.getElementById('voluntary-deduction').value = '0';

    const tbody = document.getElementById("hours-table").getElementsByTagName('tbody')[0];
    tbody.innerHTML = `
                <tr class="border-b border-slate-100 hover:bg-slate-50">
                    <td class="p-2"><input type="time" class="time-in w-full bg-slate-100 border-none rounded p-2 text-center focus:bg-white focus:ring-1 focus:ring-teal-400 outline-none" value="08:00" onchange="calculateTableHours()"></td>
                    <td class="p-2"><input type="time" class="time-out w-full bg-slate-100 border-none rounded p-2 text-center focus:bg-white focus:ring-1 focus:ring-teal-400 outline-none" value="17:00" onchange="calculateTableHours()"></td>
                    <td class="p-2 font-bold text-slate-800 row-total">0.00</td>
                    <td class="p-2 font-bold text-green-600 row-100">0.00</td>
                    <td class="p-2 font-bold text-yellow-500 row-125">0.00</td>
                    <td class="p-2 font-bold text-red-500 row-150">0.00</td>
                    <td class="p-2"><button onclick="removeRow(this)" class="text-slate-400 hover:text-red-600 font-bold text-lg">&times;</button></td>
                </tr>`;
    calculateTableHours();

    hideError();
    document.querySelectorAll('input').forEach(i => i.classList.remove('border-red-500', 'bg-red-50'));
    attemptGoToStep(2);
}

// Extremely robust smart printing with Highly Compact CSS
function printPayslip() {
    const toast = document.getElementById('toast-msg');
    const toastText = document.getElementById('toast-text');
    const toastIcon = document.getElementById('toast-icon');

    const isIframe = (window.self !== window.top);

    if (isIframe) {
        toastIcon.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                `;
        toastText.innerHTML = `
                    <div class="flex flex-col gap-1">
                        <span class="font-extrabold text-amber-400">המערכת פועלת בתצוגה מקדימה!</span>
                        <span class="text-xs text-slate-300">אנו מנסים לפתוח חלון הדפסה נקי. אם החלון נחסם על ידי הדפדפן, אנא הפעל את האפליקציה ישירות דרך הקישור ב-GitHub Pages.</span>
                    </div>
                `;
        toast.className = "fixed bottom-6 right-6 bg-slate-900 border border-slate-700 text-white p-5 rounded-2xl shadow-2xl transform transition-all duration-500 z-50 max-w-md translate-y-0 opacity-100";
    } else {
        toastIcon.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                `;
        toastText.innerHTML = `
                    <div class="flex flex-col gap-1">
                        <span class="font-extrabold text-emerald-400">מכין את התלוש להדפסה...</span>
                        <span class="text-xs text-slate-300">חלון ההדפסה ייפתח כעת באופן אוטומטי.</span>
                    </div>
                `;
        toast.className = "fixed bottom-6 right-6 bg-slate-900 border border-slate-700 text-white p-5 rounded-2xl shadow-2xl transform transition-all duration-500 z-50 max-w-md translate-y-0 opacity-100";
    }

    setTimeout(() => {
        toast.className = "fixed bottom-6 right-6 bg-slate-900 border border-slate-700 text-white p-5 rounded-2xl shadow-2xl transform transition-all duration-500 z-50 max-w-md translate-y-32 opacity-0";
    }, 6000);

    const printContent = document.getElementById('step-result').cloneNode(true);
    const noPrintElements = printContent.querySelectorAll('.no-print');
    noPrintElements.forEach(el => el.remove());

    try {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                        <html lang="he" dir="rtl">
                        <head>
                            <title>תלוש שכר - ${document.getElementById('res-name').innerText}</title>
                            <script src="https://cdn.tailwindcss.com"><\/script>
                            <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;800;900&display=swap" rel="stylesheet">
                            <style>
                                body { font-family: 'Heebo', sans-serif; background-color: white; padding: 15px; }
                                .payslip-scroll { max-height: none !important; overflow: visible !important; border: none !important; }
                            </style>
                        </head>
                        <body>
                            <div class="max-w-3xl mx-auto">
                                ${printContent.innerHTML}
                            </div>
                            <script>
                                window.onload = function() {
                                    window.focus();
                                    window.print();
                                    setTimeout(function() { window.close(); }, 500);
                                };
                            <\/script>
                        </body>
                        </html>
                    `);
            printWindow.document.close();
        } else {
            window.print();
        }
    } catch (e) {
        window.print();
    }
}
