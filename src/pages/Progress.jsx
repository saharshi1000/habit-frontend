import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import api from "../api";
import { splitIcon, tint, badge } from "../utils";

export default function Progress({ user }) {
  const [week, setWeek] = useState([]);
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    api.get("/habits/weekly", { params: { userId: user.id } }).then((r) => setWeek(r.data));
    api.get("/habits/today", { params: { userId: user.id } }).then((r) => setHabits(r.data));
  }, []);

  const data = week.map((d) => ({
    day: new Date(d.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short" }),
    Completed: d.completed,
    Total: d.total,
  }));

  const totalDone = week.reduce((s, d) => s + d.completed, 0);
  const totalPossible = week.reduce((s, d) => s + d.total, 0);
  const weeklyPercent = totalPossible ? Math.round((totalDone / totalPossible) * 100) : 0;
  const perfectDays = week.filter((d) => d.total > 0 && d.completed === d.total).length;
  const best = Math.max(0, ...habits.map((h) => h.streak));

  return (
    <div>
      <div className="section-title"><h2>Your progress</h2></div>

      <div className="stat-grid">
        <div className="card stat"><span>Weekly score</span><strong>{weeklyPercent}%</strong></div>
        <div className="card stat"><span>Completions</span><strong>{totalDone}</strong></div>
        <div className="card stat"><span>Perfect days</span><strong>{perfectDays}</strong></div>
        <div className="card stat"><span>Best streak</span><strong>🔥 {best}</strong></div>
      </div>

      <div className="card">
        <h3>Last 7 days</h3>
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#a66cff" />
                  <stop offset="1" stopColor="#6c5ce7" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--muted)" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} stroke="var(--muted)" tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "rgba(108,92,231,.08)" }} />
              <Bar dataKey="Completed" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="section-title"><h3>Current streaks</h3></div>
      {habits.map((h) => {
        const { icon, title } = splitIcon(h.name);
        const b = badge(h.streak);
        return (
          <div key={h.id} className="card habit-card">
            <div className="avatar" style={{ background: tint(h.id) }}>{icon || title[0]?.toUpperCase()}</div>
            <div className="info">
              <strong>{title}</strong>
              {b && <span className="badge">{b}</span>}
            </div>
            <span className={`streak-pill ${h.streak > 0 ? "on" : ""}`}>
              🔥 {h.streak} day{h.streak === 1 ? "" : "s"}
            </span>
          </div>
        );
      })}
    </div>
  );
}