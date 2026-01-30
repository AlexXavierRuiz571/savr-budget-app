import { clamp, formatCurrency, formatPercent, safeDivide } from "./budgetMath.js";

const formatMoney = (number) => `$${formatCurrency(number)}`;

export const getInsight = ({ totals, percents }) => {
  const income = totals?.income ?? 0;
  const remaining = totals?.remaining ?? 0;

  if (!totals || !Number.isFinite(income) || !Number.isFinite(remaining)) {
    return { text: "Missing data by $0 in Income.", category: "income", value: 0 };
  }

  if (income <= 0) {
    return { text: "Zero income by $0 in Income.", category: "income", value: 0 };
  }

  // Always prioritize overall budget state first so Insight does not duplicate the percent list.
  if (remaining < 0) {
    const deficit = Math.abs(remaining);
    return {
      text: `Overspent by ${formatMoney(deficit)} in total budget.`,
      category: "total",
      value: -deficit,
    };
  }

  const remainingRatio = safeDivide(remaining, income);

  if (remainingRatio <= 0.05) {
    return {
      text: `Tight budget with only ${formatMoney(remaining)} remaining.`,
      category: "total",
      value: remaining,
    };
  }

  if (remainingRatio <= 0.1) {
    return {
      text: `Low buffer with ${formatMoney(remaining)} remaining.`,
      category: "total",
      value: remaining,
    };
  }

  // After budget-state insights, use money-based category insights (not restating the percent list).
  const debtPercent = clamp(percents?.debt ?? 0, 0, 9);
  if (debtPercent >= 0.3) {
    return {
      text: `Debt is ${formatMoney(totals.debt)} this month, which is ${formatPercent(debtPercent)}% of Income.`,
      category: "debt",
      value: totals.debt,
    };
  }

  const savingsPercent = clamp(percents?.savings ?? 0, 0, 9);
  if (savingsPercent > 0 && savingsPercent < 0.1) {
    return {
      text: `Savings is only ${formatMoney(totals.savings)} this month. That is ${formatPercent(savingsPercent)}% of Income.`,
      category: "savings",
      value: totals.savings,
    };
  }

  const expensesPercent = clamp(percents?.expenses ?? 0, 0, 9);
  if (expensesPercent >= 0.5) {
    return {
      text: `Expenses are ${formatMoney(totals.expenses)} this month, leaving ${formatMoney(remaining)} remaining.`,
      category: "expenses",
      value: totals.expenses,
    };
  }

  const lifestylePercent = clamp(percents?.lifestyle ?? 0, 0, 9);
  if (lifestylePercent >= 0.25) {
    return {
      text: `Lifestyle is ${formatMoney(totals.lifestyle)} this month. You still have ${formatMoney(remaining)} remaining.`,
      category: "lifestyle",
      value: totals.lifestyle,
    };
  }

  return {
    text: `Balanced with ${formatMoney(remaining)} remaining.`,
    category: "total",
    value: remaining,
  };
};
