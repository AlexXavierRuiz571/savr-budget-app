import "./lifestyle.css";
import LifestyleHeader from "./LifestyleHeader.jsx";
import SecondaryNav from "../SecondaryNav/SecondaryNav.jsx";
import addIcon from "../../assets/icons/add-icon.svg";

function Lifestyle() {
  return (
    <section className="lifestyle">
      <div className="lifestyle__container">
        <LifestyleHeader />
        <SecondaryNav active="lifestyle" />

        <div className="lifestyle__content">
          <div className="lifestyle__summary">
            <h2 className="lifestyle__summary-title">
              Total Monthly Lifestyle Costs:
            </h2>

            <div className="lifestyle__summary-row">
              <span className="lifestyle__summary-currency">$</span>
              <div className="lifestyle__summary-line" />
            </div>
          </div>

          <div className="lifestyle__bar">
            <span className="lifestyle__bar-text">Add Lifestyle Entry</span>

            <button
              className="lifestyle__bar-action"
              type="button"
              aria-label="Add Lifestyle"
            >
              <img
                className="lifestyle__bar-icon"
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

export default Lifestyle;
