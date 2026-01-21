import { Link } from "react-router-dom";
import "./SavingsHeader.css";

function SavingsHeader() {
  return (
    <header className="savings-header">
      <div className="savings-header__left-panel">
        <p className="savings-header__left-text">What counts as Savings?</p>
      </div>

      <div className="savings-header__center">
        <Link className="savings-header__title-link" to="/">
          <h1 className="savings-header__title">Savings</h1>
        </Link>
      </div>

      <div className="savings-header__right-panel">
        <p className="savings-header__right-text">*Profile Name*</p>
      </div>
    </header>
  );
}

export default SavingsHeader;
