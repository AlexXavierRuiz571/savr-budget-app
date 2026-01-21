import "./savings.css";
import SavingsHeader from "../Savings/SavingsHeader.jsx";
import SecondaryNav from "../SecondaryNav/SecondaryNav.jsx";

function Savings() {
  return (
    <section className="savings">
      <div className="savings__container">
        <SavingsHeader />
        <SecondaryNav active="savings" />

        <div className="savings__content">
          Savings page content placeholder
        </div>
      </div>
    </section>
  );
}

export default Savings;
