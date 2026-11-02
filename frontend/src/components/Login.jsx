import { useState } from "react";
import { api, setToken } from "../api";

export default function Login({ onLogin, onBack }) {
  const [mode, setMode] = useState("signin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "signup") {
        await api.register(username.trim(), password);
        setMode("signin");
        setPassword("");
        setError("");
        setBusy(false);
        return;
      } else {
        const { token } = await api.login(username.trim(), password);
        setToken(token);
        onLogin();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      if (mode !== "signup") {
        setBusy(false);
      }
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <section className="hidden flex-col justify-between bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-12 text-white lg:flex">
        <p className="font-display text-2xl font-bold">EduTrack</p>
        <div>
          <h1 className="max-w-md text-5xl font-bold leading-[1.05]">Every student record, in one place.</h1>
          <p className="mt-5 max-w-sm text-white/80">
            Enrol students, keep their details current and see who is active, graduated or suspended at a glance.
          </p>
        </div>
        <p className="text-sm text-white/60">Student Management System</p>
      </section>

      <section className="flex items-center justify-center bg-gradient-to-br from-slate-50 to-white p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">{mode === "signup" ? "Sign up" : "Sign in"}</h2>
              <p className="mt-1 text-sm text-ink-soft">
                {mode === "signup" ? "Create an account to get started." : "Sign in to manage students."}
              </p>
            </div>
            {onBack && (
              <button type="button" onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-slate-700">
                Back
              </button>
            )}
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
            <div className="relative mt-1">
              <input
                className="input pr-10"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                required
              />
              <button type="button" className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </label>
          <button className="btn-primary w-full" disabled={busy}>
            {busy ? (mode === "signup" ? "Creating account…" : "Signing in…") : mode === "signup" ? "Sign up" : "Sign in"}
          </button>
          <p className="text-center text-sm text-ink-soft">
            {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
            <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500" onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError(""); setPassword(""); }}>
              {mode === "signup" ? "Sign in" : "Sign up"}
            </button>
          </p>
        </form>
      </section>
    </main>
  );
}
