// src/pages/Settings.jsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const defaults = {
  orgName: "Harbor Consulting",
  contactEmail: "team@harbor.co",
  notifyNewCustomer: true,
  notifyLeadFollowup: true,
  notifyProductUpdates: false,
};

export default function Settings() {
  const [settings, setSettings] = useState(defaults);

  // load saved settings on first render
  useEffect(() => {
    const saved = localStorage.getItem("crm-settings");
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const update = (key, value) => setSettings((s) => ({ ...s, [key]: value }));

  const save = () => {
    localStorage.setItem("crm-settings", JSON.stringify(settings));
    toast.success("Settings saved");
  };

  // toggles save immediately
  const toggle = (key) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    localStorage.setItem("crm-settings", JSON.stringify(next));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      <p className="mt-1 text-gray-500">Manage your workspace and preferences.</p>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Organization */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Organization</h2>
          <p className="text-sm text-gray-400">Details shown across your workspace.</p>

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Organization name</label>
              <input
                value={settings.orgName}
                onChange={(e) => update("orgName", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Contact email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => update("contactEmail", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </div>
            <button
              onClick={save}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Save changes
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
          <p className="text-sm text-gray-400">Choose what you get alerted about.</p>

          <div className="mt-5 space-y-1">
            <ToggleRow
              title="New customer added"
              subtitle="Email me when a customer is created"
              checked={settings.notifyNewCustomer}
              onChange={() => toggle("notifyNewCustomer")}
            />
            <ToggleRow
              title="Lead follow-up reminders"
              subtitle="Weekly digest of stale leads"
              checked={settings.notifyLeadFollowup}
              onChange={() => toggle("notifyLeadFollowup")}
            />
            <ToggleRow
              title="Product updates"
              subtitle="Occasional news about Harbor"
              checked={settings.notifyProductUpdates}
              onChange={() => toggle("notifyProductUpdates")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// a labeled on/off switch row
function ToggleRow({ title, subtitle, checked, onChange }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-50 py-3 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-brand-600" : "bg-gray-300"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}