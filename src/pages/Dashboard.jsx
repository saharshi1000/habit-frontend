import { useEffect, useState } from "react";
import api from "../api";
import { greeting, quoteOfTheDay, splitIcon, tint, badge } from "../utils";

const CONFETTI_COLORS = ["#6c5ce7", "#ff7eb3", "#fdcb6e", "#00b894", "#74b9ff"];

function Ring({ percent }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 120 120" className="ring">
      <defs>
        <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6c5ce7" />
          <stop offset="1" stopColor="#ff7eb3" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r={r} className="ring-bg" />
      <circle cx="60" cy="60" r={r} className="ring-fg" stroke="url(#rg)"
              strokeDasharray={c} strokeDashoffset={c - (c * percent) / 100}
              transform="rotate(-90 60 60)" />
      <text x="60" y="68" textAnchor="middle" className="ring-text">{percent}%</text>
    </svg>
  );
}

export default function Dashboard({ user }) {
  const [habits, setHabits] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [pieces, setPieces] = useState([]);

  const fetchHabits = () =>
    api.get("/habits/today", { params: { userId: user.id } }).then((r) => {
      setHabits(r.data);
      setLoaded(true);
      return r.data;
    });

  useEffect(() => { fetchHabits(); }, []);

  const fireConfetti = () => {
    setPieces(
      Array.from({ length: 40 }, (_, i) => ({
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 0.6}s`,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      }))
    );
    setTimeout(() => setPieces([]), 3000);
  };

  const toggle = async (h) => {
    await api.post(`/habits/${h.id}/toggle`);
    const data = await fetchHabits();
    if (!h.completedToday && data.length > 0 && data.every((x) => x.completedToday)) {
      fireConfetti();
    }
  };

  const remove = async (id) => {
    if (window.confirm("Delete this habit and its history?")) {
      await api.delete(`/habits/${id}`);
      fetchHabits();
    }
  };

  const done = habits.filter((h) => h.completedToday).length;
  const percent = habits.length ? Math.round((done / habits.length) * 100) : 0;
  const best = Math.max(0, ...habits.map((h) => h.streak));
  const dateText = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <div>
      {pieces.length > 0 && (
        <div className="confetti">
          {pieces.map((p, i) => (
            <span key={i} style={{ left: p.left, animationDelay: p.delay, background: p.color }} />
          ))}
        </div>
      )}

      <div className="hero card">
        <div className="hero-text">
          <p className="muted">{dateText}</p>
          <h2>{greeting()}, {user.name} 👋</h2>
          <p className="quote">"{quoteOfTheDay()}"</p>
          <div className="stats">
            <div><strong>{done}</strong><span>Done</span></div>
            <div><strong>{habits.length - done}</strong><span>Left</span></div>
            <div><strong>{best}</strong><span>Best streak</span></div>
          </div>
        </div>
        <Ring percent={percent} />
      </div>

      <div className="section-title">
        <h3>Today's habits</h3>
        {habits.length > 0 && done === habits.length && <span className="all-done">🎉 All done!</span>}
      </div>

      {loaded && habits.length === 0 && (
        <div className="card empty">
          <div className="empty-emoji">🌱</div>
          <h3>No habits yet</h3>
          <p className="muted">Add your first habit and start your streak today.</p>
        </div>
      )}

      {habits.map((h) => {
        const { icon, title } = splitIcon(h.name);
        const b = badge(h.streak);
        return (
          <div key={h.id} className={`card habit-card ${h.completedToday ? "done" : ""}`}>
            <button className="check" onClick={() => toggle(h)} aria-label="Toggle habit">
              {h.completedToday ? "✓" : ""}
            </button>
            <div className="avatar" style={{ background: tint(h.id) }}>
              {icon || title[0]?.toUpperCase()}
            </div>
            <div className="info">
              <strong>{title}</strong>
              {h.description && <span className="muted">{h.description}</span>}
              {b && <span className="badge">{b}</span>}
            </div>
            <span className={`streak-pill ${h.streak > 0 ? "on" : ""}`}>🔥 {h.streak}</span>
            <button className="icon-btn" onClick={() => remove(h.id)} title="Delete">🗑️</button>
          </div>
        );
      })}
    </div>
  );
}