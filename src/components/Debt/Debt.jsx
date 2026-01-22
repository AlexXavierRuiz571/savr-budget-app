import "./Debt.css";
import DebtHeader from "./DebtHeader.jsx";
import SecondaryNav from "../SecondaryNav/SecondaryNav.jsx";
import addIcon from "../../assets/icons/add-icon.svg";

function Debt() {
  return (
    <section className="debt">
      <div className="debt__container">
        <DebtHeader />
        <SecondaryNav active="debt" />

        <div className="debt__content">
          <div className="debt__summary">
            <h2 className="debt__summary-title">Total Monthly Debt:</h2>

            <div className="debt__summary-row">
              <span className="debt__summary-currency">$</span>
              <div className="debt__summary-line" />
            </div>
          </div>

          <div className="debt__bar">
            <span className="debt__bar-text">Add Debt</span>

            <button
              className="debt__bar-action"
              type="button"
              aria-label="Add Debt"
            >
              <img
                className="debt__bar-icon"
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

export default Debt;
