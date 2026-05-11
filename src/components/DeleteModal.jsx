export default function DeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xs space-y-4 animate-scaleIn">
        <div className="text-center">
          <p className="text-3xl mb-2">🗑️</p>
          <h2 className="text-base font-bold text-slate-800">Delete Record?</h2>
          <p className="text-sm text-slate-400 mt-1">This action cannot be undone.</p>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl text-sm transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
