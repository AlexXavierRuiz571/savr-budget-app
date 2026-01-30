import "./SavingsNotesModal.css";
import ModalWithForm from "../../Modals/ModalWithForm/ModalWithForm.jsx";

function SavingsNotesModal({ isOpen, onClose, title, notes }) {
  const modalTitle = (
    <>
      <span className="savings__title-highlight">{title}</span>
    </>
  );

  return (
    <ModalWithForm
      isOpen={isOpen}
      title={modalTitle}
      onClose={onClose}
      onSubmit={(evt) => evt.preventDefault()}
      className="savings-notes-modal"
      showDefaultActions={false}
    >
      <div className="savings-notes__body">
        <p className="savings-notes__text">
          {notes && notes.trim() ? notes : "No notes saved for this item."}
        </p>
      </div>
    </ModalWithForm>
  );
}

export default SavingsNotesModal;
