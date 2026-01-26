import ModalWithForm from "../ModalWithForm/ModalWithForm.jsx";
import "./DeleteModal.css";

function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  targetName = "",
  highlightClassName = "",
  confirmButtonClassName = "",
  confirmText = "Delete",
  cancelText = "Cancel",
}) {
  if (!isOpen) return null;

  const safeName = String(targetName || "").trim();

  return (
    <ModalWithForm
      isOpen={isOpen}
      title=""
      onClose={onClose}
      onSubmit={(evt) => {
        evt.preventDefault();
        if (typeof onConfirm === "function") onConfirm();
      }}
      className="delete-modal"
      showDefaultActions={false}
      footerContent={
        <div className="delete-modal__actions">
          <button
            className={`delete-modal__delete ${confirmButtonClassName}`}
            type="submit"
          >
            {confirmText}
          </button>

          <button
            className="delete-modal__cancel"
            type="button"
            onClick={onClose}
          >
            {cancelText}
          </button>
        </div>
      }
    >
      <div className="delete-modal__content">
        <div className="delete-modal__text">
          You want to remove{" "}
          <span className={`delete-modal__name ${highlightClassName}`}>
            {safeName}
          </span>
          ?
        </div>
      </div>
    </ModalWithForm>
  );
}

export default DeleteModal;
