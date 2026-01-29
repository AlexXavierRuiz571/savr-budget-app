import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MainHeader from "./MainHeader.jsx";
import "./Main.css";
import arrowCircle from "../../assets/Icons/arrow-circle.svg";
import detailsIcon from "../../assets/Icons/details-icon.svg";
import settingIcon from "../../assets/Icons/setting-icon.svg";
import useProfileGroups from "../../utils/useProfileGroups.js";
import { getBudgetTotals, getCategoryPercents } from "../../utils/budgetMath.js";
import { getInsight } from "../../utils/insightRules.js";
import { getSuggestion } from "../../utils/suggestionRules.js";

function Main() {
  const [isExpanded, setIsExpanded] = useState(false);

  const incomeEntries = useProfileGroups("income");
  const expenseEntries = useProfileGroups("expenses");
  const savingsEntries = useProfileGroups("savings");
  const debtEntries = useProfileGroups("debt");
  const lifestyleEntries = useProfileGroups("lifestyle");

  const totals = useMemo(() => {
    return getBudgetTotals({
      incomeEntries,
      expenseEntries,
      savingsEntries,
      debtEntries,
      lifestyleEntries,
    });
  }, [incomeEntries, expenseEntries, savingsEntries, debtEntries, lifestyleEntries]);

  const percents = useMemo(() => getCategoryPercents(totals), [totals]);

  const insight = useMemo(() => getInsight({ totals, percents }), [totals, percents]);
  const suggestion = useMemo(
    () => getSuggestion({ totals, percents }),
    [totals, percents],
  );

  const formatCurrency = (amount) => {
    const number = Number(amount);
    if (Number.isNaN(number)) return "0";
    return number.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const formatPercent = (ratio) => {
    const number = Number(ratio);
    if (Number.isNaN(number) || number <= 0) return "__";
    const percent = number * 100;
    return percent.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const handleExpanded = () => {
    setIsExpanded((previous) => !previous);
  };

  const summaryStatus = useMemo(() => {
    if (totals.income <= 0) return "neutral";
    if (totals.remaining <= 0) return "red";
    if (totals.remaining / totals.income <= 0.1) return "yellow";
    return "green";
  }, [totals]);

  const summaryText = useMemo(() => {
    if (totals.income <= 0) return "How much is remaining in the month";

    if (totals.remaining < 0) {
      return `-$${formatCurrency(Math.abs(totals.remaining))} overspent this month`;
    }

    return `$${formatCurrency(totals.remaining)} remaining this month`;
  }, [totals]);

  const incomeCardAmount = `$${formatCurrency(totals.income)}`;
  const expensesCardAmount = `$${formatCurrency(totals.expenses)}`;
  const savingsCardAmount = `$${formatCurrency(totals.savings)}`;
  const debtCardAmount = `$${formatCurrency(totals.debt)}`;
  const lifestyleCardAmount = `$${formatCurrency(totals.lifestyle)}`;

  const expensesPercentText =
    totals.income > 0 ? `${formatPercent(percents.expenses)}%` : "__%";
  const savingsPercentText =
    totals.income > 0 ? `${formatPercent(percents.savings)}%` : "__%";
  const debtPercentText =
    totals.income > 0 ? `${formatPercent(percents.debt)}%` : "__%";
  const lifestylePercentText =
    totals.income > 0 ? `${formatPercent(percents.lifestyle)}%` : "__%";

  const chartBackground = useMemo(() => {
    if (totals.income <= 0) return "#4b4b4b";

    const expensesEnd = percents.expenses * 100;
    const savingsEnd = (percents.expenses + percents.savings) * 100;
    const debtEnd = (percents.expenses + percents.savings + percents.debt) * 100;

    return `conic-gradient(
      #00b3d3 0% ${expensesEnd}%,
      #00632d ${expensesEnd}% ${savingsEnd}%,
      #574084 ${savingsEnd}% ${debtEnd}%,
      #c9a43e ${debtEnd}% 100%
    )`;
  }, [totals.income, percents.expenses, percents.savings, percents.debt]);

  const suggestionText = typeof suggestion === "string" ? suggestion : suggestion?.text || "";
  const insightText = insight?.text || "";

  return (
    <section className="main">
      <MainHeader />

      <div className="main__summary">
        <div className="main__summary-bar">
          <p className={`main__summary-text main__summary-text_${summaryStatus}`}>
            {summaryText}
          </p>

          <button
            className="main__summary-toggle"
            type="button"
            onClick={handleExpanded}
            aria-expanded={isExpanded}
            aria-controls="main__breakdown"
          >
            <img
              className={`main__summary-icon ${isExpanded ? "main__summary-icon_open" : ""}`}
              src={arrowCircle}
              alt=""
              aria-hidden="true"
            />
          </button>
        </div>

        <div
          className={`main__breakdown ${isExpanded ? "main__breakdown_open" : ""}`}
          id="main__breakdown"
        >
          <div className="main__breakdown-inner">
            <div className="main__chart" style={{ background: chartBackground }} />

            <div className="main__chart-explanation">
              <p className="main__chart-line">
                <span className="main__chart-highlight main__chart-highlight_expenses">
                  Expenses:
                </span>{" "}
                {expensesPercentText} of total income
              </p>

              <p className="main__chart-line">
                <span className="main__chart-highlight main__chart-highlight_savings">
                  Savings:
                </span>{" "}
                {savingsPercentText} of total income
              </p>

              <p className="main__chart-line">
                <span className="main__chart-highlight main__chart-highlight_debt">
                  Debt:
                </span>{" "}
                {debtPercentText} of total income
              </p>

              <p className="main__chart-line">
                <span className="main__chart-highlight main__chart-highlight_lifestyle">
                  Lifestyle:
                </span>{" "}
                {lifestylePercentText} of total income
              </p>
            </div>

            <div className="main__insights">
              {suggestionText ? (
                <>
                  <p className="main__suggestion-label">Suggestion:</p>
                  <p className="main__suggestion-text">{suggestionText}</p>
                </>
              ) : insightText ? (
                <>
                  <p className="main__insight-label">Insight:</p>
                  <p className="main__insight-text">{insightText}</p>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="main__cards">
        <div className="main__card main__card_type_income">
          <div className="main__card-header">
            <h3 className="main__card-title main__card-title_type_income">Income</h3>
            <div className="main__card-accent main__card-accent_type_income" />
          </div>

          <div className="main__card-body">
            <p className="main__card-amount">{incomeCardAmount}</p>
            <p className="main__card-text">monthly</p>
          </div>

          <Link className="main__card-action main__card-action_link" to="/income">
            <img className="main__card-action-icon" src={detailsIcon} alt="" aria-hidden="true" />
            <span className="main__card-action-text">View Details</span>
          </Link>
        </div>

        <div className="main__card main__card_type_expenses">
          <div className="main__card-header">
            <h3 className="main__card-title main__card-title_type_expenses">Expenses</h3>
            <div className="main__card-accent main__card-accent_type_expenses" />
          </div>

          <div className="main__card-body">
            <p className="main__card-amount">{expensesCardAmount}</p>
            <p className="main__card-text">this month</p>
          </div>

          <Link className="main__card-action main__card-action_link" to="/expenses">
            <img className="main__card-action-icon" src={detailsIcon} alt="" aria-hidden="true" />
            <span className="main__card-action-text">View Details</span>
          </Link>
        </div>

        <div className="main__card main__card_type_savings">
          <div className="main__card-header">
            <h3 className="main__card-title main__card-title_type_savings">Savings</h3>
            <div className="main__card-accent main__card-accent_type_savings" />
          </div>

          <div className="main__card-body">
            <p className="main__card-amount">{savingsCardAmount}</p>
            <p className="main__card-text">this month</p>
          </div>

          <Link className="main__card-action main__card-action_link" to="/savings">
            <img className="main__card-action-icon" src={detailsIcon} alt="" aria-hidden="true" />
            <span className="main__card-action-text">View Details</span>
          </Link>
        </div>

        <div className="main__card main__card_type_debt">
          <div className="main__card-header">
            <h3 className="main__card-title main__card-title_type_debt">Debt</h3>
            <div className="main__card-accent main__card-accent_type_debt" />
          </div>

          <div className="main__card-body">
            <p className="main__card-amount">{debtCardAmount}</p>
            <p className="main__card-text">this month</p>
          </div>

          <Link className="main__card-action main__card-action_link" to="/debt">
            <img className="main__card-action-icon" src={detailsIcon} alt="" aria-hidden="true" />
            <span className="main__card-action-text">View Details</span>
          </Link>
        </div>

        <div className="main__card main__card_type_lifestyle">
          <div className="main__card-header">
            <h3 className="main__card-title main__card-title_type_lifestyle">Lifestyle</h3>
            <div className="main__card-accent main__card-accent_type_lifestyle" />
          </div>

          <div className="main__card-body">
            <p className="main__card-amount">{lifestyleCardAmount}</p>
            <p className="main__card-text">this month</p>
          </div>

          <Link className="main__card-action main__card-action_link" to="/lifestyle">
            <img className="main__card-action-icon" src={detailsIcon} alt="" aria-hidden="true" />
            <span className="main__card-action-text">View Details</span>
          </Link>
        </div>

        <div className="main__card main__card_type_info">
          <div className="main__card-header">
            <h3 className="main__card-title main__card-title_type_info">Info Hub</h3>
            <div className="main__card-accent main__card-accent_type_info" />
          </div>

          <div className="main__card-body main__card-body_type_info">
            <p className="main__card-info-text">Overview & Reference</p>
          </div>

          <Link className="main__card-action main__card-action_link" to="/info">
            <img className="main__card-action-icon" src={settingIcon} alt="" aria-hidden="true" />
            <span className="main__card-action-text">View Details</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Main;
