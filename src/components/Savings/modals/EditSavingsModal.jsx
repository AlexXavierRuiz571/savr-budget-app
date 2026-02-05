import "../modals/AddSavingsModal.css";
import { useMemo, useState } from "react";
import ModalWithForm from "../../Modals/ModalWithForm/ModalWithForm.jsx";

function EditSavingsModal({ isOpen, onClose, savingsToEdit, onUpdateSavings }) {
  const [formValues, setFormValues] = useState({
    amount: savingsToEdit?.amount != null ? String(savingsToEdit.amount) : "",
    title: savingsToEdit?.title || "",
    notes: savingsToEdit?.notes || "",
  });

  const resetForm = () => {
    setFormValues({ amount: "", title: "", notes: "" });
  };

  const canSubmit = useMemo(() => {
    const num = Number(formValues.amount);
    return formValues.amount !== "" && !Number.isNaN(num) && num > 0;
  }, [formValues.amount]);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!canSubmit || !savingsToEdit) return;

    if (typeof onUpdateSavings === "function") {
      onUpdateSavings({
        ...savingsToEdit,
        title: formValues.title.trim(),
        amount: Number(formValues.amount),
        notes: (formValues.notes || "").trim().slice(0, 250),
      });
    }

    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const modalTitle = (
    <>
      Edit{" "}
      <span className="savings__title-highlight">
        {savingsToEdit?.title || "Savings"}
      </span>
    </>
  );

  const formKey = !isOpen
    ? "closed"
    : savingsToEdit?.id
      ? `open-${savingsToEdit.id}`
      : "open-empty";

  return (
    <ModalWithForm
      key={formKey}
      isOpen={isOpen}
      title={modalTitle}
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
          value={formValues.amount}
          onChange={(evt) =>
            setFormValues((prev) => ({
              ...prev,
              amount: evt.target.value,
            }))
          }
          required
        />

        <label className="add-savings__label">Savings name (optional)</label>
        <input
          className="add-savings__input"
          type="text"
          value={formValues.title}
          onChange={(evt) =>
            setFormValues((prev) => ({
              ...prev,
              title: evt.target.value,
            }))
          }
          placeholder="Job"
          maxLength={60}
        />

        <label className="add-savings__label">Notes (optional)</label>
        <textarea
          className="add-savings__textarea"
          value={formValues.notes}
          onChange={(evt) =>
            setFormValues((prev) => ({
              ...prev,
              notes: evt.target.value,
            }))
          }
          maxLength={250}
          rows={4}
        />
        <div className="add-savings__note-max">250 characters max</div>
      </div>
    </ModalWithForm>
  );
}

export default EditSavingsModal;
