import { useState } from "react";

export default function AddBar({ onAdd }) {
  const [amount, setAmount] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const submit = () => {
    if (!amount || !start || !end) return alert("Fill all fields");

    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Singapore",
    }).format(new Date());

    onAdd({
      amount,
      type: "breast",
      startTime: new Date(`${today}T${start}`),
      endTime: new Date(`${today}T${end}`),
    });

    setAmount("");
    setStart("");
    setEnd("");
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
          />
          <input
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full border rounded p-2"
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Amount"
          />
          <button
            onClick={submit}
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
