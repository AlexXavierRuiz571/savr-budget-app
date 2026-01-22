import { Link } from "react-router-dom";
import "./MainHeader.css";

function MainHeader() {
  return (
    <header className="header">
      <div className="header__left-panel">
        <p className="header__left-text">
          What is <span className="text-highlight">SAVR</span>?
        </p>
      </div>

      <div className="header__center">
        <Link className="header__title-link" to="/">
          <h1 className="header__title">SAVR</h1>
        </Link>

        <p className="header__slogan">Save and Vibe Right</p>
        <p className="header__tagline">Plan today. Avoid surprises tomorrow.</p>
      </div>

      <div className="header__right-panel">
        <Link className="header__right-text" to="/info">
          Profile
        </Link>
      </div>
    </header>
  );
}

export default MainHeader;
