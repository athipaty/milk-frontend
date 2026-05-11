import { useState, useEffect } from "react";

export default function EditModal({ record, onSave, onClose }) {
  const [amount, setAmount] = useState("");
  const [start,  setStart]  = useState("");
  const [end,    setEnd]    = useState("");

  useEffect(() => {
    if (!record) return;
    setAmount(record.amount);
    const format = (d) =>
      new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    setStart(format(record.startTime));
    setEnd(format(record.endTime));
  }, [record]);

  if (!record) return null;

  const submit = () => {
    if (!amount || !start || !end) return alert("Please fill all fields");
    const day = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Singapore",
    }).format(new Date(record.startTime));
    onSave(record._id, {
      amount,
      startTime: new Date(`${day}T${start}`),
      endTime:   new Date(`${day}T${end}`),
      time:      new Date(`${day}T${start}`),
    });
  };

  const inputClass =
    "w-full bg-slate-100 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xs space-y-4 animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">✏️ Edit Record</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
              Start time
            </label>
            <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
              End time
            </label>
            <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
              Amount (ml)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputClass}
              placeholder="e.g. 120"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
