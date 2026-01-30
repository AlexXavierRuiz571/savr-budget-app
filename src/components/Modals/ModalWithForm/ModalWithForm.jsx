import "./ModalWithForm.css";
import { useEffect } from "react";
import closeIcon from "../../../assets/icons/close-icon.svg";

function ModalWithForm({
  isOpen,
  title,
  headerContent,
  onClose,
  onSubmit,
  children,
  className = "",
  submitText = "Submit",
  showSubmit = true,
  showDefaultActions = true,
  showCancel = true,
  footerContent = null,
}) {
  const requestClose = () => {
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleEscClose = (evt) => {
      if (evt.key === "Escape") requestClose();
    };

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.addEventListener("keydown", handleEscClose);
    return () => {
      document.removeEventListener("keydown", handleEscClose);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayMouseDown = (evt) => {
    if (evt.target.classList.contains("modal")) requestClose();
  };

  return (
    <div className="modal" onMouseDown={handleOverlayMouseDown}>
      <div
        className={`modal__container ${className}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>

          <button
            className="modal__close"
            type="button"
            aria-label="Close modal"
            onClick={requestClose}
          >
            <img
              className="modal__close-icon"
              src={closeIcon}
              alt=""
              aria-hidden="true"
            />
          </button>
        </div>

        {headerContent && (
          <div className="modal__header-accent">{headerContent}</div>
        )}

        <form className="modal__form" onSubmit={onSubmit}>
          <div className="modal__body">{children}</div>

          {footerContent ? (
            <div className="modal__actions">{footerContent}</div>
          ) : showDefaultActions ? (
            <div className="modal__actions">
              {showSubmit && (
                <button className="modal__submit" type="submit">
                  {submitText}
                </button>
              )}

              {showCancel && (
                <button
                  className="modal__cancel"
                  type="button"
                  onClick={requestClose}
                >
                  Cancel
                </button>
              )}
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}

export default ModalWithForm;
