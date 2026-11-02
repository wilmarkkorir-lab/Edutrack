import { useEffect, useState } from "react";
import { getToken } from "./api";
import Landing from "./components/Landing.jsx";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

export default function App() {
  const [authed, setAuthed] = useState(!!getToken());
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const onExpired = () => setAuthed(false);
    window.addEventListener("auth-expired", onExpired);
    return () => window.removeEventListener("auth-expired", onExpired);
  }, []);

  if (authed) {
    return <Dashboard onLogout={() => setAuthed(false)} />;
  }

  if (showAuth) {
    return <Login onLogin={() => setAuthed(true)} onBack={() => setShowAuth(false)} />;
  }

  return <Landing onGetStarted={() => setShowAuth(true)} onSignIn={() => setShowAuth(true)} />;
}
