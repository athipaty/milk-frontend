import { useState } from "react";
import { sgDate, sgTime, durationMinutes } from "../utils/date";

const SWIPE_THRESHOLD = 120;
const MAX_SWIPE = 150;

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

  // ===== Swipe State per item =====
  const [touchStart, setTouchStart] = useState(null);
  const [swipeX, setSwipeX] = useState(0);
  const [activeId, setActiveId] = useState(null);

  const handleTouchStart = (e, id) => {
    setTouchStart(e.touches[0].clientX);
    setActiveId(id);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;

    const currentX = e.touches[0].clientX;
    let diff = currentX - touchStart;

    // limit movement
    if (diff > MAX_SWIPE) diff = MAX_SWIPE;
    if (diff < -MAX_SWIPE) diff = -MAX_SWIPE;

    setSwipeX(diff);
  };

  const handleTouchEnd = (record) => {
    if (!touchStart) return;

    if (swipeX > SWIPE_THRESHOLD) {
      onEdit(record);
    }

    if (swipeX < -SWIPE_THRESHOLD) {
      if (window.confirm("Delete this record?")) {
        onDelete(record._id);
      }
    }

    // snap back
    setSwipeX(0);
    setTouchStart(null);
    setActiveId(null);
  };

  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([title, list]) =>
        list.length > 0 ? (
          <div key={title}>
            <h3 className="text-sm font-semibold text-gray-500">
              {title}
            </h3>

            {list.map((r) => {
              const isActive = activeId === r._id;

              return (
                <div key={r._id} className="relative overflow-hidden my-1 rounded-xl">
                  
                  {/* Background layer */}
                  <div className="absolute inset-0 flex justify-between items-center px-4 text-white text-sm">
                    <div className="bg-blue-500 px-3 py-1 rounded-lg">
                      Edit
                    </div>
                    <div className="bg-red-500 px-3 py-1 rounded-lg">
                      Delete
                    </div>
                  </div>

                  {/* Foreground swipe card */}
                  <div
                    onTouchStart={(e) => handleTouchStart(e, r._id)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={() => handleTouchEnd(r)}
                    style={{
                      transform: isActive ? `translateX(${swipeX}px)` : "translateX(0)",
                      transition: touchStart ? "none" : "transform 0.25s ease",
                    }}
                    className="bg-white px-4 py-2 rounded-xl shadow border flex justify-between relative z-10"
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
                      <button onClick={() => onEdit(r)} className="text-blue-500">
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
                </div>
              );
            })}
          </div>
        ) : null,
      )}
    </div>
  );
}
