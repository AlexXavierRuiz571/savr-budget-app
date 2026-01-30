import "./AddIncomeModal.css";
import { useEffect, useMemo, useState } from "react";
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

function AddIncomeModal({ isOpen, onClose, onAddIncome }) {
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("");
  const [incomeName, setIncomeName] = useState("");

  const resetForm = () => {
    setAmount("");
    setFrequency("");
    setIncomeName("");
  };

  useEffect(() => {
    if (!isOpen) return;
    resetForm();
  }, [isOpen]);

  const canSubmit = useMemo(() => {
    return amount !== "" && Number(amount) >= 0 && Boolean(frequency);
  }, [amount, frequency]);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!canSubmit) return;

    const monthlyAmount = toMonthlyAmount(amount, frequency);
    const isEstimate = frequency !== "monthly";

    if (typeof onAddIncome === "function") {
      onAddIncome({
        id: crypto.randomUUID(),
        name: incomeName.trim(),
        amount: Number(amount),
        frequency,
        monthlyAmount,
        isEstimate,
      });
    }

    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <ModalWithForm
      isOpen={isOpen}
      title="Add Income"
      onClose={handleClose}
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
            onClick={handleClose}
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
            value={amount}
            onChange={(evt) => setAmount(evt.target.value)}
            placeholder="Enter amount"
            required
          />
        </div>

        <label className="add-income__label">
          Frequency <span className="add-income__required">*</span>
        </label>
        <select
          className="add-income__select"
          value={frequency}
          onChange={(evt) => setFrequency(evt.target.value)}
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
          value={incomeName}
          onChange={(evt) => setIncomeName(evt.target.value)}
          placeholder="Job"
        />
      </div>
    </ModalWithForm>
  );
}

export default AddIncomeModal;
