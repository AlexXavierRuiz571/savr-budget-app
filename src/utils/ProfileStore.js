const STORAGE_KEYS = {
  expenses: "savr_expenses_savedGroups_v1",
  lifestyle: "savr_lifestyle_savedGroups_v1",
  savings: "savr_savings_savedGroups_v1",
  debt: "savr_debt_savedGroups_v1",
  income: "savr_income_savedGroups_v1",
};

const state = {
  groupsByPage: {
    expenses: [],
    lifestyle: [],
    savings: [],
    debt: [],
    income: [],
  },
  hasLoaded: false,
};

const listeners = new Set();

const safeParseArray = (raw) => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const normalizeGroupArray = (arr) => {
  if (!Array.isArray(arr)) return [];

  return arr.map((group) => {
    const items = Array.isArray(group.items) ? group.items : [];

    const monthlyTotal =
      typeof group.monthlyTotal === "number" ? group.monthlyTotal : 0;

    const isEstimate =
      typeof group.isEstimate === "boolean"
        ? group.isEstimate
        : items.some((item) => item && item.isEstimate);

    return {
      ...group,
      items,
      monthlyTotal,
      isEstimate,
    };
  });
};

const notify = () => {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (err) {
      console.error("ProfileStore listener error:", err);
    }
  });
};

const loadOnce = () => {
  if (state.hasLoaded) return;

  Object.keys(STORAGE_KEYS).forEach((pageKey) => {
    const storageKey = STORAGE_KEYS[pageKey];
    const raw = localStorage.getItem(storageKey);
    const parsed = safeParseArray(raw);
    state.groupsByPage[pageKey] = normalizeGroupArray(parsed);
  });

  state.hasLoaded = true;
};

const savePage = (pageKey) => {
  const storageKey = STORAGE_KEYS[pageKey];
  if (!storageKey) return;

  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify(state.groupsByPage[pageKey] || []),
    );
  } catch (err) {
    console.error("ProfileStore save failed:", err);
  }
};

const ProfileStore = {
  init() {
    loadOnce();
  },

  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  getGroups(pageKey) {
    loadOnce();
    return state.groupsByPage[pageKey] || [];
  },

  setGroups(pageKey, nextGroups) {
    loadOnce();
    if (!STORAGE_KEYS[pageKey]) {
      console.error("ProfileStore.setGroups invalid pageKey:", pageKey);
      return;
    }

    state.groupsByPage[pageKey] = normalizeGroupArray(nextGroups);
    savePage(pageKey);
    notify();
  },

  // Optional helpers for later
  getAll() {
    loadOnce();
    return { ...state.groupsByPage };
  },
};

export default ProfileStore;
