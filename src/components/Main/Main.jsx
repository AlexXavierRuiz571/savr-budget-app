import { useState } from "react";
import { Link } from "react-router-dom";
import "./Main.css";
import arrowCircle from "../../assets/images/arrow-circle.svg";
import detailsIcon from "../../assets/images/details-icon.svg";
import settingIcon from "../../assets/images/setting-icon.svg";

function Main() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <section className="main">
      <div className="main__summary">
        <div className="main__summary-bar">
          <p className="main__summary-text">
            How much is remaining in the month
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
            <div className="main__chart" />

            <div className="main__chart-explanation">
              <p className="main__chart-line">
                <span className="main__chart-highlight main__chart-highlight_expenses">
                  Expenses:
                </span>{" "}
                __% of total income
              </p>

              <p className="main__chart-line">
                <span className="main__chart-highlight main__chart-highlight_savings">
                  Savings:
                </span>{" "}
                __% of total income
              </p>

              <p className="main__chart-line">
                <span className="main__chart-highlight main__chart-highlight_debt">
                  Debt:
                </span>{" "}
                __% of total income
              </p>

              <p className="main__chart-line">
                <span className="main__chart-highlight main__chart-highlight_lifestyle">
                  Lifestyle:
                </span>{" "}
                __% of total income
              </p>
            </div>

            <div className="main__insights">
              <p className="main__insight-label">Insight:</p>
              <p className="main__insight-text">
                [status] by [value] in [category].
              </p>

              <p className="main__suggestion-label">Suggestion:</p>
              <p className="main__suggestion-text">
                Placeholder sentence based on budget. If it&apos;s over 10%,
                within, or under.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="main__cards">
        <div className="main__card main__card_type_income">
          <div className="main__card-header">
            <h3 className="main__card-title main__card-title_type_income">
              Income
            </h3>
            <div className="main__card-accent main__card-accent_type_income" />
          </div>

          <div className="main__card-body">
            <p className="main__card-amount">$0</p>
            <p className="main__card-text">monthly</p>
          </div>

          <Link className="main__card-action main__card-action_link" to="/income">
            <img
              className="main__card-action-icon"
              src={detailsIcon}
              alt=""
              aria-hidden="true"
            />
            <span className="main__card-action-text">View Details</span>
          </Link>
        </div>

        <div className="main__card main__card_type_expenses">
          <div className="main__card-header">
            <h3 className="main__card-title main__card-title_type_expenses">
              Expenses
            </h3>
            <div className="main__card-accent main__card-accent_type_expenses" />
          </div>

          <div className="main__card-body">
            <p className="main__card-amount">$0</p>
            <p className="main__card-text">this month</p>
          </div>

          <button className="main__card-action" type="button">
            <img
              className="main__card-action-icon"
              src={detailsIcon}
              alt=""
              aria-hidden="true"
            />
            <span className="main__card-action-text">View Details</span>
          </button>
        </div>

        <div className="main__card main__card_type_savings">
          <div className="main__card-header">
            <h3 className="main__card-title main__card-title_type_savings">
              Savings
            </h3>
            <div className="main__card-accent main__card-accent_type_savings" />
          </div>

          <div className="main__card-body">
            <p className="main__card-amount">$0</p>
            <p className="main__card-text">this month</p>
          </div>

          <button className="main__card-action" type="button">
            <img
              className="main__card-action-icon"
              src={detailsIcon}
              alt=""
              aria-hidden="true"
            />
            <span className="main__card-action-text">View Details</span>
          </button>
        </div>

        <div className="main__card main__card_type_debt">
          <div className="main__card-header">
            <h3 className="main__card-title main__card-title_type_debt">
              Debt
            </h3>
            <div className="main__card-accent main__card-accent_type_debt" />
          </div>

          <div className="main__card-body">
            <p className="main__card-amount">$0</p>
            <p className="main__card-text">this month</p>
          </div>

          <button className="main__card-action" type="button">
            <img
              className="main__card-action-icon"
              src={detailsIcon}
              alt=""
              aria-hidden="true"
            />
            <span className="main__card-action-text">View Details</span>
          </button>
        </div>

        <div className="main__card main__card_type_lifestyle">
          <div className="main__card-header">
            <h3 className="main__card-title main__card-title_type_lifestyle">
              Lifestyle
            </h3>
            <div className="main__card-accent main__card-accent_type_lifestyle" />
          </div>

          <div className="main__card-body">
            <p className="main__card-amount">$0</p>
            <p className="main__card-text">this month</p>
          </div>

          <button className="main__card-action" type="button">
            <img
              className="main__card-action-icon"
              src={detailsIcon}
              alt=""
              aria-hidden="true"
            />
            <span className="main__card-action-text">View Details</span>
          </button>
        </div>

        <div className="main__card main__card_type_info">
          <div className="main__card-header">
            <h3 className="main__card-title main__card-title_type_info">
              Info Hub
            </h3>
            <div className="main__card-accent main__card-accent_type_info" />
          </div>

          <div className="main__card-body main__card-body_type_info">
            <p className="main__card-info-text">Overview & Reference</p>
          </div>

          <button className="main__card-action" type="button">
            <img
              className="main__card-action-icon"
              src={settingIcon}
              alt=""
              aria-hidden="true"
            />
            <span className="main__card-action-text">View Details</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Main;
