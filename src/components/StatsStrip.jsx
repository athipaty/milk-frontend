import { useMemo } from "react";
import { sgDate, durationMinutes } from "../utils/date";

export default function StatsStrip({ records }) {
  const stats = useMemo(() => {
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Singapore",
    }).format(new Date());

    const todayRecords = records.filter((r) => sgDate(r.time) === today);
    const count = todayRecords.length;

    if (count === 0) return { count: 0, avgAmount: 0, avgDuration: 0 };

    const totalAmount = todayRecords.reduce((s, r) => s + Number(r.amount), 0);
    const totalDuration = todayRecords.reduce(
      (s, r) => s + durationMinutes(r.startTime, r.endTime),
      0
    );

    return {
      count,
      avgAmount: Math.round(totalAmount / count),
      avgDuration: Math.round(totalDuration / count),
    };
  }, [records]);

  const items = [
    { value: stats.count, label: "sessions" },
    { value: `${stats.avgAmount} ml`, label: "avg / session" },
    { value: `${stats.avgDuration} min`, label: "avg duration" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow px-4 py-3 flex divide-x divide-gray-100">
      {items.map(({ value, label }) => (
        <div key={label} className="flex-1 flex flex-col items-center gap-0.5">
          <span className="text-lg font-bold text-blue-600">{value}</span>
          <span className="text-[11px] text-gray-400">{label}</span>
        </div>
      ))}
    </div>
  );
}
