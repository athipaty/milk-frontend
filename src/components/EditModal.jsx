import { useState, useEffect } from "react";

export default function EditModal({ record, onSave, onClose }) {
  const [amount, setAmount] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    if (!record) return;

    setAmount(record.amount);

    const format = (d) =>
      new Date(d).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });

    setStart(format(record.startTime));
    setEnd(format(record.endTime));
  }, [record]);

  if (!record) return null;

  const submit = () => {
    if (!amount || !start || !end) return alert("Fill all fields");

    const day = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Singapore",
    }).format(new Date(record.startTime));

    onSave(record._id, {
      amount,
      startTime: new Date(`${day}T${start}`),
      endTime: new Date(`${day}T${end}`),
      time: new Date(`${day}T${start}`),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl space-y-3 w-80">
        <h2 className="font-semibold text-center">Edit Record</h2>

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
        />

        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 border rounded py-2">
            Cancel
          </button>

          <button
            onClick={submit}
            className="flex-1 bg-blue-600 text-white rounded py-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
