const toNumber = (value) => {
  const number = Number(value);
  return Number.isNaN(number) ? 0 : number;
};

const pickMonthly = (entry) => {
  if (!entry) return 0;

  if (entry.monthlyTotal !== undefined) return toNumber(entry.monthlyTotal);
  if (entry.monthlyAmount !== undefined) return toNumber(entry.monthlyAmount);
  if (entry.amount !== undefined) return toNumber(entry.amount);

  return 0;
};

export const sumMonthly = (entries) => {
  if (!Array.isArray(entries)) return 0;
  return entries.reduce((sum, entry) => sum + pickMonthly(entry), 0);
};

export const clamp = (number, min, max) => Math.min(Math.max(number, min), max);

export const safeDivide = (numerator, denominator) => {
  const safeDenominator = toNumber(denominator);
  if (safeDenominator <= 0) return 0;
  return toNumber(numerator) / safeDenominator;
};

export const formatCurrency = (amount) => {
  const number = toNumber(amount);
  return number.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

export const formatPercent = (ratio) => {
  const percent = clamp(toNumber(ratio) * 100, 0, 999);
  return percent.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const getBudgetTotals = ({
  incomeEntries = [],
  expenseEntries = [],
  savingsEntries = [],
  debtEntries = [],
  lifestyleEntries = [],
} = {}) => {
  const income = sumMonthly(incomeEntries);
  const expenses = sumMonthly(expenseEntries);
  const savings = sumMonthly(savingsEntries);
  const debt = sumMonthly(debtEntries);
  const lifestyle = sumMonthly(lifestyleEntries);

  const outflow = expenses + savings + debt + lifestyle;
  const remaining = income - outflow;

  return {
    income,
    expenses,
    savings,
    debt,
    lifestyle,
    outflow,
    remaining,
  };
};

export const getCategoryPercents = (totals) => {
  const income = toNumber(totals?.income);

  return {
    expenses: safeDivide(totals?.expenses, income),
    savings: safeDivide(totals?.savings, income),
    debt: safeDivide(totals?.debt, income),
    lifestyle: safeDivide(totals?.lifestyle, income),
  };
};

export const getRemainingState = (totals) => {
  const income = toNumber(totals?.income);
  const remaining = toNumber(totals?.remaining);

  if (income <= 0) return "zero_income";
  if (!Number.isFinite(remaining)) return "missing_data";
  if (remaining < 0) return "overspent";

  const remainingRatio = safeDivide(remaining, income);

  if (remainingRatio <= 0.05) return "tight_red";
  if (remainingRatio <= 0.1) return "tight_yellow";

  return "balanced";
};
