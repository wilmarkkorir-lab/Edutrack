import { useEffect } from "react";

export default function Modal({ title, onClose, wide, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-ink/50 sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={`max-h-[94vh] w-full overflow-y-auto rounded-t-xl bg-white shadow-2xl sm:rounded-lg ${wide ? "max-w-2xl" : "max-w-md"}`}>
        {children}
      </div>
    </div>
  );
}
