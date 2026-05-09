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
    <div className="bg-white rounded-2xl shadow p-5">
      <h2 className="font-semibold text-gray-700 mb-3">Time of Day</h2>

      {/* bars */}
      <div className="flex items-end gap-[3px] h-16">
        {HOURS.map((h) => {
          const count = counts[h];
          const percent = (count / max) * 100;
          const barHeight = count === 0 ? "3px" : `${Math.max(percent, 5)}%`;

          return (
            <div key={h} className="flex-1 h-full flex items-end justify-center">
              <div
                className="w-full rounded-t transition-all duration-300"
                style={{
                  height: barHeight,
                  backgroundColor: count === 0 ? "#e5e7eb" : "#3b82f6",
                  opacity: count === 0 ? 1 : 0.4 + (count / max) * 0.6,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* time labels */}
      <div className="flex gap-[3px] mt-1">
        {HOURS.map((h) => (
          <div key={h} className="flex-1 flex justify-center">
            {h % 6 === 0 && (
              <span className="text-[9px] text-gray-400">
                {h === 0 ? "12a" : h === 12 ? "12p" : h < 12 ? `${h}a` : `${h - 12}p`}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
