import { useState } from "react";
import { api } from "../api";
import Modal from "./Modal.jsx";

const EMPTY = {
  full_name: "", email: "", phone: "", date_of_birth: "", gender: "O", course: "",
  year_of_study: 1, gpa: "", status: "active", enrolled_on: new Date().toISOString().slice(0, 10), address: "",
};

function Field({ label, error, children, className = "" }) {
  return (
    <label className={`block text-sm font-medium ${className}`}>
      {label}
      <div className="mt-1">{children}</div>
      {error && <span className="mt-1 block text-xs font-normal text-signal">{Array.isArray(error) ? error[0] : error}</span>}
    </label>
  );
}

export default function StudentForm({ student, courses, onClose, onSaved }) {
  const editing = !!student;
  const [form, setForm] = useState(() => (student ? { ...EMPTY, ...student, gpa: student.gpa ?? "", date_of_birth: student.date_of_birth ?? "" } : EMPTY));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setFormError("");
    const payload = {
      ...form,
      year_of_study: Number(form.year_of_study),
      gpa: form.gpa === "" ? null : form.gpa,
      date_of_birth: form.date_of_birth || null,
    };
    try {
      const saved = editing ? await api.update(student.id, payload) : await api.create(payload);
      onSaved(saved, editing);
    } catch (err) {
      setErrors(err.fields || {});
      setFormError(err.status === 400 ? "Fix the highlighted fields and save again." : err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title={editing ? "Edit student" : "Add student"} onClose={onClose} wide>
      <form onSubmit={submit}>
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <h2 className="text-xl font-bold">{editing ? `Edit ${student.full_name}` : "Add student"}</h2>
          <button type="button" onClick={onClose} className="rounded p-1 text-ink-soft hover:bg-paper" aria-label="Close">✕</button>
        </div>

        <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
          {formError && <p role="alert" className="rounded-md bg-orange-50 px-3 py-2 text-sm text-signal sm:col-span-2">{formError}</p>}
          <Field label="Full name" error={errors.full_name} className="sm:col-span-2">
            <input className="input" value={form.full_name} onChange={set("full_name")} placeholder="e.g. Amina Wanjiru" required />
          </Field>
          <Field label="Email" error={errors.email}>
            <input className="input" type="email" value={form.email} onChange={set("email")} required />
          </Field>
          <Field label="Phone" error={errors.phone}>
            <input className="input" value={form.phone} onChange={set("phone")} placeholder="+254…" />
          </Field>
          <Field label="Date of birth" error={errors.date_of_birth}>
            <input className="input" type="date" value={form.date_of_birth} onChange={set("date_of_birth")} />
          </Field>
          <Field label="Gender" error={errors.gender}>
            <select className="input" value={form.gender} onChange={set("gender")}>
              <option value="F">Female</option>
              <option value="M">Male</option>
              <option value="O">Other</option>
            </select>
          </Field>
          <Field label="Course" error={errors.course}>
            <input className="input" list="course-list" value={form.course} onChange={set("course")} required />
            <datalist id="course-list">{courses.map((c) => <option key={c} value={c} />)}</datalist>
          </Field>
          <Field label="Year of study" error={errors.year_of_study}>
            <input className="input" type="number" min="1" max="8" value={form.year_of_study} onChange={set("year_of_study")} required />
          </Field>
          <Field label="GPA (0–4)" error={errors.gpa}>
            <input className="input" type="number" step="0.01" min="0" max="4" value={form.gpa} onChange={set("gpa")} />
          </Field>
          <Field label="Status" error={errors.status}>
            <select className="input" value={form.status} onChange={set("status")}>
              <option value="active">Active</option>
              <option value="graduated">Graduated</option>
              <option value="suspended">Suspended</option>
            </select>
          </Field>
          <Field label="Enrolled on" error={errors.enrolled_on}>
            <input className="input" type="date" value={form.enrolled_on} onChange={set("enrolled_on")} required />
          </Field>
          <Field label="Address" error={errors.address} className="sm:col-span-2">
            <textarea className="input" rows="2" value={form.address} onChange={set("address")} />
          </Field>
        </div>

        <div className="flex justify-end gap-3 border-t border-ink/10 px-6 py-4">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : "Add student"}</button>
        </div>
      </form>
    </Modal>
  );
}
