// Initialize TW Elements accordion only when globals are available.
(function initAccordion() {
  if (typeof window === "undefined") return;
  if (typeof window.initTWE !== "function") return;
  if (!window.Collapse) return;

  window.initTWE({ Collapse: window.Collapse });
})();
