import "./Income.css";
import { useMemo, useState } from "react";
import IncomeHeader from "./IncomeHeader";
import SecondaryNav from "../SecondaryNav/SecondaryNav.jsx";
import addIcon from "../../assets/icons/add-icon.svg";
import editIcon from "../../assets/icons/edit-icon.svg";
import deleteIcon from "../../assets/icons/delete-icon.svg";
import AddIncomeModal from "./modals/AddIncomeModal.jsx";
import EditIncomeModal from "./modals/EditIncomeModal.jsx";
import DeleteModal from "../Modals/DeleteModal/DeleteModal.jsx";
import ProfileStore from "../../utils/ProfileStore.js";
import useProfileGroups from "../../utils/useProfileGroups.js";

function Income() {
  const savedIncome = useProfileGroups("income");

  const [isAddIncomeModalOpen, setIsAddIncomeModalOpen] = useState(false);
  const [isEditIncomeModalOpen, setIsEditIncomeModalOpen] = useState(false);

  const [isDeleteIncomeOpen, setIsDeleteIncomeOpen] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState(null);

  const [incomeToEdit, setIncomeToEdit] = useState(null);

  const handleOpenAddIncomeModal = () => setIsAddIncomeModalOpen(true);
  const handleCloseAddIncomeModal = () => setIsAddIncomeModalOpen(false);

  const handleOpenEditIncomeModal = (entry) => {
    setIncomeToEdit(entry);
    setIsEditIncomeModalOpen(true);
  };

  const handleCloseEditIncomeModal = () => {
    setIncomeToEdit(null);
    setIsEditIncomeModalOpen(false);
  };

  const openDeleteIncome = (entry) => {
    setIncomeToDelete(entry);
    setIsDeleteIncomeOpen(true);
  };

  const closeDeleteIncome = () => {
    setIncomeToDelete(null);
    setIsDeleteIncomeOpen(false);
  };

  const confirmDeleteIncome = () => {
    if (!incomeToDelete) return;

    ProfileStore.setGroups(
      "income",
      savedIncome.filter((entry) => entry.id !== incomeToDelete.id),
    );

    closeDeleteIncome();
  };

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

  const formatAmount = (amount) => {
    const num = Number(amount);
    if (Number.isNaN(num)) return "";
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const formatFrequencyLabel = (frequency) => {
    if (!frequency) return "";

    return frequency
      .replace("_", "-")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getDefaultIncomeTitle = () => {
    const usedTitles = new Set(
      savedIncome.map((entry) => (entry.title || "").trim()),
    );

    let index = 1;
    let candidate = `Income ${index}`;

    while (usedTitles.has(candidate)) {
      index += 1;
      candidate = `Income ${index}`;
    }

    return candidate;
  };

  const hasAnyEstimate = useMemo(() => {
    return savedIncome.some((entry) => entry.isEstimate);
  }, [savedIncome]);

  const totalMonthlyIncome = useMemo(() => {
    return savedIncome.reduce(
      (sum, entry) => sum + (entry.monthlyTotal || 0),
      0,
    );
  }, [savedIncome]);

  const handleAddIncome = (newEntry) => {
    const trimmedTitle = (newEntry.title || "").trim();
    const title = trimmedTitle || getDefaultIncomeTitle();

    const monthlyTotal = toMonthlyAmount(newEntry.amount, newEntry.frequency);
    const isEstimate = newEntry.frequency !== "monthly";

    const entryToSave = {
      id: newEntry.id || crypto.randomUUID(),
      title,
      amount: Number(newEntry.amount),
      frequency: newEntry.frequency,
      monthlyTotal,
      isEstimate,
      items: [],
    };

    ProfileStore.setGroups("income", [entryToSave, ...savedIncome]);
  };

  const handleUpdateIncome = (updatedEntry) => {
    const trimmedTitle = (updatedEntry.title || "").trim();
    const title = trimmedTitle || updatedEntry.title || getDefaultIncomeTitle();

    const monthlyTotal = toMonthlyAmount(
      updatedEntry.amount,
      updatedEntry.frequency,
    );
    const isEstimate = updatedEntry.frequency !== "monthly";

    const next = savedIncome.map((entry) => {
      if (entry.id !== updatedEntry.id) return entry;

      return {
        ...entry,
        title,
        amount: Number(updatedEntry.amount),
        frequency: updatedEntry.frequency,
        monthlyTotal,
        isEstimate,
      };
    });

    ProfileStore.setGroups("income", next);
    handleCloseEditIncomeModal();
  };

  return (
    <section className="income">
      <div className="income__container">
        <IncomeHeader />
        <SecondaryNav active="income" />

        <div className="income__content">
          <div className="income__summary">
            <h2 className="income__summary-title">Total Monthly Income:</h2>

            <div className="income__summary-row">
              <span className="income__summary-currency">
                {hasAnyEstimate ? "~" : ""} $
              </span>

              <span className="income__summary-value">
                {formatAmount(totalMonthlyIncome || 0)}
              </span>
            </div>
          </div>

          <div className="income__bar">
            <span className="income__bar-text">Add Income</span>

            <button
              className="income__bar-action"
              type="button"
              aria-label="Add Income"
              onClick={handleOpenAddIncomeModal}
            >
              <img
                className="income__bar-icon"
                src={addIcon}
                alt=""
                aria-hidden="true"
              />
            </button>
          </div>

          {savedIncome.length > 0 && (
            <div className="income__saved">
              {savedIncome.map((entry) => (
                <div key={entry.id} className="income__saved-entry">
                  <div className="income__saved-left">
                    <div className="income__saved-title">{entry.title}</div>

                    <div className="income__saved-monthly">
                      {formatFrequencyLabel(entry.frequency)}
                    </div>
                  </div>

                  <div className="income__saved-right">
                    <div className="income__saved-amount">
                      {entry.isEstimate ? "~" : ""}$
                      {formatAmount(entry.monthlyTotal || 0)} / month
                    </div>

                    <div className="income__saved-actions">
                      <button
                        className="income__saved-icon-btn"
                        type="button"
                        aria-label={`Edit ${entry.title}`}
                        onClick={() => handleOpenEditIncomeModal(entry)}
                      >
                        <img
                          className="income__saved-icon"
                          src={editIcon}
                          alt=""
                          aria-hidden="true"
                        />
                      </button>

                      <button
                        className="income__saved-icon-btn"
                        type="button"
                        aria-label={`Delete ${entry.title}`}
                        onClick={() => openDeleteIncome(entry)}
                      >
                        <img
                          className="income__saved-icon"
                          src={deleteIcon}
                          alt=""
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddIncomeModal
        isOpen={isAddIncomeModalOpen}
        onClose={handleCloseAddIncomeModal}
        onAddIncome={handleAddIncome}
      />

      <EditIncomeModal
        isOpen={isEditIncomeModalOpen}
        onClose={handleCloseEditIncomeModal}
        incomeToEdit={incomeToEdit}
        onUpdateIncome={handleUpdateIncome}
      />

      <DeleteModal
        isOpen={isDeleteIncomeOpen}
        onClose={closeDeleteIncome}
        onConfirm={confirmDeleteIncome}
        targetName={incomeToDelete?.title || ""}
        highlightClassName="income__highlight"
        confirmButtonClassName="income__confirm-delete"
      />
    </section>
  );
}

export default Income;
