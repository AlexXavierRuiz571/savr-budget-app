import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./SavingsHeader.css";
import closeIcon from "../../assets/icons/close-icon.svg";

function SavingsHeader() {
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
    <header className="savings-header">
      <div className="savings-header__left-panel">
        <button
          type="button"
          className="savings-header__help-trigger"
          onClick={handleToggleHelp}
          aria-label="Open Income Help"
        >
          What counts as Savings?
        </button>

        {isHelpOpen && (
          <div className="savings-header__help-panel" ref={panelRef}>
            <div className="savings-header__help-top">
              <p className="savings-header__help-title">
                What counts as{" "}
                <span className="savings-header__help-highlight">Savings</span>?
              </p>

              <button
                type="button"
                className="savings-header__help-close"
                onClick={handleCloseHelp}
                aria-label="Close savings Help"
              >
                <img
                  className="savings-header__help-close-icon"
                  src={closeIcon}
                  alt="Close Icon"
                />
              </button>
            </div>

            <ul className="savings-header__help-list">
              <li>
                This page is used to record money you intentionally set aside
                each month. Savings are entered as direct monthly amounts, not
                estimates.
              </li>
              <li>
                Savings entries represent planned allocations, such as emergency
                funds or long-term goals, and are treated separately from
                expenses.
              </li>
              <li>
                Once savings are saved, they are included in your overall budget
                totals and reflected in your monthly allocation breakdown.
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="savings-header__center">
        <Link className="savings-header__title-link" to="/">
          <h1 className="savings-header__title">Savings</h1>
        </Link>
      </div>

      <div className="savings-header__right-panel">
        <Link className="savings-header__right-text" to="/info">
          Profile
        </Link>{" "}
      </div>
    </header>
  );
}

export default SavingsHeader;
