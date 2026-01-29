import { formatCurrency, safeDivide } from "./budgetMath.js";

const formatMoney = (number) => `$${formatCurrency(number)}`;

export const getSuggestion = ({ totals, percents }) => {
  const income = totals?.income ?? 0;
  const remaining = totals?.remaining ?? 0;

  if (!totals || !Number.isFinite(income) || !Number.isFinite(remaining)) {
    return null;
  }

  if (income <= 0) {
    return "Add at least one Income source first. Once Income is saved, SAVR can calculate totals and provide guidance.";
  }

  if (remaining < 0) {
    return "You are over budget this month. Reduce Expenses or Lifestyle, or increase Income, until you are back above zero.";
  }

  const remainingRatio = safeDivide(remaining, income);

  if (remainingRatio <= 0.05) {
    return "Your budget is extremely tight. Pause new spending and stabilize your largest category first.";
  }

  if (remainingRatio <= 0.1) {
    return "You are close to your monthly limit. Trim one category down before adding anything new.";
  }

  if ((percents?.debt ?? 0) >= 0.3) {
    return "Debt is consuming a large share of your Income. Focus on the highest-interest balance to reduce long-term pressure.";
  }

  if ((percents?.debt ?? 0) > 0.15 && (percents?.debt ?? 0) < 0.3) {
    return "Debt is manageable but noticeable. Small extra payments can shorten payoff time without stressing your budget.";
  }

  if ((percents?.savings ?? 0) > 0 && (percents?.savings ?? 0) < 0.05) {
    return "Savings is very low. Even a small amount put aside regularly can help build consistency.";
  }

  if ((percents?.savings ?? 0) >= 0.05 && (percents?.savings ?? 0) < 0.1) {
    return "Savings could be stronger. Increasing it slightly can improve long-term stability.";
  }

  if ((percents?.expenses ?? 0) >= 0.5) {
    return "Expenses are heavy this month. Review your largest fixed costs before cutting smaller items.";
  }

  if ((percents?.expenses ?? 0) >= 0.4 && (percents?.expenses ?? 0) < 0.5) {
    return "Expenses are starting to take up more room. Keeping them stable now can prevent future strain.";
  }

  if ((percents?.lifestyle ?? 0) >= 0.25) {
    return "Lifestyle spending is high relative to Income. Reducing one Lifestyle choice can protect your overall budget.";
  }

  if (remainingRatio >= 0.2) {
    return "You have a strong buffer this month. Consider directing extra funds toward Savings, Debt reduction, or future goals.";
  }

  if (remaining > 0) {
    return `You have ${formatMoney(
      remaining,
    )} left this month. Assigning it now gives you more control over where your money actually goes.`;
  }

  return null;
};
