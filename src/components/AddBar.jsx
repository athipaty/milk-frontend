import { useState } from "react";

export default function AddBar({ onAdd }) {
  const [amount, setAmount] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!amount || !start || !end) return alert("Fill all fields");

    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Singapore",
    }).format(new Date());

    setSubmitting(true);
    try {
      const startDate = new Date(`${today}T${start}`);
      const endDate = new Date(`${today}T${end}`);
      if (endDate <= startDate) endDate.setDate(endDate.getDate() + 1);

      await onAdd({
        amount,
        type: "breast",
        startTime: startDate,
        endTime: endDate,
      });
      setAmount("");
      setStart("");
      setEnd("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="bg-white border-t
                 sticky bottom-0
                 md:fixed md:bottom-0
                 left-0 right-0
                 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="p-4">
        <div className="max-w-md mx-auto space-y-2 max-h-[60vh] overflow-y-auto">
          <input
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full border rounded p-2"
            disabled={submitting}
          />
          <input
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full border rounded p-2"
            disabled={submitting}
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Amount (ml)"
            disabled={submitting}
          />
          <button
            onClick={submit}
            disabled={submitting}
            className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
