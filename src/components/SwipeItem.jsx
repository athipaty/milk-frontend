import { useState } from "react";
import { sgDate, sgTime, durationMinutes } from "../utils/date";
import { timeAgo } from "../utils/timeAgo";

export default function SwipeItem({
  record,
  title,
  isLatest,
  onDelete,
  onEdit,
}) {
  const [startX, setStartX] = useState(null);
  const [offsetX, setOffsetX] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const SWIPE_LIMIT = 80;

  const minsAgo = Math.floor((Date.now() - new Date(record.time)) / 60000);

  const gapClass =
    minsAgo >= 240
      ? "bg-red-100 text-red-700"
      : minsAgo >= 120
        ? "bg-yellow-100 text-yellow-700"
        : "bg-blue-100 text-blue-700";

  const handleStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleMove = (e) => {
    if (startX === null) return;
    const currentX = e.touches[0].clientX;
    setOffsetX(currentX - startX);
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
          <div className="flex gap-2 items-center">
            <p className="font-bold text-blue-600">{record.amount} ml</p>

            <p className="text-xs text-gray-400">
              {sgTime(record.startTime)} - {sgTime(record.endTime)} (
              {durationMinutes(record.startTime, record.endTime)} min )
              {isLatest && (
                <span
                  className={`ml-2 inline-flex items-center gap-1
                px-2 py-0.5 rounded-full
                text-xs font-semibold
                ${gapClass}`}
                >
                  {timeAgo(record.time)}
                </span>
              )}
              {title === "Older" && !isLatest && (
                <span className="ml-1">• {sgDate(record.time)}</span>
              )}
            </p>
          </div>

          {isOpen && (
            <button onClick={reset} className="text-xs text-gray-400">
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
