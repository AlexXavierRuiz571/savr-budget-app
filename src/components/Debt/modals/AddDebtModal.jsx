import "./AddDebtModal.css";
import { useEffect, useMemo, useState } from "react";
import ModalWithForm from "../../Modals/ModalWithForm/ModalWithForm.jsx";

const DEBT_TYPE_OPTIONS = [
  { label: "Credit Card", value: "credit_card" },
  { label: "Auto Loan", value: "auto_loan" },
  { label: "Student Loan", value: "student_loan" },
  { label: "Mortgage", value: "mortgage" },
  { label: "Personal Loan", value: "personal_loan" },
  { label: "Medical Debt", value: "medical_debt" },
  { label: "Other", value: "other" },
];

function AddDebtModal({ isOpen, onClose, onAddDebt }) {
  const [amount, setAmount] = useState("");
  const [debtType, setDebtType] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setAmount("");
    setDebtType("");
    setTitle("");
    setNotes("");
  }, [isOpen]);

  const canSubmit = useMemo(() => {
    const num = Number(amount);
    return amount !== "" && !Number.isNaN(num) && num > 0;
  }, [amount]);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!canSubmit) return;

    if (typeof onAddDebt === "function") {
      onAddDebt({
        id: crypto.randomUUID(),
        amount: Number(amount),
        debtType: debtType.trim(),
        title: title.trim(),
        notes: notes.trim().slice(0, 250),
      });
    }

    onClose();
  };

  const handleClose = () => {
    setAmount("");
    setDebtType("");
    setTitle("");
    setNotes("");
    onClose();
  };

  return (
    <ModalWithForm
      isOpen={isOpen}
      title="Add Debt"
      onClose={handleClose}
      onSubmit={handleSubmit}
      className="debt-modal"
      showDefaultActions={false}
      footerContent={
        <>
          <button
            className="add-debt__submit"
            type="submit"
            disabled={!canSubmit}
          >
            Save
          </button>

          <button
            className="add-debt__cancel"
            type="button"
            onClick={handleClose}
          >
            Cancel
          </button>
        </>
      }
    >
      <div className="add-debt__body">
        <label className="add-debt__label">
          Monthly payment <span className="add-debt__required">*</span>
        </label>

        <div className="add-debt__label">
          <input
            className="add-debt__input add-debt__input_type_amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(evt) => setAmount(evt.target.value)}
            placeholder="Enter amount"
            required
          />
        </div>

        <label className="add-debt__label">
          Debt Type <span className="add-debt__required">*</span>
        </label>
        <select
          className="add-debt__select"
          value={debtType}
          onChange={(evt) => setDebtType(evt.target.value)}
          required
        >
          <option value="">Select Debt type</option>
          {DEBT_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <label className="add-debt__label">Debt name (optional)</label>
        <input
          className="add-debt__input"
          type="text"
          value={title}
          onChange={(evt) => setTitle(evt.target.value)}
          placeholder="Job"
          maxLength={60}
        />

        <label className="add-debt__label">Notes (optional)</label>
        <textarea
          className="add-debt__textarea"
          value={notes}
          onChange={(evt) => setNotes(evt.target.value)}
          placeholder="Optional Notes"
          maxLength={250}
          rows={4}
        />
        <div className="add-debt__note-max">250 characters max</div>
      </div>
    </ModalWithForm>
  );
}

export default AddDebtModal;
