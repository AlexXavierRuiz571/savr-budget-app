import "./AddLifestyleModal.css";
import { useEffect, useMemo, useState } from "react";
import ModalWithForm from "../../Modals/ModalWithForm/ModalWithForm.jsx";
import Preloader from "../../Preloader/Preloader.jsx";
import { lifestyleGoodIds } from "../../../utils/goodIds.js";

const CITY_OPTIONS = [
  { cityId: "2746", label: "Pensacola, FL" },
  { cityId: "2701", label: "New York, NY" },
  { cityId: "2334", label: "Austin, TX" },
];

const LIFESTYLE_TYPES = [
  { label: "Dining Out", value: "dining_out" },
  { label: "Travel", value: "travel" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Subscriptions", value: "subscriptions" },
  { label: "Hobbies", value: "hobbies" },
  { label: "Other", value: "other" },
];

const TRAVEL_DESTINATIONS = [
  { value: "domestic_us", label: "United States (Domestic)" },
  { value: "caribbean", label: "Caribbean" },
  { value: "mexico_central_america", label: "Mexico / Central America" },
  { value: "europe", label: "Europe" },
  { value: "asia", label: "Asia" },
];

const TRAVEL_TABLE = {
  domestic_us: { low: 200, mid: 350, high: 650 },
  caribbean: { low: 250, mid: 450, high: 800 },
  mexico_central_america: { low: 230, mid: 420, high: 760 },
  europe: { low: 350, mid: 600, high: 1100 },
  asia: { low: 380, mid: 680, high: 1250 },
};

const BENCHMARK_TABLE = {
  subscriptions: { low: 25, mid: 60, high: 120 },
  hobbies: { low: 40, mid: 120, high: 250 },
  other: { low: 50, mid: 150, high: 300 },
};

const SUMMARY_COPY = {
  dining_out: {
    line1: "Based on typical spending in {State}",
    line2: "Your entered amount always overrides this estimate",
  },
  entertainment: {
    line1: "Based on typical spending in {State}",
    line2: "Your entered amount always overrides this estimate",
  },
  travel: {
    line1: "Based on average travel spending",
    line2: "Shown as a monthly equivalent",
    line3: "Your entered amount always overrides this estimate",
  },
  subscriptions: {
    line1: "Based on typical subscription costs",
    line2: "Your entered amount always overrides this estimate",
  },
  hobbies: {
    line1: "~ Broad benchmark for hobby spending",
    line2: "Your entered amount always overrides this estimate",
  },
  other: {
    line1: "~ General discretionary spending benchmark",
    line2: "Your entered amount always overrides this estimate",
  },
};

// IMPORTANT: normalize whatever was saved into what the UI expects
const normalizeLifestyleType = (raw) => {
  if (!raw) return "";
  if (raw === "diningOut") return "dining_out";
  return raw;
};

const getGoodIdsKey = (type) => {
  if (type === "dining_out") return "diningOut";
  return type;
};

const getCityLabelById = (id) => {
  if (!id) return "";
  const found = CITY_OPTIONS.find((c) => String(c.cityId) === String(id));
  return found?.label || "";
};

function EditLifestyleModal({
  isOpen,
  onClose,
  getCityDetails,
  lifestyleToEdit,
  onUpdateLifestyle,
}) {
  const [lifestyleType, setLifestyleType] = useState("");
  const [cityId, setCityId] = useState("");
  const [destination, setDestination] = useState("");

  // User inputs
  const [itemName, setItemName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("");

  // Estimates
  const [hasLoadedEstimates, setHasLoadedEstimates] = useState(false);
  const [isLoadingEstimates, setIsLoadingEstimates] = useState(false);
  const [estimateError, setEstimateError] = useState("");
  const [cityDetails, setCityDetails] = useState(null);
  const [selectedGoodId, setSelectedGoodId] = useState("");

  const isDiningOrEntertainment =
    lifestyleType === "dining_out" || lifestyleType === "entertainment";
  const isTravel = lifestyleType === "travel";
  const isBenchmarkType =
    lifestyleType === "subscriptions" ||
    lifestyleType === "hobbies" ||
    lifestyleType === "other";

  const destinationLabel = useMemo(() => {
    if (!destination) return "";
    const found = TRAVEL_DESTINATIONS.find((d) => d.value === destination);
    return found?.label || "";
  }, [destination]);

  const resetEstimates = () => {
    setHasLoadedEstimates(false);
    setIsLoadingEstimates(false);
    setEstimateError("");
    setCityDetails(null);
    // keep selectedGoodId unless we explicitly change type/location
  };

  const resetForm = () => {
    setLifestyleType("");
    setCityId("");
    setDestination("");
    setItemName("");
    setAmount("");
    setFrequency("");
    setSelectedGoodId("");
    resetEstimates();
  };

  // Prefill when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (!lifestyleToEdit) {
      resetForm();
      return;
    }

    // FIX: normalize saved type so the UI logic matches and the form renders
    const nextType = normalizeLifestyleType(lifestyleToEdit.lifestyleType || "");
    const nextCityId = String(lifestyleToEdit.cityId || "");
    const nextDestination = lifestyleToEdit.destination || "";

    setLifestyleType(nextType);
    setCityId(nextCityId);
    setDestination(nextDestination);

    setItemName(lifestyleToEdit.name || "");
    setAmount(
      lifestyleToEdit.amount === 0 || lifestyleToEdit.amount
        ? String(lifestyleToEdit.amount)
        : "",
    );
    setFrequency(lifestyleToEdit.frequency || "");

    setSelectedGoodId(
      lifestyleToEdit.selectedGoodId
        ? String(lifestyleToEdit.selectedGoodId)
        : "",
    );

    resetEstimates();
  }, [isOpen, lifestyleToEdit]);

  const handleTypeChange = (evt) => {
    const next = evt.target.value;
    setLifestyleType(next);
    setCityId("");
    setDestination("");
    setSelectedGoodId("");
    resetEstimates();
  };

  const handleLocationChange = (evt) => {
    setCityId(evt.target.value);
    resetEstimates();
  };

  const handleDestinationChange = (evt) => {
    setDestination(evt.target.value);
    resetEstimates();
  };

  const filteredItems = useMemo(() => {
    if (!hasLoadedEstimates || !cityDetails || !isDiningOrEntertainment)
      return [];

    const key = getGoodIdsKey(lifestyleType);
    const allowedRaw = lifestyleGoodIds?.[key] || [];
    const allowedSet = new Set(allowedRaw.map((id) => String(id)));

    const prices = Array.isArray(cityDetails.prices) ? cityDetails.prices : [];

    return prices
      .filter((price) => allowedSet.has(String(price.good_id)))
      .map((price) => ({
        goodId: String(price.good_id),
        name: price.item_name,
        min: price.usd?.min ?? price.min ?? "",
        avg: price.usd?.avg ?? price.avg ?? "",
        max: price.usd?.max ?? price.max ?? "",
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [hasLoadedEstimates, cityDetails, isDiningOrEntertainment, lifestyleType]);

  const selectedItem = useMemo(() => {
    if (!selectedGoodId) return null;
    return (
      filteredItems.find((i) => i.goodId === String(selectedGoodId)) || null
    );
  }, [filteredItems, selectedGoodId]);

  useEffect(() => {
    if (!hasLoadedEstimates) return;
    if (!isDiningOrEntertainment) return;

    if (filteredItems.length === 0) {
      setSelectedGoodId("");
      return;
    }

    if (!selectedGoodId) {
      setSelectedGoodId(filteredItems[0].goodId);
      return;
    }

    const stillValid = filteredItems.some((i) => i.goodId === selectedGoodId);
    if (!stillValid) {
      setSelectedGoodId(filteredItems[0].goodId);
    }
  }, [
    hasLoadedEstimates,
    isDiningOrEntertainment,
    filteredItems,
    selectedGoodId,
  ]);

  const formatMoney = (value) => {
    if (value === "" || value === null || value === undefined) return "__";
    const num = Number(value);
    if (Number.isNaN(num)) return "__";
    return num.toFixed(2);
  };

  const showEstimateTilde = true;

  const estimateRanges = useMemo(() => {
    if (isDiningOrEntertainment) {
      if (!selectedItem) return null;
      return {
        low: selectedItem.min,
        mid: selectedItem.avg,
        high: selectedItem.max,
      };
    }

    if (isTravel) {
      if (!destination) return null;
      const row = TRAVEL_TABLE[destination];
      if (!row) return null;
      return { low: row.low, mid: row.mid, high: row.high };
    }

    if (isBenchmarkType) {
      const row = BENCHMARK_TABLE[lifestyleType];
      if (!row) return null;
      return { low: row.low, mid: row.mid, high: row.high };
    }

    return null;
  }, [
    isDiningOrEntertainment,
    selectedItem,
    isTravel,
    destination,
    isBenchmarkType,
    lifestyleType,
  ]);

  const getSummaryLines = () => {
    const copy = SUMMARY_COPY[lifestyleType];
    if (!copy) return [];

    const stateText = (() => {
      if (isTravel) return destinationLabel?.trim() || "your area";

      if (isDiningOrEntertainment) {
        const labelFromDropdown = getCityLabelById(cityId);
        if (labelFromDropdown) return labelFromDropdown;

        const cityFromApi =
          cityDetails?.city?.city || cityDetails?.city?.name || "";
        const stateFromApi =
          cityDetails?.city?.state ||
          cityDetails?.city?.region ||
          cityDetails?.city?.country ||
          "";

        const combined = [cityFromApi, stateFromApi].filter(Boolean).join(", ");
        return combined || "your area";
      }

      return "your area";
    })();

    return Object.values(copy).map((line) =>
      line.replace("{State}", stateText),
    );
  };

  const canLoadEstimates = (() => {
    if (!lifestyleType) return false;
    if (isDiningOrEntertainment) return Boolean(cityId);
    if (isTravel) return Boolean(destination);
    if (isBenchmarkType) return true;
    return false;
  })();

  const canSubmit = (() => {
    if (!lifestyleType) return false;

    const hasCore = itemName.trim() && amount !== "" && frequency;
    if (!hasCore) return false;

    if (isDiningOrEntertainment) return Boolean(cityId);
    if (isTravel) return Boolean(destination);
    if (isBenchmarkType) return true;

    return false;
  })();

  const handleLoadEstimates = async () => {
    if (!canLoadEstimates) return;

    setIsLoadingEstimates(true);
    setEstimateError("");

    if (isDiningOrEntertainment) {
      try {
        const data = await getCityDetails(cityId);
        setCityDetails(data);
        setHasLoadedEstimates(true);
      } catch (err) {
        setEstimateError("No estimates could be loaded.");
        setHasLoadedEstimates(false);
        setCityDetails(null);
        setSelectedGoodId("");
      } finally {
        setIsLoadingEstimates(false);
      }
      return;
    }

    setCityDetails(null);
    setHasLoadedEstimates(true);
    setIsLoadingEstimates(false);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!canSubmit) return;
    if (!lifestyleToEdit) return;

    if (typeof onUpdateLifestyle === "function") {
      onUpdateLifestyle({
        ...lifestyleToEdit,
        lifestyleType,
        name: itemName.trim(),
        amount: Number(amount),
        frequency,
        isEstimate: true,
        cityId: isDiningOrEntertainment ? cityId : "",
        destination: isTravel ? destination : "",
        selectedGoodId: isDiningOrEntertainment ? selectedGoodId : "",
      });
    }

    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // FIX: title uses the actual saved item name like Expenses
  const modalTitle = (
    <>
      Edit{" "}
      <span className="lifestyle__title-highlight">
        {lifestyleToEdit?.name || itemName || "Lifestyle Item"}
      </span>
    </>
  );

  return (
    <ModalWithForm
      isOpen={isOpen}
      title={modalTitle}
      onClose={handleClose}
      onSubmit={handleSubmit}
      className="lifestyle-modal"
      showDefaultActions={false}
      footerContent={
        <>
          <button
            className="add-lifestyle__submit"
            type="submit"
            disabled={!canSubmit}
          >
            Submit
          </button>

          <button
            className="add-lifestyle__cancel"
            type="button"
            onClick={handleClose}
          >
            Cancel
          </button>
        </>
      }
      headerContent={
        <div className="add-lifestyle__type">
          <label className="add-lifestyle__label">
            Lifestyle Type <span className="add-lifestyle__required">*</span>
          </label>

          <select
            className="add-lifestyle__select"
            value={lifestyleType}
            onChange={handleTypeChange}
            required
            disabled={isLoadingEstimates}
          >
            <option value="">Select lifestyle type</option>
            {LIFESTYLE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      }
    >
      {lifestyleType && (
        <div className="add-lifestyle__grid">
          <div className="add-lifestyle__left">
            {isDiningOrEntertainment && (
              <>
                <label className="add-lifestyle__label">
                  Location <span className="add-lifestyle__required">*</span>
                </label>

                <select
                  className="add-lifestyle__select"
                  value={cityId}
                  onChange={handleLocationChange}
                  required
                  disabled={isLoadingEstimates}
                >
                  <option value="">City, State</option>
                  {CITY_OPTIONS.map((c) => (
                    <option key={c.cityId} value={c.cityId}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </>
            )}

            {isTravel && (
              <>
                <label className="add-lifestyle__label">
                  Destination <span className="add-lifestyle__required">*</span>
                </label>

                <select
                  className="add-lifestyle__select"
                  value={destination}
                  onChange={handleDestinationChange}
                  required
                  disabled={isLoadingEstimates}
                >
                  <option value="">Country/Region</option>
                  {TRAVEL_DESTINATIONS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </>
            )}

            <label className="add-lifestyle__label">
              Amount <span className="add-lifestyle__required">*</span>
            </label>
            <input
              className="add-lifestyle__input"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(evt) => setAmount(evt.target.value)}
              placeholder="Enter amount"
              required
              disabled={isLoadingEstimates}
            />

            <label className="add-lifestyle__label">
              Frequency <span className="add-lifestyle__required">*</span>
            </label>
            <select
              className="add-lifestyle__select"
              value={frequency}
              onChange={(evt) => setFrequency(evt.target.value)}
              required
              disabled={isLoadingEstimates}
            >
              <option value="">Select frequency</option>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="bi_weekly">Bi-weekly</option>
              <option value="yearly">Yearly</option>
            </select>

            <label className="add-lifestyle__label">
              Lifestyle Item Name{" "}
              <span className="add-lifestyle__required">*</span>
            </label>
            <input
              className="add-lifestyle__input"
              type="text"
              value={itemName}
              onChange={(evt) => setItemName(evt.target.value)}
              placeholder="Ex: Out to Eat, Movies"
              required
              disabled={isLoadingEstimates}
            />
          </div>

          <div className="add-lifestyle__right">
            <button
              className="add-lifestyle__estimate-button"
              type="button"
              onClick={handleLoadEstimates}
              disabled={!canLoadEstimates || isLoadingEstimates}
            >
              {isLoadingEstimates ? "Loading..." : "Load Estimates"}
            </button>

            {isLoadingEstimates && <Preloader />}

            {estimateError ? (
              <p className="add-lifestyle__error">{estimateError}</p>
            ) : !hasLoadedEstimates ? (
              <p className="add-lifestyle__placeholder">
                No estimates have been loaded.
              </p>
            ) : isDiningOrEntertainment && filteredItems.length === 0 ? (
              <p className="add-lifestyle__placeholder">
                No estimate items found for this type.
              </p>
            ) : !estimateRanges ? (
              <p className="add-lifestyle__placeholder">
                Select the required fields to see estimates.
              </p>
            ) : (
              <>
                {isDiningOrEntertainment && filteredItems.length > 0 && (
                  <>
                    <label className="add-lifestyle__estimate-label">
                      Estimate Item
                    </label>
                    <select
                      className="add-lifestyle__select"
                      value={selectedGoodId}
                      onChange={(evt) => setSelectedGoodId(evt.target.value)}
                      disabled={isLoadingEstimates}
                    >
                      {filteredItems.map((item) => (
                        <option key={item.goodId} value={item.goodId}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </>
                )}

                <div className="add-lifestyle__ranges">
                  <div className="add-lifestyle__range-row">
                    <span>Low</span>
                    <span>
                      {showEstimateTilde ? "~ $ " : "$ "}
                      {formatMoney(estimateRanges.low)}
                    </span>
                  </div>

                  <div className="add-lifestyle__range-row">
                    <span>Mid</span>
                    <span>
                      {showEstimateTilde ? "~ $ " : "$ "}
                      {formatMoney(estimateRanges.mid)}
                    </span>
                  </div>

                  <div className="add-lifestyle__range-row">
                    <span>High</span>
                    <span>
                      {showEstimateTilde ? "~ $ " : "$ "}
                      {formatMoney(estimateRanges.high)}
                    </span>
                  </div>
                </div>

                <div className="add-lifestyle__summary">
                  {getSummaryLines().map((line, idx) => (
                    <p key={idx} className="add-lifestyle__summary-text">
                      {line}
                    </p>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </ModalWithForm>
  );
}

export default EditLifestyleModal;
