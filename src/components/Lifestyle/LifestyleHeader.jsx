import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./LifestyleHeader.css";
import closeIcon from "../../assets/icons/close-icon.svg";

function LifestyleHeader() {
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
      if (panelRef.current.contains(evt.target)) return;
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
    <header className="lifestyle-header">
      <div className="lifestyle-header__left-panel">
        <button
          type="button"
          className="lifestyle-header__help-trigger"
          onClick={handleToggleHelp}
          aria-label="Open Lifestyle Help"
        >
          What does Lifestyle spending include?
        </button>

        {isHelpOpen && (
          <div className="lifestyle-header__help-panel" ref={panelRef}>
            <div className="lifestyle-header__help-top">
              <p className="lifestyle-header__help-title">
                What does{" "}
                <span className="lifestyle-header__help-highlight">
                  Lifestyle
                </span>{" "}
                spending include?
              </p>

              <button
                type="button"
                className="lifestyle-header__help-close"
                onClick={handleCloseHelp}
                aria-label="Close Lifestyle Help"
              >
                <img
                  className="lifestyle-header__help-close-icon"
                  src={closeIcon}
                  alt="Close Icon"
                />
              </button>
            </div>

            <ul className="lifestyle-header__help-list">
              <li>
                This page is used to add and manage discretionary lifestyle
                spending, such as travel, dining out, entertainment, or other
                non-essential categories.
              </li>
              <li>
                Lifestyle values may be entered as estimates or ranges and
                represent typical monthly spending rather than exact, fixed
                costs.
              </li>
              <li>
                Once lifestyle entries are saved, their totals are included in
                your overall budget calculations and reflected separately from
                core expenses.
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="lifestyle-header__center">
        <Link className="lifestyle-header__title-link" to="/">
          <h1 className="lifestyle-header__title">Lifestyle</h1>
        </Link>
      </div>

      <div className="lifestyle-header__right-panel">
        <Link className="lifestyle-header__right-text" to="/info">
          Profile
        </Link>{" "}
      </div>
    </header>
  );
}

export default LifestyleHeader;
