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

  const addMilk = async () => {
    if (!amount || amount <= 0) {
      return alert("Please enter valid amount");
    }

    try {
      setSaving(true);
      await api.post("/", { amount, type: "breast" });
      setAmount("");
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

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === yesterday.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return date.toLocaleDateString();
  };

  // =========================
  // 📅 GROUP BY DATE LOGIC
  // =========================
  const groupRecords = () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    const groups = {
      Today: [],
      Yesterday: [],
      Older: [],
    };

    records.forEach((r) => {
      const d = new Date(r.time).toDateString();
      if (d === today) groups.Today.push(r);
      else if (d === yesterday) groups.Yesterday.push(r);
      else groups.Older.push(r);
    });

    return groups;
  };

  const grouped = groupRecords();

  // =====================
  // 📊 CHART LOGIC (unchanged)
  // =====================
  const getChartData = () => {
    const days = [...Array(7)]
      .map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toDateString();
      })
      .reverse();

    const totals = days.map((day) => {
      return records
        .filter((r) => new Date(r.time).toDateString() === day)
        .reduce((sum, r) => sum + Number(r.amount), 0);
    });

    return { days, totals };
  };

  const { days, totals } = getChartData();
  const max = Math.max(...totals, 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md mx-auto space-y-5">

        {/* Total */}
        <div className="bg-white rounded-2xl shadow p-5 text-center">
          <p className="text-gray-400 text-sm">Today's Total</p>
          <p className="text-4xl font-bold text-blue-600">{total} ml</p>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="font-semibold text-gray-700 mb-3">Last 7 Days</h2>

          <div className="flex items-end gap-2 h-32">
            {totals.map((value, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t-md"
                  style={{
                    height: `${(value / max) * 100}%`,
                    minHeight: value > 0 ? "6px" : "0px",
                  }}
                />
                <span className="text-[10px] text-gray-400 mt-1">
                  {new Date(days[i]).toLocaleDateString(undefined, {
                    weekday: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Add record */}
        <div className="bg-white rounded-2xl shadow p-5 space-y-4">
          <input
            type="number"
            placeholder="Amount (ml)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-center w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={addMilk}
            disabled={saving}
            className={`w-full py-2 rounded-xl font-medium transition ${
              saving
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
            }`}
          >
            {saving ? "Saving..." : "Add Record"}
          </button>
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
                      className="bg-white rounded-2xl shadow p-4 flex justify-between items-center"
                    >
                      <div className="flex gap-2 items-center">
                        <p className="font-bold text-xl text-blue-500">
                          {r.amount} ml
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatTime(r.time)}
                        </p>
                      </div>

                      <button
                        onClick={() => setConfirmId(r._id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : null
            )}
        </div>
      </div>

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
