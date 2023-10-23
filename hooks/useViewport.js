import { useState, useEffect } from "react";

const hasWindow = typeof window !== "undefined";

function getWindowDimensions() {
  const width = hasWindow ? window.innerWidth : null;
  const height = hasWindow ? window.innerHeight : null;

  return { width, height };
}

const useViewport = () => {
  const [viewport, setViewport] = useState(getWindowDimensions());

  useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        setViewport(getWindowDimensions());
      }

      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return viewport;
};

export default useViewport;
