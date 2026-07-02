// src/pages/Customers.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, Search, Eye, Pencil, Trash2, Download } from "lucide-react";
import toast from "react-hot-toast";
import { getCustomers, deleteCustomer } from "../api/customers";
import Avatar from "../components/Avatar";
import StatusBadge from "../components/StatusBadge";
import CustomerModal from "../components/CustomerModal";
import ConfirmDialog from "../components/ConfirmDialog";

const LIMIT = 7;

export default function Customers() {
  const navigate = useNavigate();
  const location = useLocation();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCustomers({ search, page, limit: LIMIT });
      let list = res.data.customers;
      if (status) list = list.filter((c) => c.status === status); // filter current page
      setCustomers(list);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.totalCustomers);
    } catch {
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, [search, page, status]);

  // debounced fetch (live search — upgrade #4)
  useEffect(() => {
    const t = setTimeout(fetchData, 300);
    return () => clearTimeout(t);
  }, [fetchData]);

  // open the Add modal if we arrived here from the top bar's "+" button
  useEffect(() => {
    if (location.state?.openAdd) {
      setEditing(null); // add mode (not edit)
      setModalOpen(true); // open the modal
      navigate("/customers", { replace: true, state: {} }); // clear the signal
    }
  }, [location.state, navigate]);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (c) => {
    setEditing(c);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteCustomer(deleteTarget.id);
      toast.success("Customer deleted");
      setDeleteTarget(null);
      if (customers.length === 1 && page > 1) setPage(page - 1);
      else fetchData();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = async () => {
  try {
    const res = await getCustomers({ limit: 1000 }); // grab everyone
    const list = res.data.customers;
    if (list.length === 0) {
      toast.error("No customers to export");
      return;
    }

    const headers = ["First Name", "Last Name", "Email", "Phone", "Company", "Status", "Notes"];
    const rows = list.map((c) => [
      c.firstName, c.lastName, c.email,
      c.phone || "", c.company || "", c.status, c.notes || "",
    ]);

    // build CSV text, safely quoting each field
    const csv = [headers, ...rows]
      .map((row) => row.map((f) => `"${String(f).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    // trigger a download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "customers.csv";
    link.click();
    URL.revokeObjectURL(url);

    toast.success("Exported to CSV");
  } catch {
    toast.error("Export failed");
  }
};

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-gray-500">Manage and track every customer relationship.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Download size={18} /> Export CSV
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
          >
            <Plus size={18} /> Add Customer
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Search + filter */}
        <div className="flex gap-3 border-b border-gray-100 p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email or company..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 outline-none focus:border-brand-500"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="lead">Lead</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Table / states */}
        {loading ? (
          <div className="p-10 text-center text-gray-400">Loading…</div>
        ) : customers.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-lg font-semibold text-gray-700">No customers found</p>
            <p className="mt-1 text-sm text-gray-400">Try a different search, or add your first customer.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Company</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 transition hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar firstName={c.firstName} lastName={c.lastName} size={36} />
                      <span className="font-medium text-gray-900">
                        {c.firstName} {c.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{c.email}</td>
                  <td className="px-6 py-4 text-gray-500">{c.company || "—"}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <IconButton onClick={() => navigate(`/customers/${c.id}`)} icon={Eye} />
                      <IconButton onClick={() => openEdit(c)} icon={Pencil} />
                      <IconButton onClick={() => setDeleteTarget(c)} icon={Trash2} danger />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!loading && customers.length > 0 && (
          <div className="flex items-center justify-between p-4 text-sm text-gray-500">
            <span>
              Showing {customers.length} of {total}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {modalOpen && (
        <CustomerModal
          key={editing ? editing.id : "new"}
          onClose={() => setModalOpen(false)}
          onSaved={fetchData}
          customer={editing}
        />
      )}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        customerName={deleteTarget ? `${deleteTarget.firstName} ${deleteTarget.lastName}` : ""}
        deleting={deleting}
      />
    </div>
  );
}

function IconButton({ icon: Icon, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 ${
        danger ? "hover:text-red-600" : "hover:text-brand-600"
      }`}
    >
      <Icon size={16} />
    </button>
  );
}