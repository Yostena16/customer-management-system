// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, UserCheck, Zap, Clock } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { getCustomers } from "../api/customers";
import Avatar from "../components/Avatar";
import StatusBadge from "../components/StatusBadge";

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getCustomers({ limit: 1000 }); // fetch all for stats
        setCustomers(res.data.customers);
        setTotal(res.data.totalCustomers);
      } catch {
        // ignore — cards will just show 0
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // --- compute the numbers ---
  const active = customers.filter((c) => c.status === "active").length;
  const leads = customers.filter((c) => c.status === "lead").length;
  const inactive = customers.filter((c) => c.status === "inactive").length;

  const now = new Date();
  const newThisMonth = customers.filter((c) => {
    const d = new Date(c.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const recent = customers.slice(0, 5); // backend already sorts newest-first

  const chartData = [
    { name: "Active", value: active, color: "#22c55e" },
    { name: "Lead", value: leads, color: "#3b82f6" },
    { name: "Inactive", value: inactive, color: "#9ca3af" },
  ];

  const stats = [
    { label: "Total Customers", value: total, icon: Users, tint: "bg-brand-50 text-brand-600" },
    { label: "Active", value: active, icon: UserCheck, tint: "bg-green-50 text-green-600" },
    { label: "Leads", value: leads, icon: Zap, tint: "bg-blue-50 text-blue-600" },
    { label: "New This Month", value: newThisMonth, icon: Clock, tint: "bg-violet-50 text-violet-600" },
  ];

  if (loading) return <div className="text-gray-400">Loading dashboard…</div>;

  return (
    <div>
      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-gray-500">
        Welcome back, Jordan — here's how your customer base looks today.
      </p>

      {/* Stat cards (animated in — upgrade #1) */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {s.label}
              </p>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.tint}`}>
                <s.icon size={18} />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold text-gray-900">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart + Recent */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Donut chart */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Customers by status</h2>
          <p className="text-sm text-gray-400">Distribution across your pipeline</p>

          {total === 0 ? (
            <p className="py-10 text-center text-gray-400">No data yet</p>
          ) : (
            <div className="mt-4 flex items-center gap-6">
              <div className="relative h-44 w-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                {/* center label */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{total}</span>
                  <span className="text-xs text-gray-400">Total</span>
                </div>
              </div>

              {/* legend */}
              <div className="space-y-3">
                {chartData.map((s) => (
                  <div key={s.name} className="flex items-center gap-2 text-sm">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="font-medium text-gray-700">{s.name}</span>
                    <span className="font-semibold text-gray-900">{s.value}</span>
                    <span className="text-gray-400">
                      {total ? Math.round((s.value / total) * 100) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent customers */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent customers</h2>
              <p className="text-sm text-gray-400">Latest additions</p>
            </div>
            <Link to="/customers" className="text-sm font-semibold text-brand-600 hover:underline">
              View all
            </Link>
          </div>

          <div className="mt-4 space-y-1">
            {recent.length === 0 ? (
              <p className="py-6 text-center text-gray-400">No customers yet</p>
            ) : (
              recent.map((c) => (
                <Link
                  key={c.id}
                  to={`/customers/${c.id}`}
                  className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-gray-50"
                >
                  <Avatar firstName={c.firstName} lastName={c.lastName} size={36} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {c.firstName} {c.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{c.company || "—"}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}