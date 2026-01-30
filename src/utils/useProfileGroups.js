import { useSyncExternalStore } from "react";
import ProfileStore from "./ProfileStore.js";

const getSnapshot = (pageKey) => ProfileStore.getGroups(pageKey);

export default function useProfileGroups(pageKey) {
  return useSyncExternalStore(
    ProfileStore.subscribe,
    () => getSnapshot(pageKey),
    () => getSnapshot(pageKey),
  );
}
