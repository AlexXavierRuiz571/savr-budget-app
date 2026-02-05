import "./Lifestyle.css";
import { useMemo, useState } from "react";
import LifestyleHeader from "./LifestyleHeader.jsx";
import SecondaryNav from "../SecondaryNav/SecondaryNav.jsx";
import addIcon from "../../assets/icons/add-icon.svg";
import editIcon from "../../assets/icons/edit-icon.svg";
import deleteIcon from "../../assets/icons/delete-icon.svg";
import AddLifestyleModal from "./modals/AddLifestyleModal.jsx";
import EditLifestyleModal from "./modals/EditLifestyleModal.jsx";
import DeleteModal from "../Modals/DeleteModal/DeleteModal.jsx";
import ProfileStore from "../../utils/ProfileStore.js";
import useProfileGroups from "../../utils/useProfileGroups.js";

function Lifestyle({ getCityDetails }) {
  const savedGroups = useProfileGroups("lifestyle");

  const [isAddLifestyleModalOpen, setIsAddLifestyleModalOpen] = useState(false);
  const [isEditLifestyleModalOpen, setIsEditLifestyleModalOpen] =
    useState(false);

  const [isDeleteGroupOpen, setIsDeleteGroupOpen] = useState(false);
  const [isDeleteItemOpen, setIsDeleteItemOpen] = useState(false);

  const [groupToDelete, setGroupToDelete] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [submissionTitle, setSubmissionTitle] = useState("");
  const [submissionItems, setSubmissionItems] = useState([]);

  const [editingGroupId, setEditingGroupId] = useState(null);
  const [lifestyleItemToEdit, setLifestyleItemToEdit] = useState(null);

  const handleOpenAddLifestyleModal = () => setIsAddLifestyleModalOpen(true);
  const handleCloseAddLifestyleModal = () => setIsAddLifestyleModalOpen(false);

  const handleOpenEditLifestyleModal = (item) => {
    setLifestyleItemToEdit(item);
    setIsEditLifestyleModalOpen(true);
  };

  const handleCloseEditLifestyleModal = () => {
    setLifestyleItemToEdit(null);
    setIsEditLifestyleModalOpen(false);
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

  const totalMonthlyLifestyle = useMemo(() => {
    return savedGroups.reduce((sum, group) => sum + group.monthlyTotal, 0);
  }, [savedGroups]);

  const handleEditSubmissionItem = (id) => {
    const found = submissionItems.find((item) => item.id === id);
    if (!found) return;
    handleOpenEditLifestyleModal(found);
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
      "lifestyle",
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

    const baseLabel = "Lifestyle";
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

      ProfileStore.setGroups("lifestyle", next);
      handleCancelSubmission();
      return;
    }

    const newGroup = {
      id: crypto.randomUUID(),
      title,
      items: [...submissionItems],
      monthlyTotal,
      isEstimate,
    };

    ProfileStore.setGroups("lifestyle", [newGroup, ...savedGroups]);
    handleCancelSubmission();
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
    handleCloseEditLifestyleModal();
  };

  const handleEditSavedGroup = (groupId) => {
    const group = savedGroups.find((g) => g.id === groupId);
    if (!group) return;

    setEditingGroupId(group.id);
    setSubmissionTitle(group.title || "");
    setSubmissionItems(Array.isArray(group.items) ? [...group.items] : []);
  };

  return (
    <section className="lifestyle">
      <div className="lifestyle__container">
        <LifestyleHeader />
        <SecondaryNav active="lifestyle" />

        <div className="lifestyle__content">
          <div className="lifestyle__summary">
            <h2 className="lifestyle__summary-title">
              Total Monthly Lifestyle Costs:
            </h2>

            <div className="lifestyle__summary-row">
              <span className="lifestyle__summary-currency">
                {hasAnyEstimate ? "~" : ""} $
              </span>
              <span className="lifestyle__summary-value">
                {formatAmount(totalMonthlyLifestyle || 0)}
              </span>
            </div>
          </div>

          <div className="lifestyle__bar">
            <span className="lifestyle__bar-text">Add Lifestyle Entry</span>

            <button
              className="lifestyle__bar-action"
              type="button"
              aria-label="Add Lifestyle"
              onClick={handleOpenAddLifestyleModal}
            >
              <img
                className="lifestyle__bar-icon"
                src={addIcon}
                alt="Add Lifestyle Entry Icon"
                aria-hidden="true"
              />
            </button>
          </div>

          {submissionItems.length > 0 && (
            <div className="lifestyle__submission">
              <ul className="lifestyle__submission-list">
                {submissionItems.map((item) => (
                  <li key={item.id} className="lifestyle__submission-item">
                    <span className="lifestyle__submission-name">
                      {item.name}
                    </span>

                    <span className="lifestyle__submission-amount">
                      {item.isEstimate ? "~" : ""}${formatAmount(item.amount)}
                    </span>

                    <div className="lifestyle__submission-actions">
                      <button
                        className="lifestyle__submission-icon-btn"
                        type="button"
                        aria-label={`Edit ${item.name}`}
                        onClick={() => handleEditSubmissionItem(item.id)}
                      >
                        <img
                          className="lifestyle__submission-icon"
                          src={editIcon}
                          alt="Edit Icon"
                          aria-hidden="true"
                        />
                      </button>

                      <button
                        className="lifestyle__submission-icon-btn"
                        type="button"
                        aria-label={`Delete ${item.name}`}
                        onClick={() => openDeleteItem(item)}
                      >
                        <img
                          className="lifestyle__submission-icon"
                          src={deleteIcon}
                          alt="Delete Icon"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="lifestyle__submission-footer">
                <label
                  className="lifestyle__submission-label"
                  htmlFor="lifestyleSubmissionTitle"
                >
                  Group title (optional)
                </label>

                <input
                  id="lifestyleSubmissionTitle"
                  className="lifestyle__submission-input"
                  type="text"
                  value={submissionTitle}
                  onChange={(evt) => setSubmissionTitle(evt.target.value)}
                  placeholder="Lifestyle"
                />

                <div className="lifestyle__submission-buttons">
                  <button
                    className="lifestyle__submission-save"
                    type="button"
                    onClick={handleSaveSubmission}
                  >
                    Save
                  </button>

                  <button
                    className="lifestyle__submission-cancel"
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
          <div className="lifestyle__saved">
            {savedGroups.map((group) => (
              <div key={group.id} className="lifestyle__saved-group">
                <div className="lifestyle__saved-left">
                  <div className="lifestyle__saved-title">{group.title}</div>
                  <div className="lifestyle__saved-monthly">
                    {group.isEstimate ? "~" : ""} $
                    {formatAmount(group.monthlyTotal)} / month
                  </div>
                </div>

                <div className="lifestyle__saved-actions">
                  <button
                    className="lifestyle__saved-icon-btn"
                    type="button"
                    aria-label={`Edit ${group.title}`}
                    onClick={() => handleEditSavedGroup(group.id)}
                  >
                    <img
                      className="lifestyle__saved-icon"
                      src={editIcon}
                      alt="Edit Icon"
                      aria-hidden="true"
                    />
                  </button>

                  <button
                    className="lifestyle__saved-icon-btn"
                    type="button"
                    aria-label={`Delete ${group.title}`}
                    onClick={() => openDeleteGroup(group)}
                  >
                    <img
                      className="lifestyle__saved-icon"
                      src={deleteIcon}
                      alt="Delete Icon"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddLifestyleModal
        isOpen={isAddLifestyleModalOpen}
        onClose={handleCloseAddLifestyleModal}
        getCityDetails={getCityDetails}
        onAddLifestyle={handleAddSubmissionItem}
      />

      <EditLifestyleModal
        isOpen={isEditLifestyleModalOpen}
        onClose={handleCloseEditLifestyleModal}
        getCityDetails={getCityDetails}
        lifestyleToEdit={lifestyleItemToEdit}
        onUpdateLifestyle={handleUpdateSubmissionItem}
      />

      <DeleteModal
        isOpen={isDeleteGroupOpen}
        onClose={closeDeleteGroup}
        onConfirm={confirmDeleteGroup}
        targetName={groupToDelete?.title || ""}
        highlightClassName="lifestyle__highlight"
        confirmButtonClassName="lifestyle__confirm-delete"
      />

      <DeleteModal
        isOpen={isDeleteItemOpen}
        onClose={closeDeleteItem}
        onConfirm={confirmDeleteItem}
        targetName={itemToDelete?.name || ""}
        highlightClassName="lifestyle__highlight"
        confirmButtonClassName="lifestyle__confirm-delete"
      />
    </section>
  );
}

export default Lifestyle;
