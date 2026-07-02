// src/components/StatusBadge.jsx
const styles = {
  active: "bg-green-50 text-green-700",
  lead: "bg-blue-50 text-blue-700",
  inactive: "bg-gray-100 text-gray-500",
};
const dot = {
  active: "bg-green-500",
  lead: "bg-blue-500",
  inactive: "bg-gray-400",
};

export default function StatusBadge({ status = "lead" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot[status]}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}