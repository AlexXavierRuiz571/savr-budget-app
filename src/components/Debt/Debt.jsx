import "./Debt.css";
import { useMemo, useState } from "react";
import DebtHeader from "./DebtHeader.jsx";
import SecondaryNav from "../SecondaryNav/SecondaryNav.jsx";
import addIcon from "../../assets/icons/add-icon.svg";
import editIcon from "../../assets/icons/edit-icon.svg";
import deleteIcon from "../../assets/icons/delete-icon.svg";
import notesIcon from "../../assets/icons/notes-icon.svg";
import AddDebtModal from "./modals/AddDebtModal.jsx";
import EditDebtModal from "./modals/EditDebtModal.jsx";
import DebtNotesModal from "./modals/DebtNotesModal.jsx";
import DeleteModal from "../Modals/DeleteModal/DeleteModal.jsx";
import ProfileStore from "../../utils/ProfileStore.js";
import useProfileGroups from "../../utils/useProfileGroups.js";

function Debt() {
  const savedDebt = useProfileGroups("debt");

  const [isAddDebtModalOpen, setIsAddDebtModalOpen] = useState(false);
  const [isEditDebtModalOpen, setIsEditDebtModalOpen] = useState(false);
  const [isDeleteDebtOpen, setIsDeleteDebtOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const [debtToEdit, setDebtToEdit] = useState(null);
  const [debtToDelete, setDebtToDelete] = useState(null);
  const [debtToViewNotes, setDebtToViewNotes] = useState(null);

  const handleOpenAddDebtModal = () => setIsAddDebtModalOpen(true);
  const handleCloseAddDebtModal = () => setIsAddDebtModalOpen(false);

  const handleOpenEditDebtModal = (entry) => {
    setDebtToEdit(entry);
    setIsEditDebtModalOpen(true);
  };

  const handleCloseEditDebtModal = () => {
    setDebtToEdit(null);
    setIsEditDebtModalOpen(false);
  };

  const openDeleteDebt = (entry) => {
    setDebtToDelete(entry);
    setIsDeleteDebtOpen(true);
  };

  const closeDeleteDebt = () => {
    setDebtToDelete(null);
    setIsDeleteDebtOpen(false);
  };

  const confirmDeleteDebt = () => {
    if (!debtToDelete) return;

    ProfileStore.setGroups(
      "debt",
      savedDebt.filter((entry) => entry.id !== debtToDelete.id),
    );

    closeDeleteDebt();
  };

  const openNotes = (entry) => {
    setDebtToViewNotes(entry);
    setIsNotesOpen(true);
  };

  const closeNotes = () => {
    setDebtToViewNotes(null);
    setIsNotesOpen(false);
  };

  const formatAmount = (amount) => {
    const num = Number(amount);
    if (Number.isNaN(num)) return "";
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const getDefaultDebtTitle = () => {
    const usedTitles = new Set(savedDebt.map((entry) => (entry.title || "").trim()));

    let index = 1;
    let candidate = `Debt ${index}`;

    while (usedTitles.has(candidate)) {
      index += 1;
      candidate = `Debt ${index}`;
    }

    return candidate;
  };

  const totalMonthlyDebt = useMemo(() => {
    return savedDebt.reduce(
      (sum, entry) => sum + (Number(entry.monthlyTotal) || 0),
      0,
    );
  }, [savedDebt]);

  const sanitizeNotes = (raw) => {
    if (typeof raw !== "string") return "";
    return raw.trim().slice(0, 250);
  };

  const sanitizeAmount = (raw) => {
    const num = Number(raw);
    if (Number.isNaN(num)) return 0;
    if (num < 0) return 0;
    return num;
  };

  const sanitizeDebtType = (raw) => {
    if (typeof raw !== "string") return "";
    return raw.trim();
  };

  const handleAddDebt = (newEntry) => {
    const monthlyTotal = sanitizeAmount(newEntry.amount);
    const debtType = sanitizeDebtType(newEntry.debtType);
    const notes = sanitizeNotes(newEntry.notes);

    const trimmedTitle = (newEntry.title || "").trim();
    const title = trimmedTitle || getDefaultDebtTitle();

    const entryToSave = {
      id: newEntry.id || crypto.randomUUID(),
      title,
      amount: monthlyTotal,
      monthlyTotal,
      debtType,
      notes,
      items: [],
      isEstimate: false,
    };

    ProfileStore.setGroups("debt", [entryToSave, ...savedDebt]);
  };

  const handleUpdateDebt = (updatedEntry) => {
    if (!updatedEntry?.id) return;

    const next = savedDebt.map((entry) => {
      if (entry.id !== updatedEntry.id) return entry;

      const monthlyTotal = sanitizeAmount(updatedEntry.amount);
      const debtType = sanitizeDebtType(updatedEntry.debtType);
      const notes = sanitizeNotes(updatedEntry.notes);

      const trimmedTitle = (updatedEntry.title || "").trim();
      const title = trimmedTitle || entry.title || getDefaultDebtTitle();

      return {
        ...entry,
        title,
        amount: monthlyTotal,
        monthlyTotal,
        debtType,
        notes,
      };
    });

    ProfileStore.setGroups("debt", next);
    handleCloseEditDebtModal();
  };

  const hasNotes = (entry) => Boolean((entry?.notes || "").trim());

  return (
    <section className="debt">
      <div className="debt__container">
        <DebtHeader />
        <SecondaryNav active="debt" />

        <div className="debt__content">
          <div className="debt__summary">
            <h2 className="debt__summary-title">Total Monthly Debt:</h2>

            <div className="debt__summary-row">
              <span className="debt__summary-currency">$</span>
              <span className="debt__summary-value">
                {formatAmount(totalMonthlyDebt || 0)}
              </span>
            </div>
          </div>

          <div className="debt__bar">
            <span className="debt__bar-text">Add Debt</span>

            <button
              className="debt__bar-action"
              type="button"
              aria-label="Add Debt"
              onClick={handleOpenAddDebtModal}
            >
              <img className="debt__bar-icon" src={addIcon} alt="" aria-hidden="true" />
            </button>
          </div>

          {savedDebt.length > 0 && (
            <div className="debt__saved">
              {savedDebt.map((entry) => (
                <div key={entry.id} className="debt__saved-entry">
                  <div className="debt__saved-left">
                    <div className="debt__saved-title">{entry.title}</div>

                    <div className="debt__saved-amount">
                      ${formatAmount(entry.monthlyTotal || 0)} / month
                    </div>
                  </div>

                  <div className="debt__saved-actions">
                    {hasNotes(entry) && (
                      <button
                        className="debt__saved-icon-btn debt__saved-icon-btn_type_notes"
                        type="button"
                        aria-label={`View notes for ${entry.title}`}
                        onClick={() => openNotes(entry)}
                      >
                        <img className="debt__saved-icon" src={notesIcon} alt="" aria-hidden="true" />
                      </button>
                    )}

                    <div className="debt__saved-actions-row">
                      <button
                        className="debt__saved-icon-btn"
                        type="button"
                        aria-label={`Edit ${entry.title}`}
                        onClick={() => handleOpenEditDebtModal(entry)}
                      >
                        <img className="debt__saved-icon" src={editIcon} alt="" aria-hidden="true" />
                      </button>

                      <button
                        className="debt__saved-icon-btn"
                        type="button"
                        aria-label={`Delete ${entry.title}`}
                        onClick={() => openDeleteDebt(entry)}
                      >
                        <img className="debt__saved-icon" src={deleteIcon} alt="" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddDebtModal
        isOpen={isAddDebtModalOpen}
        onClose={handleCloseAddDebtModal}
        onAddDebt={handleAddDebt}
      />

      <EditDebtModal
        isOpen={isEditDebtModalOpen}
        onClose={handleCloseEditDebtModal}
        debtToEdit={debtToEdit}
        onUpdateDebt={handleUpdateDebt}
      />

      <DebtNotesModal
        isOpen={isNotesOpen}
        onClose={closeNotes}
        title={debtToViewNotes?.title || ""}
        notes={debtToViewNotes?.notes || ""}
      />

      <DeleteModal
        isOpen={isDeleteDebtOpen}
        onClose={closeDeleteDebt}
        onConfirm={confirmDeleteDebt}
        targetName={debtToDelete?.title || ""}
        highlightClassName="debt__highlight"
        confirmButtonClassName="debt__confirm-delete"
      />
    </section>
  );
}

export default Debt;
