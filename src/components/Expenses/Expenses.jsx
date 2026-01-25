import "./Expenses.css";
import { useMemo, useState } from "react";
import ExpensesHeader from "./ExpensesHeader";
import SecondaryNav from "../SecondaryNav/SecondaryNav.jsx";
import addIcon from "../../assets/icons/add-icon.svg";
import editIcon from "../../assets/icons/edit-icon.svg";
import deleteIcon from "../../assets/icons/delete-icon.svg";
import AddExpenseModal from "./modals/AddExpenseModal.jsx";

function Expenses({ getCityDetails }) {
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);

  const [submissionTitle, setSubmissionTitle] = useState("");
  const [submissionItems, setSubmissionItems] = useState([]);

  const [savedGroups, setSavedGroups] = useState([]);

  const handleOpenAddExpenseModal = () => setIsAddExpenseModalOpen(true);
  const handleCloseAddExpenseModal = () => setIsAddExpenseModalOpen(false);

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

  const totalMonthlyExpenses = useMemo(() => {
    return savedGroups.reduce((sum, group) => sum + group.monthlyTotal, 0);
  }, [savedGroups]);

  const handleEditSubmissionItem = (id) => {
    console.log("edit (draft)", id);
  };

  const handleDeleteSubmissionItem = (id) => {
    setSubmissionItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCancelSubmission = () => {
    setSubmissionItems([]);
    setSubmissionTitle("");
  };

  const handleSaveSubmission = () => {
    if (submissionItems.length === 0) return;

    const title = submissionTitle.trim() || "My Bills";
    const monthlyTotal = getMonthlyTotalForItems(submissionItems);

    const newGroup = {
      id: crypto.randomUUID(),
      title,
      items: [...submissionItems],
      monthlyTotal,
      isEstimate: submissionItems.some((item) => item.isEstimate),
    };

    setSavedGroups((prev) => [newGroup, ...prev]);

    setSubmissionItems([]);
    setSubmissionTitle("");
  };

  const handleAddSubmissionItem = (newItem) => {
    setSubmissionItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ...newItem,
      },
    ]);
  };

  const handleEditSavedGroup = (groupId) => {
    console.log("edit saved group", groupId);
  };

  const handleDeleteSavedGroup = (groupId) => {
    setSavedGroups((prev) => prev.filter((group) => group.id !== groupId));
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
              <span className="expenses__summary-currency">$</span>
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

          {savedGroups.length > 0 && (
            <div className="expenses__saved">
              {savedGroups.map((group) => (
                <div key={group.id} className="expenses__saved-group">
                  <div className="expenses__saved-left">
                    <div className="expenses__saved-title">{group.title}</div>
                    <div className="expenses__saved-monthly">
                      {group.isEstimate ? "~" : ""}$
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
                      onClick={() => handleDeleteSavedGroup(group.id)}
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
                        onClick={() => handleDeleteSubmissionItem(item.id)}
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
      </div>

      <AddExpenseModal
        isOpen={isAddExpenseModalOpen}
        onClose={handleCloseAddExpenseModal}
        getCityDetails={getCityDetails}
        onAddExpense={handleAddSubmissionItem}
      />
    </section>
  );
}

export default Expenses;
