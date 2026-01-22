import "./savings.css";
import SavingsHeader from "../Savings/SavingsHeader.jsx";
import SecondaryNav from "../SecondaryNav/SecondaryNav.jsx";
import addIcon from "../../assets/icons/add-icon.svg";

function Savings() {
  return (
    <section className="savings">
      <div className="savings__container">
        <SavingsHeader />
        <SecondaryNav active="savings" />

        <div className="savings__content">
          <div className="savings__summary">
            <h2 className="savings__summary-title">Total Monthly Savings:</h2>

            <div className="savings__summary-row">
              <span className="savings__summary-currency">$</span>
              <div className="savings__summary-line" />
            </div>
          </div>

          <div className="savings__bar">
            <span className="savings__bar-text">Add Savings</span>

            <button
              className="savings__bar-action"
              type="button"
              aria-label="Add Savings"
            >
              <img
                className="savings__bar-icon"
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

export default Savings;
