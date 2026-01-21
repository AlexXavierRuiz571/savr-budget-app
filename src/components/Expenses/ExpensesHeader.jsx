import { Link } from "react-router-dom";
import "./ExpensesHeader.css";

function ExpensesHeader() {
  return (
    <header className="expenses-header">
      <div className="expenses-header__left-panel">
        <p className="expenses-header__left-text">What exactly are Expenses?</p>
      </div>

      <div className="expenses-header__center">
        <Link className="expenses-header__title-link" to="/">
          <h1 className="expenses-header__title">Expenses</h1>
        </Link>
      </div>

      <div className="expenses-header__right-panel">
        <p className="expenses-header__right-text">*Profile Name*</p>
      </div>
    </header>
  );
}

export default ExpensesHeader;
