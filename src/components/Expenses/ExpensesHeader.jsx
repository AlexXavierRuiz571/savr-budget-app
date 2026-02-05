import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./ExpensesHeader.css";
import closeIcon from "../../assets/icons/close-icon.svg";

function ExpensesHeader() {
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
    <header className="expenses-header">
      <div className="expenses-header__left-panel">
        <button
          type="button"
          className="expenses-header__help-trigger"
          onClick={handleToggleHelp}
          aria-label="Open Expenses Help"
        >
          What exactly are Expenses?
        </button>

        {isHelpOpen && (
          <div className="expenses-header__help-panel" ref={panelRef}>
            <div className="expenses-header__help-top">
              <p className="expenses-header__help-title">
                What exactly are{" "}
                <span className="expenses-header__help-highlight">
                  Expenses
                </span>
                ?
              </p>

              <button
                type="button"
                className="expenses-header__help-close"
                onClick={handleCloseHelp}
                aria-label="Close Expenses Help"
              >
                <img
                  className="expenses-header__help-close-icon"
                  src={closeIcon}
                  alt="Close Icon"
                />
              </button>
            </div>

            <ul className="expenses-header__help-list">
              <li>
                This page is used to add and manage your recurring spending.
                Each expense is converted into a monthly value so totals can be
                calculated consistently.
              </li>
              <li>
                Some expenses may be estimated or suggested based on location or
                category. These values are placeholders and should be adjusted
                to match your real spending.
              </li>
              <li>
                Once expenses are saved, they are used to calculate how much of
                your income is allocated to spending across your budget.
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="expenses-header__center">
        <Link className="expenses-header__title-link" to="/">
          <h1 className="expenses-header__title">Expenses</h1>
        </Link>
      </div>

      <div className="expenses-header__right-panel">
        <Link className="lifestyle-header__right-text" to="/info">
          Profile
        </Link>{" "}
      </div>
    </header>
  );
}

export default ExpensesHeader;
