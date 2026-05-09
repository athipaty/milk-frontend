import { useMemo } from "react";
import { sgDate, durationMinutes } from "../utils/date";

export default function Chart({ records }) {
  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      return d;
    });
  }, []);

  const data = useMemo(() =>
    days.map((day) => {
      const key = sgDate(day);
      const dayRecords = records.filter((r) => sgDate(r.startTime) === key);

      const totalMl = dayRecords.reduce((s, r) => s + Number(r.amount), 0);
      const avgDuration =
        dayRecords.length === 0
          ? 0
          : Math.round(
              dayRecords.reduce(
                (s, r) => s + durationMinutes(r.startTime, r.endTime),
                0
              ) / dayRecords.length
            );

      return {
        label: day.toLocaleDateString("en-SG", { weekday: "short" }),
        totalMl,
        avgDuration,
      };
    }),
  [days, records]);

  const maxMl = Math.max(...data.map((d) => d.totalMl), 1);
  const maxDur = Math.max(...data.map((d) => d.avgDuration), 1);

  const Bar = ({ value, max, color, label }) => {
    const pct = (value / max) * 100;
    const height = value === 0 ? "3px" : `${Math.max(pct, 4)}%`;
    return (
      <div className="relative w-full flex items-end justify-center" style={{ height: "4rem" }}>
        <div
          className={`w-full rounded-t-lg transition-all duration-300 relative ${color}`}
          style={{ height }}
        >
          {value > 0 && (
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 font-medium whitespace-nowrap">
              {label}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow p-5 space-y-4">
      {/* ml chart */}
      <div>
        <p className="text-xs text-gray-400 font-medium mb-1">Total ml</p>
        <div className="flex items-end gap-2">
          {data.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <Bar value={d.totalMl} max={maxMl} color="bg-blue-500" label={`${d.totalMl}`} />
              <span className="text-[10px] text-gray-400 mt-1">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* duration chart */}
      <div>
        <p className="text-xs text-gray-400 font-medium mb-1">Avg duration (min)</p>
        <div className="flex items-end gap-2">
          {data.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <Bar value={d.avgDuration} max={maxDur} color="bg-emerald-400" label={`${d.avgDuration}`} />
              <span className="text-[10px] text-gray-400 mt-1">{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
