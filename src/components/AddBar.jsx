import { useState } from "react";

export default function AddBar({ onAdd }) {
  const [amount,     setAmount]     = useState("");
  const [start,      setStart]      = useState("");
  const [end,        setEnd]        = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!amount || !start || !end) return alert("Please fill all fields");

    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Singapore",
    }).format(new Date());

    setSubmitting(true);
    try {
      const startDate = new Date(`${today}T${start}`);
      const endDate   = new Date(`${today}T${end}`);
      if (endDate <= startDate) endDate.setDate(endDate.getDate() + 1);

      await onAdd({ amount, type: "breast", startTime: startDate, endTime: endDate });
      setAmount("");
      setStart("");
      setEnd("");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-slate-100 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition disabled:opacity-50";

  return (
    <div className="sticky bottom-0 left-0 right-0 z-20 pb-[env(safe-area-inset-bottom)]">
      {/* Frosted backing */}
      <div className="bg-white/90 backdrop-blur border-t border-slate-200 shadow-[0_-4px_24px_rgba(0,0,0,0.07)]">
        <div className="max-w-md mx-auto px-4 py-3 space-y-2">
          {/* Label */}
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
            Log a session
          </p>

          {/* Time row */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[10px] text-slate-400 font-medium mb-0.5 block">Start</label>
              <input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className={inputClass}
                disabled={submitting}
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-slate-400 font-medium mb-0.5 block">End</label>
              <input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className={inputClass}
                disabled={submitting}
              />
            </div>
          </div>

          {/* Amount + button row */}
          <div className="flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`${inputClass} flex-1`}
              placeholder="Amount (ml)"
              disabled={submitting}
            />
            <button
              onClick={submit}
              disabled={submitting}
              className="shrink-0 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl px-5 transition disabled:opacity-50 flex items-center gap-1.5"
            >
              {submitting ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : (
                <>＋ Add</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
