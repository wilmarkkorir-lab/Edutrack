import Modal from "./Modal.jsx";
import StatusBadge from "./StatusBadge.jsx";

export const fmtDate = (d) =>
  d ? new Date(`${d}T00:00:00`).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—";

const initials = (name) => name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("");

function Item({ label, children }) {
  return (
    <div>
      <dt className="text-xs text-ink-faint">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">{children || "—"}</dd>
    </div>
  );
}

// Styled like a student ID card: coloured header band, avatar, then the facts.
export default function StudentDetail({ student: s, onClose, onEdit, onDelete }) {
  return (
    <Modal title="Student details" onClose={onClose}>
      <div className="flex items-center gap-4 bg-ink px-6 py-5 text-white">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand font-display text-xl font-bold">
          {initials(s.full_name)}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-bold">{s.full_name}</h2>
          <p className="text-sm text-white/70">{s.student_id}</p>
        </div>
        <button onClick={onClose} className="self-start rounded p-1 text-white/70 hover:bg-white/10" aria-label="Close">✕</button>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 px-6 py-5">
        <Item label="Status"><StatusBadge status={s.status} label={s.status_display} /></Item>
        <Item label="GPA">{s.gpa}</Item>
        <Item label="Course">{s.course}</Item>
        <Item label="Year of study">{`Year ${s.year_of_study}`}</Item>
        <Item label="Email"><span className="break-all">{s.email}</span></Item>
        <Item label="Phone">{s.phone}</Item>
        <Item label="Date of birth">{s.date_of_birth && fmtDate(s.date_of_birth)}</Item>
        <Item label="Gender">{s.gender_display}</Item>
        <Item label="Enrolled on">{fmtDate(s.enrolled_on)}</Item>
        <Item label="Last updated">{fmtDate(s.updated_at?.slice(0, 10))}</Item>
        <div className="col-span-2"><Item label="Address">{s.address}</Item></div>
      </dl>

      <div className="flex justify-end gap-3 border-t border-ink/10 px-6 py-4">
        <button className="btn-ghost" onClick={onDelete}>Delete</button>
        <button className="btn-primary" onClick={onEdit}>Edit student</button>
      </div>
    </Modal>
  );
}
