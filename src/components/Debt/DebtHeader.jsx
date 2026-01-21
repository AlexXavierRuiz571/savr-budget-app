import { Link } from "react-router-dom";
import "./DebtHeader.css";

function DebtHeader() {
  return (
    <header className="debt-header">
      <div className="debt-header__left-panel">
        <p className="debt-header__left-text">What qualifies as Debt?</p>
      </div>

      <div className="debt-header__center">
        <Link className="debt-header__title-link" to="/">
          <h1 className="debt-header__title">Debt</h1>
        </Link>
      </div>

      <div className="debt-header__right-panel">
        <p className="debt-header__right-text">*Profile Name*</p>
      </div>
    </header>
  );
}

export default DebtHeader;
