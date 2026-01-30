import "./Savings.css";
import { useMemo, useState } from "react";
import SavingsHeader from "./SavingsHeader.jsx";
import SecondaryNav from "../SecondaryNav/SecondaryNav.jsx";
import addIcon from "../../assets/icons/add-icon.svg";
import editIcon from "../../assets/icons/edit-icon.svg";
import deleteIcon from "../../assets/icons/delete-icon.svg";
import notesIcon from "../../assets/icons/notes-icon.svg";
import AddSavingsModal from "./modals/AddSavingsModal.jsx";
import EditSavingsModal from "./modals/EditSavingsModal.jsx";
import SavingsNotesModal from "./modals/SavingsNotesModal.jsx";
import DeleteModal from "../Modals/DeleteModal/DeleteModal.jsx";
import ProfileStore from "../../utils/ProfileStore.js";
import useProfileGroups from "../../utils/useProfileGroups.js";

function Savings() {
  const savedSavings = useProfileGroups("savings");

  const [isAddSavingsModalOpen, setIsAddSavingsModalOpen] = useState(false);
  const [isEditSavingsModalOpen, setIsEditSavingsModalOpen] = useState(false);
  const [isDeleteSavingsOpen, setIsDeleteSavingsOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const [savingsToEdit, setSavingsToEdit] = useState(null);
  const [savingsToDelete, setSavingsToDelete] = useState(null);
  const [savingsToViewNotes, setSavingsToViewNotes] = useState(null);

  const handleOpenAddSavingsModal = () => setIsAddSavingsModalOpen(true);
  const handleCloseAddSavingsModal = () => setIsAddSavingsModalOpen(false);

  const handleOpenEditSavingsModal = (entry) => {
    setSavingsToEdit(entry);
    setIsEditSavingsModalOpen(true);
  };

  const handleCloseEditSavingsModal = () => {
    setSavingsToEdit(null);
    setIsEditSavingsModalOpen(false);
  };

  const openDeleteSavings = (entry) => {
    setSavingsToDelete(entry);
    setIsDeleteSavingsOpen(true);
  };

  const closeDeleteSavings = () => {
    setSavingsToDelete(null);
    setIsDeleteSavingsOpen(false);
  };

  const confirmDeleteSavings = () => {
    if (!savingsToDelete) return;

    ProfileStore.setGroups(
      "savings",
      savedSavings.filter((entry) => entry.id !== savingsToDelete.id),
    );

    closeDeleteSavings();
  };

  const openNotes = (entry) => {
    setSavingsToViewNotes(entry);
    setIsNotesOpen(true);
  };

  const closeNotes = () => {
    setSavingsToViewNotes(null);
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

  const getDefaultSavingsTitle = () => {
    const usedTitles = new Set(
      savedSavings.map((entry) => (entry.title || "").trim()),
    );

    let index = 1;
    let candidate = `Savings ${index}`;

    while (usedTitles.has(candidate)) {
      index += 1;
      candidate = `Savings ${index}`;
    }

    return candidate;
  };

  const totalMonthlySavings = useMemo(() => {
    return savedSavings.reduce(
      (sum, entry) => sum + (Number(entry.monthlyTotal) || 0),
      0,
    );
  }, [savedSavings]);

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

  const handleAddSavings = (newEntry) => {
    const trimmedTitle = (newEntry.title || "").trim();
    const title = trimmedTitle || getDefaultSavingsTitle();

    const monthlyTotal = sanitizeAmount(newEntry.amount);
    const notes = sanitizeNotes(newEntry.notes);

    const entryToSave = {
      id: newEntry.id || crypto.randomUUID(),
      title,
      amount: monthlyTotal,
      monthlyTotal,
      notes,
      items: [],
      isEstimate: false,
    };

    ProfileStore.setGroups("savings", [entryToSave, ...savedSavings]);
  };

  const handleUpdateSavings = (updatedEntry) => {
    if (!updatedEntry?.id) return;

    const next = savedSavings.map((entry) => {
      if (entry.id !== updatedEntry.id) return entry;

      const trimmedTitle = (updatedEntry.title || "").trim();
      const title = trimmedTitle || entry.title || getDefaultSavingsTitle();

      const monthlyTotal = sanitizeAmount(updatedEntry.amount);
      const notes = sanitizeNotes(updatedEntry.notes);

      return {
        ...entry,
        title,
        amount: monthlyTotal,
        monthlyTotal,
        notes,
      };
    });

    ProfileStore.setGroups("savings", next);
    handleCloseEditSavingsModal();
  };

  const hasNotes = (entry) => Boolean((entry?.notes || "").trim());

  return (
    <section className="savings">
      <div className="savings__container">
        <SavingsHeader />
        <SecondaryNav active="savings" />

        <div className="savings__content">
          <div className="savings__summary">
            <h2 className="savings__summary-title">Total Monthly Savings:</h2>

            <div className="savings__summary-row">
              <span className="savings__summary-currency">$</span>
              <span className="savings__summary-value">
                {formatAmount(totalMonthlySavings || 0)}
              </span>
            </div>
          </div>

          <div className="savings__bar">
            <span className="savings__bar-text">Add Savings</span>
            <button
              className="savings__bar-action"
              type="button"
              aria-label="Add Savings"
              onClick={handleOpenAddSavingsModal}
            >
              <img className="savings__bar-icon" src={addIcon} alt="" aria-hidden="true" />
            </button>
          </div>

          {savedSavings.length > 0 && (
            <div className="savings__saved">
              {savedSavings.map((entry) => (
                <div key={entry.id} className="savings__saved-entry">
                  <div className="savings__saved-left">
                    <div className="savings__saved-title">{entry.title}</div>
                    <div className="savings__saved-amount">
                      ${formatAmount(entry.monthlyTotal || 0)} / month
                    </div>
                  </div>

                  <div className="savings__saved-actions">
                    {hasNotes(entry) && (
                      <button
                        className="savings__saved-icon-btn"
                        type="button"
                        aria-label={`View notes for ${entry.title}`}
                        onClick={() => openNotes(entry)}
                      >
                        <img className="savings__saved-icon" src={notesIcon} alt="" aria-hidden="true" />
                      </button>
                    )}

                    <div className="savings__saved-actions-row">
                      <button
                        className="savings__saved-icon-btn"
                        type="button"
                        aria-label={`Edit ${entry.title}`}
                        onClick={() => handleOpenEditSavingsModal(entry)}
                      >
                        <img className="savings__saved-icon" src={editIcon} alt="" aria-hidden="true" />
                      </button>

                      <button
                        className="savings__saved-icon-btn"
                        type="button"
                        aria-label={`Delete ${entry.title}`}
                        onClick={() => openDeleteSavings(entry)}
                      >
                        <img className="savings__saved-icon" src={deleteIcon} alt="" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddSavingsModal
        isOpen={isAddSavingsModalOpen}
        onClose={handleCloseAddSavingsModal}
        onAddSavings={handleAddSavings}
      />

      <EditSavingsModal
        isOpen={isEditSavingsModalOpen}
        onClose={handleCloseEditSavingsModal}
        savingsToEdit={savingsToEdit}
        onUpdateSavings={handleUpdateSavings}
      />

      <SavingsNotesModal
        isOpen={isNotesOpen}
        onClose={closeNotes}
        title={savingsToViewNotes?.title || ""}
        notes={savingsToViewNotes?.notes || ""}
      />

      <DeleteModal
        isOpen={isDeleteSavingsOpen}
        onClose={closeDeleteSavings}
        onConfirm={confirmDeleteSavings}
        targetName={savingsToDelete?.title || ""}
        highlightClassName="savings__highlight"
        confirmButtonClassName="savings__confirm-delete"
      />
    </section>
  );
}

export default Savings;
