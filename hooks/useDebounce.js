import { useCallback, useRef } from "react";

const useDebounce = (callback, delay) => {
  const debounceRef = useRef(null);

  return useCallback(
    (...args) => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
};

export default useDebounce;
