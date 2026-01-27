import "./Expenses.css";
import { useMemo, useState } from "react";
import ExpensesHeader from "./ExpensesHeader";
import SecondaryNav from "../SecondaryNav/SecondaryNav.jsx";
import addIcon from "../../assets/icons/add-icon.svg";
import editIcon from "../../assets/icons/edit-icon.svg";
import deleteIcon from "../../assets/icons/delete-icon.svg";
import AddExpenseModal from "./modals/AddExpenseModal.jsx";
import EditExpenseModal from "./modals/EditExpenseModal.jsx";
import DeleteModal from "../Modals/DeleteModal/DeleteModal.jsx";
import ProfileStore from "../../utils/ProfileStore.js";
import useProfileGroups from "../../utils/useProfileGroups.js";

function Expenses({ getCityDetails }) {
  const savedGroups = useProfileGroups("expenses");

  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isEditExpenseModalOpen, setIsEditExpenseModalOpen] = useState(false);

  const [isDeleteGroupOpen, setIsDeleteGroupOpen] = useState(false);
  const [isDeleteItemOpen, setIsDeleteItemOpen] = useState(false);

  const [groupToDelete, setGroupToDelete] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [submissionTitle, setSubmissionTitle] = useState("");
  const [submissionItems, setSubmissionItems] = useState([]);

  const [editingGroupId, setEditingGroupId] = useState(null);

  const [expenseToEdit, setExpenseToEdit] = useState(null);

  const handleOpenAddExpenseModal = () => setIsAddExpenseModalOpen(true);
  const handleCloseAddExpenseModal = () => setIsAddExpenseModalOpen(false);

  const handleOpenEditExpenseModal = (item) => {
    setExpenseToEdit(item);
    setIsEditExpenseModalOpen(true);
  };

  const handleCloseEditExpenseModal = () => {
    setExpenseToEdit(null);
    setIsEditExpenseModalOpen(false);
  };

  const toMonthlyAmount = (amount, frequency) => {
    const num = Number(amount);
    if (Number.isNaN(num)) return 0;

    switch (frequency) {
      case "weekly":
        return (num * 52) / 12;
      case "bi_weekly":
        return (num * 26) / 12;
      case "quarterly":
        return num / 3;
      case "yearly":
        return num / 12;
      case "one_time":
        return num;
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

  const getMonthlyTotalForItems = (items) => {
    return items.reduce((sum, item) => {
      return sum + toMonthlyAmount(item.amount, item.frequency);
    }, 0);
  };

  const hasAnyEstimate = useMemo(() => {
    return savedGroups.some((group) => group.isEstimate);
  }, [savedGroups]);

  const totalMonthlyExpenses = useMemo(() => {
    return savedGroups.reduce((sum, group) => sum + group.monthlyTotal, 0);
  }, [savedGroups]);

  const handleEditSubmissionItem = (id) => {
    const found = submissionItems.find((item) => item.id === id);
    if (!found) return;
    handleOpenEditExpenseModal(found);
  };

  const handleCancelSubmission = () => {
    setSubmissionItems([]);
    setSubmissionTitle("");
    setEditingGroupId(null);
  };

  const openDeleteGroup = (group) => {
    setGroupToDelete(group);
    setIsDeleteGroupOpen(true);
  };

  const closeDeleteGroup = () => {
    setGroupToDelete(null);
    setIsDeleteGroupOpen(false);
  };

  const confirmDeleteGroup = () => {
    if (!groupToDelete) return;

    ProfileStore.setGroups(
      "expenses",
      savedGroups.filter((g) => g.id !== groupToDelete.id),
    );

    if (editingGroupId === groupToDelete.id) {
      handleCancelSubmission();
    }

    closeDeleteGroup();
  };

  const openDeleteItem = (item) => {
    setItemToDelete(item);
    setIsDeleteItemOpen(true);
  };

  const closeDeleteItem = () => {
    setItemToDelete(null);
    setIsDeleteItemOpen(false);
  };

  const confirmDeleteItem = () => {
    if (!itemToDelete) return;

    setSubmissionItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));

    closeDeleteItem();
  };

  const getDefaultGroupTitle = (baseLabel) => {
    const usedTitles = new Set(
      savedGroups.map((group) => (group.title || "").trim()),
    );

    let index = 1;
    let candidate = `${baseLabel} ${index}`;

    while (usedTitles.has(candidate)) {
      index += 1;
      candidate = `${baseLabel} ${index}`;
    }

    return candidate;
  };

  const handleSaveSubmission = () => {
    if (submissionItems.length === 0) return;

    const baseLabel = "Expenses";
    const trimmedTitle = submissionTitle.trim();
    const title = trimmedTitle || getDefaultGroupTitle(baseLabel);

    const monthlyTotal = getMonthlyTotalForItems(submissionItems);
    const isEstimate = submissionItems.some((item) => item.isEstimate);

    if (editingGroupId) {
      const next = savedGroups.map((group) => {
        if (group.id !== editingGroupId) return group;

        return {
          ...group,
          title,
          items: [...submissionItems],
          monthlyTotal,
          isEstimate,
        };
      });

      ProfileStore.setGroups("expenses", next);

      setSubmissionItems([]);
      setSubmissionTitle("");
      setEditingGroupId(null);
      return;
    }

    const newGroup = {
      id: crypto.randomUUID(),
      title,
      items: [...submissionItems],
      monthlyTotal,
      isEstimate,
    };

    ProfileStore.setGroups("expenses", [newGroup, ...savedGroups]);

    setSubmissionItems([]);
    setSubmissionTitle("");
  };

  const handleAddSubmissionItem = (newItem) => {
    setSubmissionItems((prev) => [
      ...prev,
      {
        ...newItem,
        id: newItem.id || crypto.randomUUID(),
      },
    ]);
  };

  const handleUpdateSubmissionItem = (updatedItem) => {
    setSubmissionItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    );
    handleCloseEditExpenseModal();
  };

  const handleEditSavedGroup = (groupId) => {
    const group = savedGroups.find((g) => g.id === groupId);
    if (!group) return;

    setEditingGroupId(group.id);
    setSubmissionTitle(group.title || "");
    setSubmissionItems(Array.isArray(group.items) ? [...group.items] : []);
  };

  return (
    <section className="expenses">
      <div className="expenses__container">
        <ExpensesHeader />
        <SecondaryNav active="expenses" />

        <div className="expenses__content">
          <div className="expenses__summary">
            <h2 className="expenses__summary-title">Total Monthly Expenses:</h2>

            <div className="expenses__summary-row">
              <span className="expenses__summary-currency">
                {hasAnyEstimate ? "~" : ""} $
              </span>
              <span className="expenses__summary-value">
                {formatAmount(totalMonthlyExpenses || 0)}
              </span>
            </div>
          </div>

          <div className="expenses__bar">
            <span className="expenses__bar-text">Add Expenses</span>

            <button
              className="expenses__bar-action"
              type="button"
              aria-label="Add Expenses"
              onClick={handleOpenAddExpenseModal}
            >
              <img
                className="expenses__bar-icon"
                src={addIcon}
                alt=""
                aria-hidden="true"
              />
            </button>
          </div>

          {submissionItems.length > 0 && (
            <div className="expenses__submission">
              <ul className="expenses__submission-list">
                {submissionItems.map((item) => (
                  <li key={item.id} className="expenses__submission-item">
                    <span className="expenses__submission-name">
                      {item.name}
                    </span>

                    <span className="expenses__submission-amount">
                      {item.isEstimate ? "~" : ""}${formatAmount(item.amount)}
                    </span>

                    <div className="expenses__submission-actions">
                      <button
                        className="expenses__submission-icon-btn"
                        type="button"
                        aria-label={`Edit ${item.name}`}
                        onClick={() => handleEditSubmissionItem(item.id)}
                      >
                        <img
                          className="expenses__submission-icon"
                          src={editIcon}
                          alt=""
                          aria-hidden="true"
                        />
                      </button>

                      <button
                        className="expenses__submission-icon-btn"
                        type="button"
                        aria-label={`Delete ${item.name}`}
                        onClick={() => openDeleteItem(item)}
                      >
                        <img
                          className="expenses__submission-icon"
                          src={deleteIcon}
                          alt=""
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="expenses__submission-footer">
                <label
                  className="expenses__submission-label"
                  htmlFor="submissionTitle"
                >
                  Group title (optional)
                </label>

                <input
                  id="submissionTitle"
                  className="expenses__submission-input"
                  type="text"
                  value={submissionTitle}
                  onChange={(evt) => setSubmissionTitle(evt.target.value)}
                  placeholder="Bills"
                />

                <div className="expenses__submission-buttons">
                  <button
                    className="expenses__submission-save"
                    type="button"
                    onClick={handleSaveSubmission}
                  >
                    Save
                  </button>

                  <button
                    className="expenses__submission-cancel"
                    type="button"
                    onClick={handleCancelSubmission}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {savedGroups.length > 0 && (
          <div className="expenses__saved">
            {savedGroups.map((group) => (
              <div key={group.id} className="expenses__saved-group">
                <div className="expenses__saved-left">
                  <div className="expenses__saved-title">{group.title}</div>
                  <div className="expenses__saved-monthly">
                    {group.isEstimate ? "~" : ""} $
                    {formatAmount(group.monthlyTotal)} / month
                  </div>
                </div>

                <div className="expenses__saved-actions">
                  <button
                    className="expenses__saved-icon-btn"
                    type="button"
                    aria-label={`Edit ${group.title}`}
                    onClick={() => handleEditSavedGroup(group.id)}
                  >
                    <img
                      className="expenses__saved-icon"
                      src={editIcon}
                      alt=""
                      aria-hidden="true"
                    />
                  </button>

                  <button
                    className="expenses__saved-icon-btn"
                    type="button"
                    aria-label={`Delete ${group.title}`}
                    onClick={() => openDeleteGroup(group)}
                  >
                    <img
                      className="expenses__saved-icon"
                      src={deleteIcon}
                      alt=""
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddExpenseModal
        isOpen={isAddExpenseModalOpen}
        onClose={handleCloseAddExpenseModal}
        getCityDetails={getCityDetails}
        onAddExpense={handleAddSubmissionItem}
      />

      <EditExpenseModal
        isOpen={isEditExpenseModalOpen}
        onClose={handleCloseEditExpenseModal}
        getCityDetails={getCityDetails}
        expenseToEdit={expenseToEdit}
        onUpdateExpense={handleUpdateSubmissionItem}
      />

      <DeleteModal
        isOpen={isDeleteGroupOpen}
        onClose={closeDeleteGroup}
        onConfirm={confirmDeleteGroup}
        targetName={groupToDelete?.title || ""}
        highlightClassName="expenses__highlight"
        confirmButtonClassName="expenses__confirm-delete"
      />

      <DeleteModal
        isOpen={isDeleteItemOpen}
        onClose={closeDeleteItem}
        onConfirm={confirmDeleteItem}
        targetName={itemToDelete?.name || ""}
        highlightClassName="expenses__highlight"
        confirmButtonClassName="expenses__confirm-delete"
      />
    </section>
  );
}

export default Expenses;
