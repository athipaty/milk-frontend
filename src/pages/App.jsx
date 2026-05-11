import { useState } from "react";
import useMilk from "../hooks/useMilk";

import TotalCard from "../components/TotalCard";
import StatsStrip from "../components/StatsStrip";
import Chart from "../components/Chart";
import TimeOfDayChart from "../components/TimeOfDayChart";
import History from "../components/History";
import AddBar from "../components/AddBar";
import DeleteModal from "../components/DeleteModal";
import EditModal from "../components/EditModal";

export default function App() {
  const {
    records,
    total,
    loading,
    error,
    addRecord,
    removeRecord,
    editRecord,
  } = useMilk();

  const [confirmId, setConfirmId] = useState(null);
  const [editing, setEditing] = useState(null);

  return (
    <div className="min-h-screen bg-slate-100 pb-60">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-2">
          <span className="text-2xl">🍼</span>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Milk Tracker</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-3">
        <TotalCard total={total} />
        <StatsStrip records={records} />
        <Chart records={records} />
        <TimeOfDayChart records={records} />

        {loading && (
          <div className="flex items-center justify-center gap-2 py-4 text-slate-400 text-sm">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Loading…
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-3 text-sm text-center animate-fadeIn">
            ⚠️ {error}
          </div>
        )}

        <History
          records={records}
          onDelete={(id) => setConfirmId(id)}
          onEdit={(record) => setEditing(record)}
        />
      </div>

      <AddBar onAdd={addRecord} />

      {confirmId && (
        <DeleteModal
          onCancel={() => setConfirmId(null)}
          onConfirm={() => {
            removeRecord(confirmId);
            setConfirmId(null);
          }}
        />
      )}

      {editing && (
        <EditModal
          record={editing}
          onClose={() => setEditing(null)}
          onSave={(id, payload) => {
            editRecord(id, payload);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
