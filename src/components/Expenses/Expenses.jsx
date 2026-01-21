import "./Expenses.css";
import ExpensesHeader from "./ExpensesHeader";
import SecondaryNav from "../SecondaryNav/SecondaryNav.jsx";

function Expenses() {
  return (
    <section className="expenses">
      <div className="expenses__container">
        <ExpensesHeader />
        <SecondaryNav active="expenses" />

        <div className="expenses__content">
          Expenses page content placeholder
        </div>
      </div>
    </section>
  );
}

export default Expenses;
