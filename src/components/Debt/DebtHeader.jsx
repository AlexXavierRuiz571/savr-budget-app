import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./DebtHeader.css";
import closeIcon from "../../assets/icons/close-icon.svg";

function DebtHeader() {
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
    <header className="debt-header">
      <div className="debt-header__left-panel">
        <button
          type="button"
          className="debt-header__help-trigger"
          onClick={handleToggleHelp}
          aria-label="Open Debt Help"
        >
          What qualifies as Debt?
        </button>

        {isHelpOpen && (
          <div className="debt-header__help-panel" ref={panelRef}>
            <div className="debt-header__help-top">
              <p className="debt-header__help-title">
                What qualifies as{" "}
                <span className="debt-header__help-highlight">Debt</span>?
              </p>

              <button
                type="button"
                className="debt-header__help-close"
                onClick={handleCloseHelp}
                aria-label="Close debt Help"
              >
                <img
                  className="debt-header__help-close-icon"
                  src={closeIcon}
                  alt="Close Icon"
                />
              </button>
            </div>

            <ul className="debt-header__help-list">
              <li>
                This page is used to add and manage financial obligations that
                require regular payments, such as loans, credit cards, or other
                balances you owe.
              </li>
              <li>
                Debt entries are recorded as monthly payment amounts,
                representing what you are currently required to pay, not the
                total balance or payoff timeline.
              </li>
              <li>
                Once debt entries are saved, their monthly payments are included
                in your overall budget calculations and reflected as part of
                your total monthly obligations.
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="debt-header__center">
        <Link className="debt-header__title-link" to="/">
          <h1 className="debt-header__title">Debt</h1>
        </Link>
      </div>

      <div className="debt-header__right-panel">
         <Link className="debt-header__right-text" to="/info">
          Profile
        </Link>{" "}
      </div>
    </header>
  );
}

export default DebtHeader;
