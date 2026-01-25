import { useState } from "react";
import { sgDate, sgTime, durationMinutes } from "../utils/date";

export default function History({ records, onDelete, onEdit }) {
  const today = sgDate(new Date());
  const yesterday = sgDate(new Date(Date.now() - 86400000));

  const groups = { Today: [], Yesterday: [], Older: [] };

  records.forEach((r) => {
    const d = sgDate(r.time);
    if (d === today) groups.Today.push(r);
    else if (d === yesterday) groups.Yesterday.push(r);
    else groups.Older.push(r);
  });

  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([title, list]) =>
        list.length > 0 ? (
          <div key={title}>
            <h3 className="text-sm font-semibold text-gray-500">{title}</h3>

            <div className="space-y-2">
              {list.map((r) => (
                <SwipeItem
                  key={r._id}
                  record={r}
                  title={title}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}

/* ===========================
   Swipeable Row Component
=========================== */
function SwipeItem({ record, title, onDelete, onEdit }) {
  const [startX, setStartX] = useState(null);
  const [offsetX, setOffsetX] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const SWIPE_LIMIT = 80;

  const handleStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleMove = (e) => {
    if (startX === null) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
  };

  const handleEnd = () => {
    if (offsetX > SWIPE_LIMIT) {
      setOffsetX(100);
      setIsOpen("right");
    } else if (offsetX < -SWIPE_LIMIT) {
      setOffsetX(-100);
      setIsOpen("left");
    } else {
      setOffsetX(0);
      setIsOpen(false);
    }
    setStartX(null);
  };

  const reset = () => {
    setOffsetX(0);
    setIsOpen(false);
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Background actions */}
      <div className="absolute inset-0 flex justify-between items-center px-4 text-white text-sm">
        <div
          onClick={() => {
            onEdit(record);
            reset();
          }}
          className="bg-blue-500 px-3 py-2 rounded-lg"
        >
          Edit
        </div>

        <div
          onClick={() => {
            onDelete(record._id);
            reset();
          }}
          className="bg-red-500 px-3 py-2 rounded-lg"
        >
          Delete
        </div>
      </div>

      {/* Foreground card */}
      <div
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        style={{ transform: `translateX(${offsetX}px)` }}
        className="bg-white p-4 rounded-xl shadow transition-transform duration-200"
      >
        <div className="flex justify-between">
          <div className="flex gap-2 justify-start items-center">
            <p className="font-bold text-blue-600">{record.amount} ml</p>

            <p className="text-xs text-gray-400">
              {sgTime(record.startTime)} - {sgTime(record.endTime)} (
              {durationMinutes(record.startTime, record.endTime)} min
              {title === "Older" && ` • ${sgDate(record.time)}`})
            </p>
          </div>

          {isOpen && (
            <button
              onClick={reset}
              className="text-xs text-gray-400"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
