import { useEffect } from "react";

export function TabTitle() {
  useEffect(() => {
    const originalTitle = document.title;
    const restoreTitle = () => {
      document.title = originalTitle;
    };
    const handleVisibility = () => {
      if (document.hidden) {
        document.title = "come back, i miss you 🥺";
      } else {
        restoreTitle();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", restoreTitle);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", restoreTitle);
      restoreTitle();
    };
  }, []);

  return null;
}
