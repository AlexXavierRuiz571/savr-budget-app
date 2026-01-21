import "./debt.css";
import SavingsHeader from "../Debt/DebtHeader.jsx";
import SecondaryNav from "../SecondaryNav/SecondaryNav.jsx";

function Debt() {
  return (
    <section className="debt">
      <div className="debt__container">
        <SavingsHeader />
        <SecondaryNav active="debt" />

        <div className="debt__content">
          Debt page content placeholder
        </div>
      </div>
    </section>
  );
}

export default Debt;
