// src/components/ConfirmDialog.jsx
import { Trash2 } from "lucide-react";

export default function ConfirmDialog({ isOpen, onCancel, onConfirm, customerName, deleting }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
          <Trash2 size={22} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Delete customer?</h3>
        <p className="mt-1 text-sm text-gray-500">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-700">{customerName}</span>? This action can't be undone.
        </p>
        <div className="mt-5 flex gap-3">
          <button onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={deleting}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}