// src/components/CustomerModal.jsx
import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { createCustomer, updateCustomer } from "../api/customers";

const empty = {
  firstName: "", lastName: "", email: "",
  phone: "", company: "", status: "lead", notes: "",
};

export default function CustomerModal({ onClose, onSaved, customer }) {
  const [form, setForm] = useState(customer ? { ...empty, ...customer } : empty);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(customer);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (isEdit) {
        await updateCustomer(customer.id, form);
        toast.success("Customer updated");
      } else {
        await createCustomer(form);
        toast.success("Customer added");
      }
      onSaved();   // tell the list to refresh
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEdit ? "Edit customer" : "Add customer"}
            </h2>
            <p className="text-sm text-gray-500">
              {isEdit ? "Update the details below." : "Fill in the details to create a new customer."}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="First name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} placeholder="Amelia" />
            <Field label="Last name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} placeholder="Hart" />
          </div>
          <Field label="Email" name="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="amelia@company.com" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="(415) 555-0142" />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500">
                <option value="lead">Lead</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <Field label="Company" name="company" value={form.company} onChange={handleChange} placeholder="Brightlane Studio" />
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
              placeholder="Add any context about this customer..."
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
              {saving ? "Saving..." : isEdit ? "Save changes" : "Add customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// small helper for a labeled input with an error message
function Field({ label, error, ...props }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <input {...props}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand-500 ${
          error ? "border-red-400" : "border-gray-300"
        }`} />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}