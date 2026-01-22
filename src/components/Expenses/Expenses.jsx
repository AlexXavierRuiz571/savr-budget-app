import "./Expenses.css";
import ExpensesHeader from "./ExpensesHeader";
import SecondaryNav from "../SecondaryNav/SecondaryNav.jsx";
import addIcon from "../../assets/icons/add-icon.svg";

function Expenses() {
  return (
    <section className="expenses">
      <div className="expenses__container">
        <ExpensesHeader />
        <SecondaryNav active="expenses" />

        <div className="expenses__content">
          <div className="expenses__summary">
            <h2 className="expenses__summary-title">Total Monthly Expenses:</h2>

            <div className="expenses__summary-row">
              <span className="expenses__summary-currency">$</span>
              <div className="expenses__summary-line" />
            </div>
          </div>

          <div className="expenses__bar">
            <span className="expenses__bar-text">Add Expenses</span>

            <button
              className="expenses__bar-action"
              type="button"
              aria-label="Add Expenses"
            >
              <img
                className="expenses__bar-icon"
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

export default Expenses;
