import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header__left">
        <button className="header__help" type="button">
          What is SAVR?
        </button>
      </div>

      <div className="header__center">
        <h1 className="header__title">SAVR</h1>
        <p className="header__tagline">Save and Vibe Right</p>
        <p className="header__subtagline">
          Plan today. Avoid surprises tomorrow.
        </p>
      </div>

      <div className="header__right">
        <button className="header__profile" type="button">
          Profile
        </button>
      </div>
    </header>
  );
}

export default Header;
