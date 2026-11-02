
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return undefined;
    }

    let tries = 0;
    const timer = window.setInterval(() => {
      const target = document.getElementById(hash.slice(1));
      tries += 1;
      if (target) {
        target.scrollIntoView({ block: "start" });
        window.clearInterval(timer);
      } else if (tries > 20) {
        window.clearInterval(timer);
      }
    }, 50);

    return () => window.clearInterval(timer);
  }, [pathname, hash]);

  return null;
}
