import { useEffect, useState } from "react";
import { readJSON, writeJSON } from "@/lib/storage";

/**
 * Small localStorage-backed state helper used for demo persistence.
 * Initial state is read lazily so remounts pick up saved demo data.
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T | (() => T),
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() =>
    readJSON(
      key,
      typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue,
    ),
  );

  useEffect(() => {
    writeJSON(key, value);
  }, [key, value]);

  return [value, setValue];
}
