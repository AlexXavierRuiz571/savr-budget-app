import { Link } from "react-router-dom";
import "./InfoHubHeader.css";

function InfoHubHeader() {
  return (
    <header className="infohub-header">
     
      <div className="infohub-header__center">
        <Link className="infohub-header__title-link" to="/">
          <h1 className="infohub-header__title">Information Hub</h1>
        </Link>
      </div>

      <div className="infohub-header__right-panel">
        <p className="infohub-header__right-text">*Profile Name*</p>
      </div>
    </header>
  );
}

export default InfoHubHeader;
