import "./Income.css";
import IncomeHeader from "./IncomeHeader";
import addIcon from "../../assets/icons/add-icon.svg";

function Income() {
  return (
    <section className="income">
      <div className="income__container">
        <IncomeHeader />

        <div className="income__content">
          <div className="income__summary">
            <h2 className="income__summary-title">Total Monthly Income:</h2>

            <div className="income__summary-row">
              <span className="income__summary-currency">$</span>
              <div className="income__summary-line" />
            </div>
          </div>

          <div className="income__bar" type="button">
            <span className="income__bar-text">Add Income</span>

            <button
              className="income__bar-action"
              type="button"
              aria-label="Add Income"
            >
              <img
                className="income__bar-icon"
                src={addIcon}
                alt=""
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Income;
