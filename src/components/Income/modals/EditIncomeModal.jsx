import "./AddIncomeModal.css";
import { useMemo, useState } from "react";
import ModalWithForm from "../../Modals/ModalWithForm/ModalWithForm.jsx";

const FREQUENCY_OPTIONS = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Bi-weekly", value: "bi_weekly" },
  { label: "Monthly", value: "monthly" },
];

const toMonthlyAmount = (amount, frequency) => {
  const num = Number(amount);
  if (Number.isNaN(num)) return 0;

  switch (frequency) {
    case "daily":
      return num * 30;
    case "weekly":
      return (num * 52) / 12;
    case "bi_weekly":
      return (num * 26) / 12;
    case "monthly":
    default:
      return num;
  }
};

function EditIncomeModal({ isOpen, onClose, incomeToEdit, onUpdateIncome }) {
  const [formValues, setFormValues] = useState(() => ({
    amount:
      incomeToEdit && (incomeToEdit.amount === 0 || incomeToEdit.amount)
        ? String(incomeToEdit.amount)
        : "",
    frequency: incomeToEdit?.frequency || "",
    incomeTitle: incomeToEdit?.title || "",
  }));

  const canSubmit = useMemo(() => {
    return (
      formValues.amount !== "" &&
      Number(formValues.amount) >= 0 &&
      Boolean(formValues.frequency)
    );
  }, [formValues.amount, formValues.frequency]);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!canSubmit) return;
    if (!incomeToEdit) return;

    const monthlyTotal = toMonthlyAmount(
      formValues.amount,
      formValues.frequency,
    );
    const isEstimate = formValues.frequency !== "monthly";
    const trimmedTitle = (formValues.incomeTitle || "").trim();

    if (typeof onUpdateIncome === "function") {
      onUpdateIncome({
        ...incomeToEdit,
        title: trimmedTitle,
        amount: Number(formValues.amount),
        frequency: formValues.frequency,
        monthlyTotal,
        isEstimate,
      });
    }

    onClose();
  };

  return (
    <ModalWithForm
      key={`${isOpen}-${incomeToEdit?.id || "empty"}`}
      isOpen={isOpen}
      title={
        <>
          Edit{" "}
          <span className="income__title-highlight">
            {incomeToEdit?.title || "Income"}
          </span>
        </>
      }
      onClose={onClose}
      onSubmit={handleSubmit}
      className="income-modal"
      showDefaultActions={false}
      footerContent={
        <>
          <button
            className="add-income__save"
            type="submit"
            disabled={!canSubmit}
          >
            Save
          </button>

          <button
            className="add-income__cancel"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
        </>
      }
    >
      <div className="add-income">
        <label className="add-income__label">
          Amount <span className="add-income__required">*</span>
        </label>

        <div className="add-income__label">
          <input
            className="add-income__input"
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
            placeholder="Edit amount"
            required
          />
        </div>

        <label className="add-income__label">
          Frequency <span className="add-income__required">*</span>
        </label>

        <select
          className="add-income__select"
          value={formValues.frequency}
          onChange={(evt) =>
            setFormValues((prev) => ({
              ...prev,
              frequency: evt.target.value,
            }))
          }
          required
        >
          <option value="">Select frequency</option>
          {FREQUENCY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <label className="add-income__label">Income name (optional)</label>
        <input
          className="add-income__input"
          type="text"
          value={formValues.incomeTitle}
          onChange={(evt) =>
            setFormValues((prev) => ({
              ...prev,
              incomeTitle: evt.target.value,
            }))
          }
          placeholder="Job"
        />
      </div>
    </ModalWithForm>
  );
}

export default EditIncomeModal;
