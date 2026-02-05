import "./AddDebtModal.css";
import { useMemo, useState } from "react";
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

function EditDebtModal({ isOpen, onClose, debtToEdit, onUpdateDebt }) {
  const [formValues, setFormValues] = useState({
    amount: debtToEdit?.amount != null ? String(debtToEdit.amount) : "",
    debtType: debtToEdit?.debtType || "",
    title: debtToEdit?.title || "",
    notes: debtToEdit?.notes || "",
  });

  const canSubmit = useMemo(() => {
    const num = Number(formValues.amount);
    return formValues.amount !== "" && !Number.isNaN(num) && num > 0;
  }, [formValues.amount]);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!canSubmit || !debtToEdit) return;

    if (typeof onUpdateDebt === "function") {
      onUpdateDebt({
        ...debtToEdit,
        amount: Number(formValues.amount),
        debtType: formValues.debtType.trim(),
        title: formValues.title.trim(),
        notes: (formValues.notes || "").trim().slice(0, 250),
      });
    }

    onClose();
  };

  const modalTitle = (
    <>
      Edit{" "}
      <span className="debt__title-highlight">
        {debtToEdit?.title || "Debt"}
      </span>
    </>
  );

  const formKey = !isOpen
    ? "closed"
    : debtToEdit?.id
      ? `open-${debtToEdit.id}`
      : "open-empty";

  return (
    <ModalWithForm
      key={formKey}
      isOpen={isOpen}
      title={modalTitle}
      onClose={onClose}
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
          <button className="add-debt__cancel" type="button" onClick={onClose}>
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
            value={formValues.amount}
            onChange={(evt) =>
              setFormValues((previous) => ({
                ...previous,
                amount: evt.target.value,
              }))
            }
            placeholder="Enter amount"
            required
          />
        </div>

        <label className="add-debt__label">Debt Type (optional)</label>
        <select
          className="add-debt__select"
          value={formValues.debtType}
          onChange={(evt) =>
            setFormValues((previous) => ({
              ...previous,
              debtType: evt.target.value,
            }))
          }
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
          value={formValues.title}
          onChange={(evt) =>
            setFormValues((previous) => ({
              ...previous,
              title: evt.target.value,
            }))
          }
          placeholder="Job"
          maxLength={60}
        />

        <label className="add-debt__label">Notes (optional)</label>
        <textarea
          className="add-debt__textarea"
          value={formValues.notes}
          onChange={(evt) =>
            setFormValues((previous) => ({
              ...previous,
              notes: evt.target.value,
            }))
          }
          placeholder="Optional Notes"
          maxLength={250}
          rows={4}
        />
        <div className="add-debt__note-max">250 characters max</div>
      </div>
    </ModalWithForm>
  );
}

export default EditDebtModal;
