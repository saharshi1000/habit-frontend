import { useState } from "react";
import api from "../api";

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) await api.post("/auth/register", form);
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Cannot reach server. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-hero">
        <div className="brand big"><span className="logo">S</span><span>Streakly</span></div>
        <h1>Small habits.<br />Big change.</h1>
        <p>Build routines that stick, one day at a time.</p>
        <ul>
          <li>✅ Tick off your daily checklist</li>
          <li>🔥 Grow streaks and earn badges</li>
          <li>📊 See your weekly progress</li>
        </ul>
      </div>

      <div className="auth-card">
        <h2>{isRegister ? "Create your account" : "Welcome back"}</h2>
        <p className="muted">{isRegister ? "Start your first streak today." : "Log in to continue your streak."}</p>
        <form onSubmit={submit}>
          {isRegister && (
            <input name="name" placeholder="Your name" value={form.name} onChange={change} required />
          )}
          <input name="email" type="email" placeholder="Email address" value={form.email} onChange={change} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={change} required />
          {error && <p className="error">{error}</p>}
          <button className="primary" type="submit" disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Create account" : "Login"}
          </button>
        </form>
        <p className="muted center">
          {isRegister ? "Already have an account?" : "New here?"}{" "}
          <button className="link-btn" onClick={() => { setIsRegister(!isRegister); setError(""); }}>
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}