import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./IncomeHeader.css";
import closeIcon from "../../assets/icons/close-icon.svg";

function IncomeHeader() {
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
    <>
      <header className="income-header">
        <div className="income-header__left-panel">
          <button
            type="button"
            className="income-header__help-trigger"
            onClick={handleToggleHelp}
            aria-label="Open Income Help"
          >
            How does Income work?
          </button>

          {isHelpOpen && (
            <div className="income-header__help-panel" ref={panelRef}>
              <div className="income-header__help-top">
                <p className="income-header__help-title">
                  How does{" "}
                  <span className="income-header__help-highlight">Income </span>
                  work?
                </p>

                <button
                  type="button"
                  className="income-header__help-close"
                  onClick={handleCloseHelp}
                  aria-label="Close Income Help"
                >
                  <img
                    className="income-header__help-close-icon"
                    src={closeIcon}
                    alt=""
                  />
                </button>
              </div>

              <ul className="income-header__help-list">
                <li>
                  This page is used to add and manage all of your income
                  sources. Each source is converted into a monthly value so
                  totals can be calculated consistently.
                </li>
                <li>
                  If income is entered as daily, weekly, or bi-weekly, the “/
                  month” amount shown is an estimate. Estimated values are
                  marked with a ~.
                </li>
                <li>
                  Once income sources are saved, the rest of your budget is
                  calculated from this total.
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="income-header__center">
          <Link className="income-header__title-link" to="/">
            <h1 className="income-header__title">Income</h1>
          </Link>
        </div>

        <div className="income-header__right-panel">
          <Link className="income-header__right-text" to="/info">
            Profile
          </Link>{" "}
        </div>
      </header>
    </>
  );
}

export default IncomeHeader;
