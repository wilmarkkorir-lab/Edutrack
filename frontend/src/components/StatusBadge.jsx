const STYLES = {
  active: "bg-brand-soft text-brand-dark",
  graduated: "bg-slate-200 text-slate-700",
  suspended: "bg-orange-100 text-signal",
};

export default function StatusBadge({ status, label }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STYLES[status] || STYLES.graduated}`}>
      {label || status}
    </span>
  );
}
