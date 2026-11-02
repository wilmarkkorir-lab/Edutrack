import { useState } from "react";
import { api, setToken } from "../api";

export default function Login({ onLogin, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { token } = await api.login(username.trim(), password);
      setToken(token);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <section className="hidden flex-col justify-between bg-ink p-12 text-white lg:flex">
        <p className="font-display text-2xl font-bold">EduTrack</p>
        <div>
          <h1 className="max-w-md text-5xl font-bold leading-[1.05]">Every student record, in one place.</h1>
          <p className="mt-5 max-w-sm text-white/70">
            Enrol students, keep their details current and see who is active, graduated or suspended at a glance.
          </p>
        </div>
        <p className="text-sm text-white/50">Student Management System</p>
      </section>

      <section className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5">
          <div>
            <h2 className="text-3xl font-bold">Sign in</h2>
            <p className="mt-1 text-sm text-ink-soft">Use the administrator account to manage students.</p>
          </div>
          {error && (
            <p role="alert" className="rounded-md border border-signal/30 bg-orange-50 px-3 py-2 text-sm text-signal">
              {error}
            </p>
          )}
          <label className="block text-sm font-medium">
            Username
            <input className="input mt-1" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required autoFocus />
          </label>
          <label className="block text-sm font-medium">
            Password
            <input className="input mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          </label>
          <button className="btn-primary w-full" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
