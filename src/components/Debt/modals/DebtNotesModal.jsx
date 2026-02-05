import "./DebtNotesModal.css";
import ModalWithForm from "../../Modals/ModalWithForm/ModalWithForm.jsx";

function DebtNotesModal({ isOpen, onClose, title, notes }) {
  const modalTitle = (
    <>
      <span className="debt__title-highlight">{title}</span>
    </>
  );

  return (
    <ModalWithForm
      isOpen={isOpen}
      title={modalTitle}
      onClose={onClose}
      onSubmit={(evt) => evt.preventDefault()}
      className="debt-notes-modal"
      showDefaultActions={false}
    >
      <div className="debt-notes__body">
        <p className="debt-notes__text">
          {notes && notes.trim() ? notes : "No notes saved for this item."}
        </p>
      </div>
    </ModalWithForm>
  );
}

export default DebtNotesModal;
