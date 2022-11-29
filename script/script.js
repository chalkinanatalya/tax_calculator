//for every currency
const formatCurrency = (n) => (
    new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 2,
    }).format(n)
);

const navigationLinks = document.querySelectorAll('.navigation__link');
const calcElems = document.querySelectorAll('.calc');

for(let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener('click', (e) => {
        e.preventDefault();
        for(let j = 0; j < calcElems.length; j++) {
            if(navigationLinks[i].dataset.tax === calcElems[j].dataset.tax) {
            calcElems[j].classList.add('calc_active');
            navigationLinks[i].classList.add('navigation__link_active')
            } else {
                calcElems[j].classList.remove('calc_active');
                navigationLinks[j].classList.remove('navigation__link_active')
            }
        }
    });
}
//ausn
const ausn = document.querySelector('.ausn');
const formAusn = ausn.querySelector('.calc__form');
const resultTaxTotal = ausn.querySelector('.result__tax_total');
const calcLabelExpenses = ausn.querySelector('.calc__label_expenses');

calcLabelExpenses.style.display = 'none';

formAusn.addEventListener('input', () => {
    if(formAusn.type.value === 'income') {
        calcLabelExpenses.style.display = 'none';
        resultTaxTotal.textContent = formatCurrency(formAusn.income.value * 0.08);
        formAusn.expenses.value = '';
    } 

    if(formAusn.type.value === 'expenses') {
        calcLabelExpenses.style.display = '';
        resultTaxTotal.textContent = formatCurrency((formAusn.income.value - formAusn.expenses.value) * 0.2);
    }
});

//self-employed
const selfEmployment = document.querySelector('.self-employment');
const formSelfEmployment = selfEmployment.querySelector('.calc__form');
const resultTaxSelfEmployment = selfEmployment.querySelector('.result__tax');
const calcCompensation = selfEmployment.querySelector('.calc__label_compensation');
const resultBlockCompensation = selfEmployment.querySelectorAll('.result__block_compensation');
const resultTaxCompensation = selfEmployment.querySelector('.result__tax_compensation');
const resultTaxRestCompensation = selfEmployment.querySelector('.result__tax_rest-compensation');
const resultTaxResult = selfEmployment.querySelector('.result__tax_result');

const checkCompensation = () => {
    const setDisplay = formSelfEmployment.addCompensation.checked ? '' : 'none'
    calcCompensation.style.display = setDisplay;

    resultBlockCompensation.forEach(elem => {
        elem.style.display = setDisplay;
    })
}
checkCompensation();

formSelfEmployment.addEventListener('input', () => {
    const resIndividual = formSelfEmployment.induvidual.value * 0.04;
    const resEntity = formSelfEmployment.entity.value * 0.06;

    checkCompensation();

    const tax = resIndividual + resEntity;
    formSelfEmployment.compensation.value = formSelfEmployment.compensation.value > 10_000 ? 10_000 : formSelfEmployment.compensation.value;

    const benefit = formSelfEmployment.compensation.value;
    const resBenefit = formSelfEmployment.induvidual.value * 0.01 + formSelfEmployment.induvidual.value * 0.02;
    const finalBenefit = benefit - resBenefit > 0 ? benefit - resBenefit : 0;
    const finalTax = tax - (benefit - finalBenefit);

    resultTaxSelfEmployment.textContent = formatCurrency(tax);
    resultTaxCompensation.textContent = formatCurrency(benefit - finalBenefit);
    resultTaxRestCompensation.textContent = formatCurrency(finalBenefit);
    resultTaxResult.textContent = formatCurrency(finalTax);
});

//osno

const osno = document.querySelector('.osno');
const formOsno = osno.querySelector('.calc__form');

const profit = osno.querySelector('.result__block_profit');
const ndflExpenses = osno.querySelector('.result__block_ndfl-expenses');
const ndflIncome = osno.querySelector('.result__block_ndfl-income');
const resultTaxNds = osno.querySelector('.result__tax_nds');
const resultTaxProperty = osno.querySelector('.result__tax_property');
const resultTaxNdflExpenses = osno.querySelector('.result__tax_ndfl-expenses');
const resultTaxNdflIncome = osno.querySelector('.result__tax_ndfl-income');
const resultTaxProfit = osno.querySelector('.result__tax_profit');

const checkFormBusiness = () => {
    if(formOsno.formBusiness.value === 'ip') {
        profit.style.display = 'none';
        ndflExpenses.style.display = '';
        ndflIncome.style.display = '';
    }

    if(formOsno.formBusiness.value === 'ooo') {
        profit.style.display = '';
        ndflExpenses.style.display = 'none';
        ndflIncome.style.display = 'none';
    }
};

checkFormBusiness();

formOsno.addEventListener('input', () => {
    checkFormBusiness();

    const income = formOsno.income.value;
    const expenses = formOsno.expenses.value;
    const property = formOsno.property.value;

    const nds = income * 0.2;
    const taxProperty = property * 0.02;
    const profit = income - expenses;
    const ndflExpensesTotal = profit * 0.13;
    const ndflIncomeTotal = (income - nds) * 0.13;
    const taxProfit = profit * 0.2

    resultTaxNds.textContent = formatCurrency(nds);
    resultTaxProperty.textContent = formatCurrency(taxProperty);
    resultTaxNdflExpenses.textContent = formatCurrency(ndflExpensesTotal);
    resultTaxNdflIncome.textContent = formatCurrency(ndflIncomeTotal);
    resultTaxProfit.textContent = formatCurrency(taxProfit);
});