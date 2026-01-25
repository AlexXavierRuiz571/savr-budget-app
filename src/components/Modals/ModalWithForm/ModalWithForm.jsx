import "./ModalWithForm.css";
import { useEffect } from "react";

function ModalWithForm({
  isOpen,
  title,
  onClose,
  onSubmit,
  children,
  className = "",
  submitText = "Submit",
  showSubmit = true,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscClose = (evt) => {
      if (evt.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscClose);
    return () => document.removeEventListener("keydown", handleEscClose);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayMouseDown = (evt) => {
    if (evt.target.classList.contains("modal")) onClose();
  };

  return (
    <div className="modal" onMouseDown={handleOverlayMouseDown}>
      <div className={`modal__container ${className}`} role="dialog" aria-modal="true">
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>

          <button
            className="modal__close"
            type="button"
            aria-label="Close modal"
            onClick={onClose}
          >
            <img
              className="modal__close-icon"
              src="/src/assets/icons/close-icon.svg"
              alt=""
              aria-hidden="true"
            />
          </button>
        </div>

        <form className="modal__form" onSubmit={onSubmit}>
          <div className="modal__body">{children}</div>

          <div className="modal__actions">
            {showSubmit && (
              <button className="modal__submit" type="submit">
                {submitText}
              </button>
            )}

            <button className="modal__cancel" type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalWithForm;
