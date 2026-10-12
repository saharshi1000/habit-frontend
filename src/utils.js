export const QUOTES = [
  "Small steps every day lead to big change.",
  "You don't have to be perfect, just consistent.",
  "Discipline is choosing what you want most over what you want now.",
  "Don't break the chain.",
  "Success is the sum of small efforts repeated daily.",
  "Today's habits build tomorrow's you.",
  "Motivation gets you started. Habit keeps you going.",
];

export function quoteOfTheDay() {
  const day = Math.floor(Date.now() / 86400000);
  return QUOTES[day % QUOTES.length];
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// Separates a leading emoji from the habit name: "💧 Drink Water" -> icon + title
export function splitIcon(name = "") {
  const m = name.match(/^(\p{Extended_Pictographic}\uFE0F?)\s*(.*)$/u);
  return m ? { icon: m[1], title: m[2] || name } : { icon: null, title: name };
}

const TINTS = ["#ede9fe", "#dcfce7", "#fee2e2", "#fef3c7", "#dbeafe", "#fce7f3"];
export const tint = (id) => TINTS[id % TINTS.length];

export function badge(streak) {
  if (streak >= 30) return "🏆 Legend";
  if (streak >= 14) return "💎 Unstoppable";
  if (streak >= 7) return "⚡ On fire";
  if (streak >= 3) return "🌱 Building";
  return "";
}