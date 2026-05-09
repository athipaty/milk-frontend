import { useState, useRef } from "react";
import { sgDate, sgTime, durationMinutes } from "../utils/date";
import { timeAgo } from "../utils/timeAgo";

export default function SwipeItem({
  record,
  title,
  isLatest,
  onDelete,
  onEdit,
}) {
  const [offsetX, setOffsetX] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const startXRef = useRef(null);
  const isDraggingRef = useRef(false);

  const SWIPE_LIMIT = 80;

  const minsAgo = Math.floor((Date.now() - new Date(record.time)) / 60000);

  const gapClass =
    minsAgo >= 240
      ? "bg-red-100 text-red-700"
      : minsAgo >= 120
        ? "bg-yellow-100 text-yellow-700"
        : "bg-blue-100 text-blue-700";

  const handleDragStart = (clientX) => {
    startXRef.current = clientX;
    isDraggingRef.current = false;
  };

  const handleDragMove = (clientX) => {
    if (startXRef.current === null) return;
    const delta = clientX - startXRef.current;
    if (Math.abs(delta) > 5) isDraggingRef.current = true;
    setOffsetX(delta);
  };

  const handleDragEnd = () => {
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
    startXRef.current = null;
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
          onClick={() => { onEdit(record); reset(); }}
          className="bg-blue-500 px-3 py-2 rounded-lg cursor-pointer"
        >
          Edit
        </div>
        <div
          onClick={() => { onDelete(record._id); reset(); }}
          className="bg-red-500 px-3 py-2 rounded-lg cursor-pointer"
        >
          Delete
        </div>
      </div>

      {/* Foreground card */}
      <div
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => { if (startXRef.current !== null) handleDragMove(e.clientX); }}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        style={{ transform: `translateX(${offsetX}px)` }}
        className="bg-white p-4 rounded-xl shadow transition-transform duration-200 select-none cursor-grab active:cursor-grabbing"
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
