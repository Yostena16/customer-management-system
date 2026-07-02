// src/components/Avatar.jsx
const colors = [
  "bg-indigo-100 text-indigo-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
];

export default function Avatar({ firstName = "", lastName = "", size = 40 }) {
  const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
  // sum the letters to pick a consistent color for each name
  const hash = (firstName + lastName)
    .split("")
    .reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const color = colors[hash % colors.length];

  return (
    <div
      className={`flex items-center justify-center rounded-full font-semibold ${color}`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}