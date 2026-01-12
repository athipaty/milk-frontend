import { useEffect, useState } from "react";
import axios from "axios";

// Create axios instance (clean & reusable)
const api = axios.create({
  baseURL: "https://milk-backend-05vv.onrender.com/api/milk",
});

function App() {
  const [records, setRecords] = useState([]);
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState(0);

  // Load all records
  const loadMilk = async () => {
    try {
      const { data } = await api.get("/");
      setRecords(data);
    } catch (err) {
      console.error("Failed to load records", err);
    }
  };

  // Load today total
  const loadTotal = async () => {
    try {
      const { data } = await api.get("/summary/today");
      setTotal(data.total);
    } catch (err) {
      console.error("Failed to load total", err);
    }
  };

  const addMilk = async () => {
    console.log("Add button clicked", amount);

    if (!amount || amount <= 0) {
      return alert("Please enter valid amount");
    }

    try {
      await api.post("/", { amount, type: "breast" });
      setAmount("");
      loadMilk();
      loadTotal();
    } catch (err) {
      console.error("Failed to add record", err);
    }
  };

  // Delete record
  const deleteMilk = async (id) => {
    if (!window.confirm("Delete this record?")) return;

    try {
      await api.delete(`/${id}`);
      loadMilk();
      loadTotal();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadMilk();
      await loadTotal();
    };

    init();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md mx-auto space-y-5">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Milk Tracker</h1>
        </div>

        {/* Total */}
        <div className="bg-white rounded-2xl shadow p-5 text-center">
          <p className="text-gray-400 text-sm">Today's Total</p>
          <p className="text-4xl font-bold text-blue-600">{total} ml</p>
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
            className="w-full bg-blue-600 text-white py-2 rounded-xl font-medium hover:bg-blue-700 active:scale-95 transition"
          >
            Add Record
          </button>
        </div>

        {/* History */}
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-700">History</h2>

          {records.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-2xl shadow p-4 flex justify-between items-center"
            >
              <div className="flex gap-2 items-center">
                <p className="font-bold text-xl text-blue-500">
                  {r.amount} ml
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(r.time).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => deleteMilk(r._id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
