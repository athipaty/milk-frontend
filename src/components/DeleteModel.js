
export default function DeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl space-y-3">
        <p>Delete this record?</p>

        <div className="flex gap-2">
          <button onClick={onCancel} className="border px-4 py-2 rounded">Cancel</button>
          <button onClick={onConfirm} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
        </div>
      </div>
    </div>
  );
}
