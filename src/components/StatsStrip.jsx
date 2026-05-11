import { useMemo } from "react";
import { sgDate, durationMinutes } from "../utils/date";

export default function StatsStrip({ records }) {
  const stats = useMemo(() => {
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Singapore",
    }).format(new Date());

    const todayRecords = records.filter((r) => sgDate(r.startTime) === today);
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
    { icon: "🍼", value: stats.count, label: "Sessions" },
    { icon: "💧", value: `${stats.avgAmount} ml`, label: "Avg / session" },
    { icon: "⏱️", value: `${stats.avgDuration} min`, label: "Avg duration" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-2 py-3 flex divide-x divide-slate-100">
      {items.map(({ icon, value, label }) => (
        <div key={label} className="flex-1 flex flex-col items-center gap-0.5 px-2">
          <span className="text-base">{icon}</span>
          <span className="text-base font-bold text-slate-800">{value}</span>
          <span className="text-[10px] text-slate-400 font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
}
