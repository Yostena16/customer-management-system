// src/pages/CustomerDetail.jsx
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { getCustomer, deleteCustomer } from "../api/customers";
import Avatar from "../components/Avatar";
import StatusBadge from "../components/StatusBadge";
import CustomerModal from "../components/CustomerModal";
import ConfirmDialog from "../components/ConfirmDialog";

export default function CustomerDetail() {
  const { id } = useParams();          // reads the :id from the URL
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchCustomer = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCustomer(id);
      setCustomer(res.data);
    } catch {
      setCustomer(null); // 404 → not found
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteCustomer(id);
      toast.success("Customer deleted");
      navigate("/customers"); // go back to the list
    } catch {
      toast.error("Failed to delete");
      setDeleting(false);
    }
  };

  if (loading) return <div className="text-gray-400">Loading…</div>;

  if (!customer) {
    return (
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700">Customer not found</p>
        <Link to="/customers" className="mt-2 inline-block text-sm font-semibold text-brand-600 hover:underline">
          ← Back to customers
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back link */}
      <Link to="/customers"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700">
        <ChevronLeft size={16} /> Back to customers
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar firstName={customer.firstName} lastName={customer.lastName} size={64} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {customer.firstName} {customer.lastName}
            </h1>
            <div className="mt-1 flex items-center gap-3">
              <StatusBadge status={customer.status} />
              <span className="text-sm text-gray-500">{customer.company || "—"}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <Pencil size={16} /> Edit
          </button>
          <button onClick={() => setConfirmOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Contact info */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Contact information
          </h2>
          <dl className="mt-4 space-y-4">
            <Info label="Email" value={customer.email} />
            <Info label="Phone" value={customer.phone || "—"} />
            <Info label="Company" value={customer.company || "—"} />
            <Info
              label="Status"
              value={customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
            />
          </dl>
        </div>

        {/* Notes */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Notes</h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            {customer.notes || "No notes added yet."}
          </p>
        </div>
      </div>

      {/* Edit modal — reuses CustomerModal */}
      {editOpen && (
        <CustomerModal
          key={customer.id}
          onClose={() => setEditOpen(false)}
          onSaved={fetchCustomer}
          customer={customer}
        />
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        customerName={`${customer.firstName} ${customer.lastName}`}
        deleting={deleting}
      />
    </div>
  );
}

// small helper for a labeled field
function Info({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-gray-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-gray-900">{value}</dd>
    </div>
  );
}