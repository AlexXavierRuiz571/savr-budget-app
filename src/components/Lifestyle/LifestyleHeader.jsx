import { Link } from "react-router-dom";
import "./LifestyleHeader.css";

function LifestyleHeader() {
  return (
    <header className="lifestyle-header">
      <div className="lifestyle-header__left-panel">
        <p className="lifestyle-header__left-text">
          What does Lifestyle spending include?
        </p>
      </div>

      <div className="lifestyle-header__center">
        <Link className="lifestyle-header__title-link" to="/">
          <h1 className="lifestyle-header__title">Lifestyle</h1>
        </Link>
      </div>

      <div className="lifestyle-header__right-panel">
        <p className="lifestyle-header__right-text">*Profile Name*</p>
      </div>
    </header>
  );
}

export default LifestyleHeader;
