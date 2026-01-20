import { useState } from "react";
import { sgDate, sgTime, durationMinutes } from "../utils/date";

export default function History({ records, onDelete, onEdit }) {
  const today = sgDate(new Date());

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = sgDate(yesterdayDate);

  const groups = { Today: [], Yesterday: [], Older: [] };

  records.forEach((r) => {
    const d = sgDate(r.time);
    if (d === today) groups.Today.push(r);
    else if (d === yesterday) groups.Yesterday.push(r);
    else groups.Older.push(r);
  });

  // ================= SWIPE LOGIC =================
  const [startX, setStartX] = useState(null);
  const SWIPE_THRESHOLD = 80;

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e, record) => {
    if (startX === null) return;

    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    // Swipe right → Edit
    if (diff > SWIPE_THRESHOLD) {
      onEdit(record);
    }

    // Swipe left → Delete (with confirm)
    if (diff < -SWIPE_THRESHOLD) {
      const ok = window.confirm("Delete this record?");
      if (ok) onDelete(record._id);
    }

    setStartX(null);
  };

  // ================= UI =================
  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([title, list]) =>
        list.length > 0 ? (
          <div key={title}>
            <h3 className="text-sm font-semibold text-gray-500">
              {title}
            </h3>

            {list.map((r) => (
              <div
                key={r._id}
                onTouchStart={handleTouchStart}
                onTouchEnd={(e) => handleTouchEnd(e, r)}
                className="bg-white px-4 py-2 rounded-xl shadow flex justify-between border my-1"
              >
                <div>
                  <p className="font-bold text-blue-600">{r.amount} ml</p>

                  <p className="text-xs text-gray-400">
                    {sgTime(r.startTime)} - {sgTime(r.endTime)} (
                    {durationMinutes(r.startTime, r.endTime)} min)
                    {title === "Older" && ` • ${sgDate(r.time)}`}
                  </p>
                </div>

                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => onEdit(r)}
                    className="text-blue-500"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(r._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null,
      )}
    </div>
  );
}
