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
    <div className="min-h-screen bg-gray-50 p-4 pb-56">
      <div className="max-w-md mx-auto space-y-4">
        <TotalCard total={total} />
        <StatsStrip records={records} />
        <Chart records={records} />
        <TimeOfDayChart records={records} />

        {loading && <p className="text-center text-gray-400">Loading...</p>}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm text-center">
            {error}
          </div>
        )}

        <History
          records={records}
          onDelete={(id) => setConfirmId(id)}
          onEdit={(record) => setEditing(record)}
        />
      </div>
      <div></div>

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
