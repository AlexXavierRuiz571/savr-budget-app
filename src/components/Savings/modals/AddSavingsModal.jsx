import "./AddSavingsModal.css";
import { useMemo, useState } from "react";
import ModalWithForm from "../../Modals/ModalWithForm/ModalWithForm.jsx";

function AddSavingsModal({ isOpen, onClose, onAddSavings }) {
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  const canSubmit = useMemo(() => {
    const num = Number(amount);
    return amount !== "" && !Number.isNaN(num) && num > 0;
  }, [amount]);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!canSubmit) return;

    if (typeof onAddSavings === "function") {
      onAddSavings({
        id: crypto.randomUUID(),
        title: title.trim(),
        amount: Number(amount),
        notes: notes.trim().slice(0, 250),
      });
    }

    onClose();
  };

  const handleClose = () => {
    setAmount("");
    setTitle("");
    setNotes("");
    onClose();
  };

  return (
    <ModalWithForm
      isOpen={isOpen}
      title="Add Savings"
      onClose={handleClose}
      onSubmit={handleSubmit}
      className="savings-modal"
      showDefaultActions={false}
      footerContent={
        <>
          <button
            className="add-savings__submit"
            type="submit"
            disabled={!canSubmit}
          >
            Save
          </button>

          <button
            className="add-savings__cancel"
            type="button"
            onClick={handleClose}
          >
            Cancel
          </button>
        </>
      }
    >
      <div className="add-savings__body">
        <label className="add-savings__label">
          Amount <span className="add-savings__required">*</span>
        </label>
        <input
          className="add-savings__input"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(evt) => setAmount(evt.target.value)}
          placeholder="Enter amount"
          required
        />

        <label className="add-savings__label">Savings name (optional)</label>
        <input
          className="add-savings__input"
          type="text"
          value={title}
          onChange={(evt) => setTitle(evt.target.value)}
          placeholder="Job"
          maxLength={60}
        />

        <label className="add-savings__label">Notes (optional)</label>
        <textarea
          className="add-savings__textarea"
          value={notes}
          onChange={(evt) => setNotes(evt.target.value)}
          placeholder="Optional notes"
          maxLength={250}
          rows={4}
        />
        <div className="add-savings__note-max">250 characters max</div>
      </div>
    </ModalWithForm>
  );
}

export default AddSavingsModal;
