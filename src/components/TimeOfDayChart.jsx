import { useMemo } from "react";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function TimeOfDayChart({ records }) {
  const counts = useMemo(() => {
    const map = Array(24).fill(0);
    records.forEach((r) => {
      const hour = new Date(r.startTime).getHours();
      map[hour]++;
    });
    return map;
  }, [records]);

  const max = Math.max(...counts, 1);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <h2 className="text-sm font-bold text-slate-700 mb-4">🕐 Time of Day</h2>

      {/* bars */}
      <div className="flex items-end gap-[2px] h-14">
        {HOURS.map((h) => {
          const count   = counts[h];
          const percent = (count / max) * 100;
          const barH    = count === 0 ? "3px" : `${Math.max(percent, 5)}%`;

          return (
            <div key={h} className="flex-1 h-full flex items-end justify-center">
              <div
                className="w-full rounded-t transition-all duration-300"
                style={{
                  height: barH,
                  backgroundColor: count === 0 ? "#e2e8f0" : "#3b82f6",
                  opacity: count === 0 ? 1 : 0.35 + (count / max) * 0.65,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* time labels */}
      <div className="flex gap-[2px] mt-1">
        {HOURS.map((h) => (
          <div key={h} className="flex-1 flex justify-center">
            {h % 6 === 0 && (
              <span className="text-[9px] text-slate-400 font-medium">
                {h === 0 ? "12a" : h === 12 ? "12p" : h < 12 ? `${h}a` : `${h - 12}p`}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
