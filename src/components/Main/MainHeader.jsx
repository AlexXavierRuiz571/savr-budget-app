import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./MainHeader.css";
import closeIcon from "../../assets/icons/close-icon.svg";

function MainHeader() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const panelRef = useRef(null);

  const handleToggleHelp = () => {
    setIsHelpOpen((prev) => !prev);
  };

  const handleCloseHelp = () => {
    setIsHelpOpen(false);
  };

  useEffect(() => {
    if (!isHelpOpen) return;

    const handleEscClose = (evt) => {
      if (evt.key === "Escape") handleCloseHelp();
    };

    const handleOutsideClick = (evt) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(evt.target)) return;
      handleCloseHelp();
    };

    document.addEventListener("keydown", handleEscClose);
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("keydown", handleEscClose);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isHelpOpen]);

  return (
    <header className="header">
      <div className="header__left-panel">
        <button
          type="button"
          className="header__help-trigger"
          onClick={handleToggleHelp}
          aria-label="Open SAVR Help"
        >
          What is <span className="text-highlight">SAVR</span>?
        </button>

        {isHelpOpen && (
          <div className="header__help-panel" ref={panelRef}>
            <div className="header__help-top">
              <p className="header__help-title">
                What is <span className="text-highlight">SAVR</span>?
              </p>

              <button
                type="button"
                className="header__help-close"
                onClick={handleCloseHelp}
                aria-label="CloseHelp"
              >
                <img
                  className="header__help-close-icon"
                  src={closeIcon}
                  alt=""
                />
              </button>
            </div>

            <ul className="header__help-list">
              <li>
                SAVR helps you simulate a monthly budget by converting all
                income, expenses, and plans into monthly values.
              </li>
              <li>
                Each section focuses on one part of your budget, while the
                dashboard shows how everything connects.
              </li>
              <li>
                As you save changes, SAVR automatically updates your totals so
                you can see the impact in real time.
              </li>
            </ul>
          </div>
        )}
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
