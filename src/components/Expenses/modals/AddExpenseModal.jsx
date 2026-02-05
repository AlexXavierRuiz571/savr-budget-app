import "./AddExpenseModal.css";
import { useEffect, useMemo, useState } from "react";
import ModalWithForm from "../../Modals/ModalWithForm/ModalWithForm.jsx";
import Preloader from "../../Preloader/Preloader.jsx";
import { CITY_OPTIONS } from "../../../utils/cities.js";
import { expenseGoodIds } from "../../../utils/goodIds.js";

const EXPENSE_TYPES = [
  { label: "Housing", value: "housing" },
  { label: "Utilities", value: "utilities" },
  { label: "Transportation", value: "transportation" },
  { label: "Food", value: "food" },
  { label: "Other", value: "other" },
];

const TRANSPORT_TYPES = [
  { label: "Public Transit", value: "public_transit" },
  { label: "Personal Vehicle", value: "personal_vehicle" },
  { label: "Bicycle", value: "bicycle" },
  { label: "Other", value: "other" },
];

function AddExpenseModal({ isOpen, onClose, getCityDetails, onAddExpense }) {
  const [cityId, setCityId] = useState("");

  const [expenseType, setExpenseType] = useState("");
  const [transportType, setTransportType] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("");
  const [isVariable, setIsVariable] = useState(null);

  const [hasLoadedEstimates, setHasLoadedEstimates] = useState(false);
  const [isLoadingEstimates, setIsLoadingEstimates] = useState(false);
  const [estimateError, setEstimateError] = useState("");
  const [cityDetails, setCityDetails] = useState(null);
  const [selectedGoodId, setSelectedGoodId] = useState("");

  const isLocationSet = Boolean(cityId);

  const resetEstimates = () => {
    setHasLoadedEstimates(false);
    setIsLoadingEstimates(false);
    setEstimateError("");
    setCityDetails(null);
    setSelectedGoodId("");
  };

  const resetForm = () => {
    setCityId("");
    setExpenseType("");
    setTransportType("");
    setExpenseName("");
    setAmount("");
    setFrequency("");
    setIsVariable(null);
    resetEstimates();
  };

  const handleLocationChange = (evt) => {
    setCityId(evt.target.value);
    resetEstimates();
  };

  const handleExpenseTypeChange = (evt) => {
    const next = evt.target.value;
    setExpenseType(next);
    resetEstimates();

    if (next !== "transportation") {
      setTransportType("");
    }
  };

  const filteredItems = useMemo(() => {
    if (!hasLoadedEstimates || !cityDetails || !expenseType) return [];

    const allowed = expenseGoodIds[expenseType] || [];
    const allowedSet = new Set(allowed);

    const prices = Array.isArray(cityDetails.prices) ? cityDetails.prices : [];

    return prices
      .filter((price) => allowedSet.has(price.good_id))
      .map((price) => ({
        goodId: String(price.good_id),
        name: price.item_name,
        min: price.usd?.min ?? price.min ?? "",
        avg: price.usd?.avg ?? price.avg ?? "",
        max: price.usd?.max ?? price.max ?? "",
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [hasLoadedEstimates, cityDetails, expenseType]);

  const selectedItem = useMemo(() => {
    if (!selectedGoodId) return null;
    return filteredItems.find((i) => i.goodId === selectedGoodId) || null;
  }, [filteredItems, selectedGoodId]);

  useEffect(() => {
    if (!hasLoadedEstimates) return;

    if (!expenseType || filteredItems.length === 0) {
      setSelectedGoodId("");
      return;
    }

    const stillValid = filteredItems.some((i) => i.goodId === selectedGoodId);
    if (!stillValid) {
      setSelectedGoodId(filteredItems[0].goodId);
    }
  }, [hasLoadedEstimates, expenseType, filteredItems, selectedGoodId]);

  const handleLoadEstimates = async () => {
    if (!cityId || !expenseType) return;

    setIsLoadingEstimates(true);
    setEstimateError("");

    try {
      const data = await getCityDetails(cityId);
      setCityDetails(data);
      setHasLoadedEstimates(true);
    } catch {
      setEstimateError("No estimates could be loaded.");
      setHasLoadedEstimates(false);
      setCityDetails(null);
      setSelectedGoodId("");
    } finally {
      setIsLoadingEstimates(false);
    }
  };

  const formatMoney = (value) => {
    if (value === "" || value === null || value === undefined) return "__";
    const num = Number(value);
    if (Number.isNaN(num)) return "__";
    return num.toFixed(2);
  };

  const canSubmit =
    isLocationSet &&
    expenseType &&
    expenseName.trim() &&
    amount !== "" &&
    frequency &&
    isVariable !== null &&
    (expenseType !== "transportation" || transportType);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!canSubmit) return;

    if (typeof onAddExpense === "function") {
      onAddExpense({
        id: crypto.randomUUID(),
        name: expenseName.trim(),
        amount: Number(amount),
        frequency,
        isEstimate: isVariable === true,
        expenseType,
        transportType: expenseType === "transportation" ? transportType : "",
        isVariable,
        cityId,
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
      title="Add Expenses"
      onClose={handleClose}
      onSubmit={handleSubmit}
      className="expenses-modal"
      showDefaultActions={false}
      footerContent={
        <>
          <button
            className="add-expense__submit"
            type="submit"
            disabled={!canSubmit}
          >
            Submit
          </button>

          <button
            className="add-expense__cancel"
            type="button"
            onClick={handleClose}
          >
            Cancel
          </button>
        </>
      }
      headerContent={
        <div className="add-expense__location">
          <label className="add-expense__label">
            Location <span className="add-expense__required">*</span>
          </label>

          <select
            className="add-expense__select"
            value={cityId}
            onChange={handleLocationChange}
            required
          >
            <option value="">City, State</option>
            {CITY_OPTIONS.map((c) => (
              <option key={c.cityId} value={c.cityId}>
                {c.label}
              </option>
            ))}
          </select>

          {!cityId && (
            <p className="add-expense__placeholder">
              Select a location to continue.
            </p>
          )}
        </div>
      }
    >
      {isLocationSet && (
        <div className="add-expense__grid">
          <div className="add-expense__left">
            <label className="add-expense__label">
              Expense Type <span className="add-expense__required">*</span>
            </label>
            <select
              className="add-expense__select"
              value={expenseType}
              onChange={handleExpenseTypeChange}
              required
            >
              <option value="">Select type</option>
              {EXPENSE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>

            {expenseType === "transportation" && (
              <>
                <label className="add-expense__label">
                  Transport Type{" "}
                  <span className="add-expense__required">*</span>
                </label>
                <select
                  className="add-expense__select"
                  value={transportType}
                  onChange={(evt) => setTransportType(evt.target.value)}
                  required
                >
                  <option value="">Select method</option>
                  {TRANSPORT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </>
            )}

            <label className="add-expense__label">
              Expense Name <span className="add-expense__required">*</span>
            </label>
            <input
              className="add-expense__input"
              type="text"
              value={expenseName}
              onChange={(evt) => setExpenseName(evt.target.value)}
              placeholder="Must be typed"
              required
            />

            <label className="add-expense__label">
              Amount <span className="add-expense__required">*</span>
            </label>
            <input
              className="add-expense__input"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(evt) => setAmount(evt.target.value)}
              required
            />

            <label className="add-expense__label">
              Fixed or Variable <span className="add-expense__required">*</span>
            </label>
            <div className="add-expense__radio-row">
              <label className="add-expense__radio">
                <input
                  type="radio"
                  name="fixedVariable"
                  checked={isVariable === false}
                  onChange={() => setIsVariable(false)}
                />
                Fixed
              </label>

              <label className="add-expense__radio">
                <input
                  type="radio"
                  name="fixedVariable"
                  checked={isVariable === true}
                  onChange={() => setIsVariable(true)}
                />
                Variable
              </label>
            </div>

            <label className="add-expense__label">
              Frequency <span className="add-expense__required">*</span>
            </label>
            <select
              className="add-expense__select"
              value={frequency}
              onChange={(evt) => setFrequency(evt.target.value)}
              required
            >
              <option value="">Select frequency</option>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="bi_weekly">Bi-weekly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="one_time">One-time</option>
            </select>
          </div>

          <div className="add-expense__right">
            <button
              className="add-expense__estimate-button"
              type="button"
              onClick={handleLoadEstimates}
              disabled={!cityId || !expenseType || isLoadingEstimates}
            >
              {isLoadingEstimates ? "Loading..." : "Load Estimates"}
            </button>

            {isLoadingEstimates && <Preloader />}

            {estimateError ? (
              <p className="add-expense__error">{estimateError}</p>
            ) : !hasLoadedEstimates ? (
              <p className="add-expense__placeholder">
                No estimates have been loaded.
              </p>
            ) : !expenseType ? (
              <p className="add-expense__placeholder">
                Select an expense type to see estimates.
              </p>
            ) : filteredItems.length === 0 ? (
              <p className="add-expense__placeholder">
                No estimate items found for this type.
              </p>
            ) : (
              <>
                <label className="add-expense__estimate-label">
                  Estimate Item
                </label>
                <select
                  className="add-expense__select"
                  value={selectedGoodId}
                  onChange={(evt) => setSelectedGoodId(evt.target.value)}
                >
                  {filteredItems.map((item) => (
                    <option key={item.goodId} value={item.goodId}>
                      {item.name}
                    </option>
                  ))}
                </select>

                {selectedItem ? (
                  <div className="add-expense__ranges">
                    <div className="add-expense__range-row">
                      <span>Low</span>
                      <span>
                        ~ {formatMoney(selectedItem.min)}
                      </span>
                    </div>

                    <div className="add-expense__range-row">
                      <span>Mid</span>
                      <span>
                        ~ {formatMoney(selectedItem.avg)}
                      </span>
                    </div>

                    <div className="add-expense__range-row">
                      <span>High</span>
                      <span>
                        ~ {formatMoney(selectedItem.max)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="add-expense__placeholder">
                    Select an estimate item to see ranges.
                  </p>
                )}

                <div className="add-expense__disclaimer">
                  <p className="add-expense__disclaimer-text">
                    Estimates are based on average costs for the selected
                    location and may vary.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </ModalWithForm>
  );
}

export default AddExpenseModal;
