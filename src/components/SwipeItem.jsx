import { useState, useRef } from "react";
import { sgDate, sgTime, durationMinutes } from "../utils/date";
import { timeAgo } from "../utils/timeAgo";

export default function SwipeItem({ record, title, isLatest, onDelete, onEdit }) {
  const [offsetX, setOffsetX]   = useState(0);
  const [isOpen, setIsOpen]     = useState(false);
  const startXRef               = useRef(null);
  const isDraggingRef           = useRef(false);
  const SWIPE_LIMIT             = 72;

  const minsAgo = Math.floor((Date.now() - new Date(record.time)) / 60000);

  const badgeClass =
    minsAgo >= 240
      ? "bg-red-100 text-red-600"
      : minsAgo >= 120
        ? "bg-amber-100 text-amber-600"
        : "bg-blue-100 text-blue-600";

  const handleDragStart = (clientX) => {
    startXRef.current   = clientX;
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
      setOffsetX(90);
      setIsOpen("right");
    } else if (offsetX < -SWIPE_LIMIT) {
      setOffsetX(-90);
      setIsOpen("left");
    } else {
      setOffsetX(0);
      setIsOpen(false);
    }
    startXRef.current = null;
  };

  const reset = () => { setOffsetX(0); setIsOpen(false); };

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Background action buttons */}
      <div className="absolute inset-0 flex justify-between items-stretch">
        {/* Edit — left */}
        <button
          onClick={() => { onEdit(record); reset(); }}
          className="flex items-center gap-1.5 bg-blue-500 text-white text-sm font-semibold px-5 rounded-l-2xl"
        >
          ✏️ Edit
        </button>
        {/* Delete — right */}
        <button
          onClick={() => { onDelete(record._id); reset(); }}
          className="flex items-center gap-1.5 bg-red-500 text-white text-sm font-semibold px-5 rounded-r-2xl"
        >
          🗑️ Delete
        </button>
      </div>

      {/* Foreground card */}
      <div
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e)  => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
        onMouseDown={(e)  => handleDragStart(e.clientX)}
        onMouseMove={(e)  => { if (startXRef.current !== null) handleDragMove(e.clientX); }}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        style={{ transform: `translateX(${offsetX}px)` }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 px-4 py-3.5 transition-transform duration-200 select-none cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center justify-between gap-2">
          {/* Left: amount + time */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-blue-50 rounded-xl px-3 py-1.5 text-center shrink-0">
              <p className="text-base font-bold text-blue-600 leading-none">{record.amount}</p>
              <p className="text-[9px] text-blue-400 font-semibold">ml</p>
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">
                {sgTime(record.startTime)} – {sgTime(record.endTime)}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {durationMinutes(record.startTime, record.endTime)} min
                {title === "Older" && !isLatest && (
                  <span className="ml-1">· {sgDate(record.time)}</span>
                )}
              </p>
            </div>
          </div>

          {/* Right: badge or close */}
          <div className="shrink-0">
            {isOpen ? (
              <button
                onClick={reset}
                className="text-xs text-slate-400 bg-slate-100 rounded-lg px-2 py-1"
              >
                ✕
              </button>
            ) : isLatest ? (
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold ${badgeClass}`}>
                🕐 {timeAgo(record.time)}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
