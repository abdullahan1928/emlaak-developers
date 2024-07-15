import { useRef } from "react";

export function useDebounce(
  func: (...args: any[]) => void,
  wait = 20,
  immediate = true
) {
  const timeout = useRef<NodeJS.Timeout | null>(null);

  return (...args: any[]) => {
    const later = () => {
      timeout.current = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout.current;

    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(later, wait);

    if (callNow) func(...args);
  };
}
