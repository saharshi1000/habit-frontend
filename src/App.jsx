import { useEffect, useState } from "react";
import { Routes, Route, Navigate, NavLink } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddHabit from "./pages/AddHabit";
import Progress from "./pages/Progress";

export default function App() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const login = (u) => {
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
  };
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) return <Login onLogin={login} />;

  return (
    <>
      <nav className="nav">
        <div className="brand">
          <span className="logo">S</span>
          <span>Streakly</span>
        </div>
        <div className="links">
          <NavLink to="/" end>Today</NavLink>
          <NavLink to="/add">Add Habit</NavLink>
          <NavLink to="/progress">Progress</NavLink>
        </div>
        <div className="nav-right">
          <button className="icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  title="Toggle theme">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <div className="avatar-sm" title={user.name}>{(user.name || "U")[0].toUpperCase()}</div>
          <button className="ghost" onClick={logout}>Logout</button>
        </div>
      </nav>
      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/add" element={<AddHabit user={user} />} />
          <Route path="/progress" element={<Progress user={user} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}