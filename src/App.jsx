import { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "https://milk-backend-05vv.onrender.com/api/milk",
});

function App() {
  const [records, setRecords] = useState([]);
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [editing, setEditing] = useState(null); // holds the record being edited
  const [editAmount, setEditAmount] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");

  const loadMilk = async () => {
    try {
      const { data } = await api.get("/");
      setRecords(data);
    } catch (err) {
      console.error("Failed to load records", err);
    }
  };

  const loadTotal = async () => {
    try {
      const { data } = await api.get("/summary/today");
      setTotal(data.total);
    } catch (err) {
      console.error("Failed to load total", err);
    }
  };

  const toSGDateString = (date) => {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Singapore",
    }).format(new Date(date));
  };

  const addMilk = async () => {
    if (!amount || amount <= 0) return alert("Invalid amount");
    if (!startTime || !endTime) return alert("Please select time");

    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Singapore",
    }).format(new Date());

    const start = new Date(`${today}T${startTime}`);
    const end = new Date(`${today}T${endTime}`);

    if (end <= start) return alert("End time must be after start time");

    try {
      setSaving(true);
      await api.post("/", {
        amount,
        type: "breast",
        startTime: start,
        endTime: end,
      });

      setAmount("");
      setStartTime("");
      setEndTime("");

      await loadMilk();
      await loadTotal();
    } catch (err) {
      console.error("Failed to add record", err);
    } finally {
      setSaving(false);
    }
  };

  const deleteMilk = async () => {
    try {
      await api.delete(`/${confirmId}`);
      setConfirmId(null);
      await loadMilk();
      await loadTotal();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadMilk();
      await loadTotal();
      setLoading(false);
    };
    init();
  }, []);

  const openEdit = (record) => {
    setEditing(record);

    setEditAmount(record.amount);
    setEditStart(
      new Date(record.startTime).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
    setEditEnd(
      new Date(record.endTime).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const saveEdit = async () => {
    if (!editAmount || editAmount <= 0) return alert("Invalid amount");
    if (!editStart || !editEnd) return alert("Select time");

    const originalDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Singapore",
    }).format(new Date(editing.startTime));

    const start = new Date(`${originalDate}T${editStart}`);
    const end = new Date(`${originalDate}T${editEnd}`);

    if (end <= start) return alert("End time must be after start time");

    try {
      await api.put(`/${editing._id}`, {
        amount: editAmount,
        startTime: start,
        endTime: end,
        time: start, // keep everything consistent
      });

      setEditing(null);
      await loadMilk();
      await loadTotal();
    } catch (err) {
      console.error("Failed to update record", err);
    }
  };

  // =========================
  // 📅 GROUP BY DATE LOGIC
  // =========================
  const groupRecords = () => {
    const today = toSGDateString(new Date());
    const yesterday = toSGDateString(new Date(Date.now() - 86400000));

    const groups = {
      Today: [],
      Yesterday: [],
      Older: [],
    };

    records.forEach((r) => {
      const d = toSGDateString(r.time);

      if (d === today) groups.Today.push(r);
      else if (d === yesterday) groups.Yesterday.push(r);
      else groups.Older.push(r);
    });

    return groups;
  };

  const grouped = groupRecords();

  // ====== NEW SIMPLE CHART (SG SAFE) ======
  const buildChart = () => {
    const todaySG = new Date(
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Singapore",
        dateStyle: "short",
      }).format(new Date())
    );

    const days = [...Array(7)].map((_, i) => {
      const d = new Date(todaySG);
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    const data = days.map((day) => {
      const key = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Singapore",
      }).format(day);

      const total = records
        .filter(
          (r) =>
            new Intl.DateTimeFormat("en-CA", {
              timeZone: "Asia/Singapore",
            }).format(new Date(r.time)) === key
        )
        .reduce((sum, r) => sum + Number(r.amount), 0);

      return {
        date: day,
        total,
        label: day.toLocaleDateString("en-SG", { weekday: "short" }),
      };
    });

    return data;
  };

  const chartData = buildChart();
  const rawMax = Math.max(...chartData.map((d) => d.total), 0);

  // scale nicely to nearest 50 or 100
  const roundedMax =
    rawMax <= 100
      ? 100
      : rawMax <= 200
      ? 200
      : rawMax <= 500
      ? 500
      : Math.ceil(rawMax / 500) * 500;

  const maxValue = roundedMax;

  const getDurationMinutes = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);

    const diffMs = endTime - startTime;
    const diffMinutes = Math.round(diffMs / 60000);

    return diffMinutes;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md mx-auto space-y-5 pb-56">
        {/* Total */}
        <div className="bg-white rounded-2xl shadow p-5 text-center">
          <p className="text-gray-400 text-sm">Today's Total</p>
          <p className="text-4xl font-bold text-blue-600">{total} ml</p>
        </div>

        {/* New Chart */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="font-semibold text-gray-700 mb-3">Last 7 Days</h2>

          <div className="flex items-end gap-3 h-36">
            {chartData.map((d, i) => {
              const ratio = d.total / maxValue;
              const visual = Math.pow(ratio, 0.6);

              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center justify-end relative"
                >
                  <div
                    className="w-full bg-blue-500 rounded-t-lg transition-all duration-500 relative"
                    style={{
                      height: `${visual * 100}%`,
                      minHeight: d.total > 0 ? "14px" : "4px",
                    }}
                  >
                    {d.total > 0 && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-600 font-medium">
                        {d.total}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Spacer so content doesn't hide behind bottom bar */}
        <div className="h-0" />

        {/* Sticky Add record bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
          <div className="max-w-md mx-auto space-y-3">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="text-center w-full border rounded-xl px-4 py-2"
            />

            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="text-center w-full border rounded-xl px-4 py-2"
            />

            <input
              type="number"
              placeholder="Amount (ml)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-center w-full border rounded-xl px-4 py-2"
            />

            <button
              onClick={addMilk}
              disabled={saving}
              className={`w-full py-2 rounded-xl font-medium transition active:scale-95 ${
                saving
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {saving ? "Saving..." : "Add Record"}
            </button>
          </div>
        </div>

        {/* History (GROUPED) */}
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-700">History</h2>

          {loading && (
            <p className="text-gray-400 text-center">Loading records...</p>
          )}

          {!loading && records.length === 0 && (
            <p className="text-gray-400 text-center">
              No records yet. Add your first one.
            </p>
          )}

          {!loading &&
            Object.entries(grouped).map(([title, list]) =>
              list.length > 0 ? (
                <div key={title} className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-500">
                    {title}
                  </h3>

                  {list.map((r) => (
                    <div
                      key={r._id}
                      className="bg-white rounded-2xl shadow p-4 flex justify-between items-center transition-all duration-200 hover:scale-[1.01] hover:shadow-md"
                    >
                      <div className="flex gap-2 items-center">
                        <p className="font-bold text-xl text-blue-500">
                          {r.amount} ml
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(r.startTime).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {" - "}
                          {new Date(r.endTime).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          ({getDurationMinutes(r.startTime, r.endTime)} min)
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => openEdit(r)}
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setConfirmId(r._id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null
            )}
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl space-y-4 w-80 animate-scaleIn">
            <h2 className="text-center font-semibold">Edit Record</h2>

            <input
              type="time"
              value={editStart}
              onChange={(e) => setEditStart(e.target.value)}
              className="w-full border rounded-xl px-3 py-2"
            />

            <input
              type="time"
              value={editEnd}
              onChange={(e) => setEditEnd(e.target.value)}
              className="w-full border rounded-xl px-3 py-2"
            />

            <input
              type="number"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              className="w-full border rounded-xl px-3 py-2"
            />

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 border rounded-xl py-2"
              >
                Cancel
              </button>

              <button
                onClick={saveEdit}
                className="flex-1 bg-blue-600 text-white rounded-xl py-2"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl space-y-4 w-72">
            <p className="text-center font-medium">Delete this record?</p>

            <div className="flex gap-2">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 border rounded-xl py-2"
              >
                Cancel
              </button>

              <button
                onClick={deleteMilk}
                className="flex-1 bg-red-600 text-white rounded-xl py-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
