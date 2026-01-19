import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header__left-panel">
        <p className="header__left-text">What is <span className="text-highlight">SAVR</span>?</p>
      </div>

      <div className="header__center">
        <h1 className="header__title">SAVR</h1>
        <p className="header__slogan">Save and Vibe Right</p>
        <p className="header__tagline">
          Plan today. Avoid surprises tomorrow.
        </p>
      </div>

      <div className="header__right-panel">
        <p className="header__right-text">*Profile Name*</p>
      </div>
    </header>
  );
}

export default Header;
