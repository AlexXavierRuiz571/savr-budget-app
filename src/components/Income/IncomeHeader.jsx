import { Link } from "react-router-dom";
import SecondaryNav from "../SecondaryNav/SecondaryNav.jsx";
import "./IncomeHeader.css";

function IncomeHeader() {
  return (
    <>
      <header className="income-header">
        <div className="income-header__left-panel">
          <p className="income-header__left-text">How does Income work?</p>
        </div>

        <div className="income-header__center">
          <Link className="income-header__title-link" to="/">
            <h1 className="income-header__title">Income</h1>
          </Link>
        </div>

        <div className="income-header__right-panel">
          <p className="income-header__right-text">*Profile Name*</p>
        </div>
      </header>

      <SecondaryNav active="income" />
    </>
  );
}

export default IncomeHeader;
