import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const EMOJIS = ["💧", "📚", "🏃", "🧘", "🥗", "😴", "💪", "✍️", "🎧", "🧹", "💰", "🌞"];
const IDEAS = [
  { icon: "💧", name: "Drink Water", desc: "8 glasses a day" },
  { icon: "📚", name: "Read", desc: "10 pages" },
  { icon: "🏃", name: "Exercise", desc: "30 minutes" },
  { icon: "🧘", name: "Meditate", desc: "10 minutes" },
  { icon: "😴", name: "Sleep early", desc: "Before 11 PM" },
];

export default function AddHabit({ user }) {
  const [icon, setIcon] = useState("💧");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const useIdea = (i) => {
    setIcon(i.icon);
    setName(i.name);
    setDescription(i.desc);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await api.post("/habits", {
      userId: user.id,
      name: `${icon} ${name.trim()}`,
      description,
    });
    navigate("/");
  };

  return (
    <div>
      <div className="section-title"><h2>Create a new habit</h2></div>

      <div className="card">
        <p className="muted">Quick ideas</p>
        <div className="chips">
          {IDEAS.map((i) => (
            <button key={i.name} type="button" className="chip" onClick={() => useIdea(i)}>
              {i.icon} {i.name}
            </button>
          ))}
        </div>
      </div>

      <form className="card" onSubmit={submit}>
        <label>Pick an icon</label>
        <div className="emoji-grid">
          {EMOJIS.map((e) => (
            <button type="button" key={e}
                    className={`emoji ${icon === e ? "selected" : ""}`}
                    onClick={() => setIcon(e)}>
              {e}
            </button>
          ))}
        </div>

        <label>Habit name</label>
        <input placeholder="e.g. Drink Water" value={name}
               onChange={(e) => setName(e.target.value)} required />

        <label>Description (optional)</label>
        <input placeholder="e.g. 8 glasses a day" value={description}
               onChange={(e) => setDescription(e.target.value)} />

        <button className="primary" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save habit"}
        </button>
      </form>
    </div>
  );
}