import { useCallback, useEffect, useState } from "react";
import { api, setToken } from "../api";
import Modal from "./Modal.jsx";
import StatusBadge from "./StatusBadge.jsx";
import StudentForm from "./StudentForm.jsx";
import StudentDetail from "./StudentDetail.jsx";

const PAGE_SIZE = 10;

function Stat({ label, value }) {
  return (
    <div className="px-5 py-4">
      <p className="text-xs text-ink-soft">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold">{value}</p>
    </div>
  );
}

export default function Dashboard({ onLogout }) {
  const [data, setData] = useState({ results: [], count: 0 });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [course, setCourse] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // {type: 'form'|'detail'|'delete', student?}
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);

  // Debounce the search box so we don't hit the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => { setSearch(query.trim()); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const loadStats = useCallback(() => api.stats().then(setStats).catch(() => {}), []);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = { page, ordering };
    if (search) params.search = search;
    if (status) params.status = status;
    if (course) params.course = course;
    try {
      setData(await api.list(params));
    } catch (err) {
      // Past the last page after a delete/filter change: step back.
      if (err.status === 404 && page > 1) setPage(1);
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, ordering, search, status, course]);

  useEffect(() => { loadStudents(); }, [loadStudents]);
  useEffect(() => { loadStats(); }, [loadStats]);

  const refresh = () => { loadStudents(); loadStats(); };
  const closeModal = useCallback(() => setModal(null), []);

  function onSaved(saved, wasEdit) {
    setModal(null);
    setToast(wasEdit ? `Saved changes to ${saved.full_name}` : `Added ${saved.full_name}`);
    refresh();
  }

  async function confirmDelete() {
    setBusy(true);
    try {
      await api.remove(modal.student.id);
      setToast(`Deleted ${modal.student.full_name}`);
      setModal(null);
      if (data.results.length === 1 && page > 1) setPage(page - 1);
      else refresh();
      loadStats();
    } catch (err) {
      setToast(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    try { await api.logout(); } catch { /* token may already be invalid */ }
    setToken(null);
    onLogout();
  }

  const totalPages = Math.max(1, Math.ceil(data.count / PAGE_SIZE));
  const courses = stats?.courses.map((c) => c.course) ?? [];
  const filtersActive = search || status || course;

  return (
    <div className="min-h-screen">
      <header className="bg-ink text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <p className="font-display text-xl font-bold">EduTrack</p>
          <button onClick={logout} className="rounded-md px-3 py-1.5 text-sm text-white/80 hover:bg-white/10">Sign out</button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Students</h1>
            <p className="text-sm text-ink-soft">Add, update and review student records.</p>
          </div>
          <button className="btn-primary" onClick={() => setModal({ type: "form" })}>Add student</button>
        </div>

        {/* Summary band */}
        <section aria-label="Summary" className="grid grid-cols-2 divide-ink/10 overflow-hidden rounded-lg border border-ink/10 bg-white sm:grid-cols-5 sm:divide-x [&>*]:border-b [&>*]:border-ink/10 sm:[&>*]:border-b-0">
          <Stat label="Total students" value={stats?.total ?? "–"} />
          <Stat label="Active" value={stats?.by_status.active ?? "–"} />
          <Stat label="Graduated" value={stats?.by_status.graduated ?? "–"} />
          <Stat label="Suspended" value={stats?.by_status.suspended ?? "–"} />
          <Stat label="Average GPA" value={stats?.average_gpa ?? "–"} />
        </section>

        {/* Filters */}
        <section className="space-y-3">
          <div className="flex flex-wrap gap-3">
            <input
              className="input sm:max-w-xs" type="search" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, ID or course" aria-label="Search students"
            />
            <select className="input w-auto" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filter by status">
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="graduated">Graduated</option>
              <option value="suspended">Suspended</option>
            </select>
            <select className="input w-auto" value={ordering} onChange={(e) => { setOrdering(e.target.value); setPage(1); }} aria-label="Sort students">
              <option value="-created_at">Newest first</option>
              <option value="full_name">Name A–Z</option>
              <option value="-gpa">Highest GPA</option>
              <option value="year_of_study">Year of study</option>
            </select>
            {filtersActive && (
              <button className="btn-ghost" onClick={() => { setQuery(""); setSearch(""); setStatus(""); setCourse(""); setPage(1); }}>
                Clear filters
              </button>
            )}
          </div>
          {stats?.courses.length > 0 && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by course">
              {stats.courses.map((c) => (
                <button
                  key={c.course}
                  onClick={() => { setCourse(course === c.course ? "" : c.course); setPage(1); }}
                  aria-pressed={course === c.course}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    course === c.course ? "border-brand bg-brand text-white" : "border-ink/15 bg-white hover:border-brand"
                  }`}
                >
                  {c.course} · {c.count}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Table */}
        <section className="overflow-hidden rounded-lg border border-ink/10 bg-white">
          {error ? (
            <div className="p-8 text-center">
              <p className="text-signal">{error}</p>
              <button className="btn-ghost mt-3" onClick={loadStudents}>Try again</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-ink/10 bg-paper text-xs text-ink-soft">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Student</th>
                    <th className="px-4 py-3 font-semibold">Course</th>
                    <th className="px-4 py-3 font-semibold">Year</th>
                    <th className="px-4 py-3 font-semibold">GPA</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y divide-ink/10 ${loading ? "opacity-50" : ""}`}>
                  {data.results.map((s) => (
                    <tr key={s.id} className="hover:bg-paper/60">
                      <td className="px-4 py-3">
                        <button className="text-left font-semibold hover:text-brand" onClick={() => setModal({ type: "detail", student: s })}>
                          {s.full_name}
                        </button>
                        <p className="text-xs text-ink-faint">{s.student_id} · {s.email}</p>
                      </td>
                      <td className="px-4 py-3">{s.course}</td>
                      <td className="px-4 py-3">{s.year_of_study}</td>
                      <td className="px-4 py-3">{s.gpa ?? "—"}</td>
                      <td className="px-4 py-3"><StatusBadge status={s.status} label={s.status_display} /></td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <button className="rounded px-2 py-1 text-brand hover:bg-brand-soft" onClick={() => setModal({ type: "detail", student: s })}>View</button>
                        <button className="rounded px-2 py-1 text-brand hover:bg-brand-soft" onClick={() => setModal({ type: "form", student: s })}>Edit</button>
                        <button className="rounded px-2 py-1 text-signal hover:bg-orange-50" onClick={() => setModal({ type: "delete", student: s })}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {!loading && data.results.length === 0 && (
                <div className="p-10 text-center">
                  <p className="font-semibold">{filtersActive ? "No students match these filters" : "No students yet"}</p>
                  <p className="mt-1 text-sm text-ink-soft">
                    {filtersActive ? "Try a different search or clear the filters." : "Add your first student to get started."}
                  </p>
                  {!filtersActive && <button className="btn-primary mt-4" onClick={() => setModal({ type: "form" })}>Add student</button>}
                </div>
              )}
              {loading && data.results.length === 0 && <p className="p-10 text-center text-sm text-ink-soft">Loading students…</p>}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-ink/10 px-4 py-3 text-sm">
            <p className="text-ink-soft">{data.count} {data.count === 1 ? "student" : "students"}</p>
            <div className="flex items-center gap-3">
              <button className="btn-ghost py-1" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
              <span className="text-ink-soft">Page {page} of {totalPages}</span>
              <button className="btn-ghost py-1" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          </div>
        </section>
      </main>

      {modal?.type === "form" && <StudentForm student={modal.student} courses={courses} onClose={closeModal} onSaved={onSaved} />}
      {modal?.type === "detail" && (
        <StudentDetail
          student={modal.student}
          onClose={closeModal}
          onEdit={() => setModal({ type: "form", student: modal.student })}
          onDelete={() => setModal({ type: "delete", student: modal.student })}
        />
      )}
      {modal?.type === "delete" && (
        <Modal title="Delete student" onClose={closeModal}>
          <div className="space-y-2 px-6 py-5">
            <h2 className="text-xl font-bold">Delete {modal.student.full_name}?</h2>
            <p className="text-sm text-ink-soft">This permanently removes the record for {modal.student.student_id}. You can't undo this.</p>
          </div>
          <div className="flex justify-end gap-3 border-t border-ink/10 px-6 py-4">
            <button className="btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="btn-danger" onClick={confirmDelete} disabled={busy}>{busy ? "Deleting…" : "Delete student"}</button>
          </div>
        </Modal>
      )}

      {toast && (
        <div role="status" className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-md bg-ink px-4 py-2.5 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
