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

      const isToday =
        key ===
        new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Singapore" }).format(
          new Date()
        );

      return {
        label: day.toLocaleDateString("en-SG", { weekday: "short" }),
        totalMl,
        avgDuration,
        isToday,
      };
    }),
  [days, records]);

  const maxMl  = Math.max(...data.map((d) => d.totalMl), 1);
  const maxDur = Math.max(...data.map((d) => d.avgDuration), 1);

  const Bar = ({ value, max, isToday, colorActive, colorToday, label }) => {
    const pct    = (value / max) * 100;
    const height = value === 0 ? "4px" : `${Math.max(pct, 6)}%`;
    const bg     = value === 0 ? "#e2e8f0" : isToday ? colorToday : colorActive;

    return (
      <div
        className="relative w-full flex items-end justify-center"
        style={{ height: "4.5rem" }}
      >
        <div
          className="w-full rounded-t-lg transition-all duration-500"
          style={{ height, backgroundColor: bg }}
        >
          {value > 0 && (
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-slate-500 font-semibold whitespace-nowrap">
              {label}
            </span>
          )}
        </div>
      </div>
    );
  };

  const Section = ({ title, dataKey, colorActive, colorToday, suffix }) => (
    <div>
      <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-5">
        {title}
      </p>
      <div className="flex items-end gap-1.5">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <Bar
              value={d[dataKey]}
              max={dataKey === "totalMl" ? maxMl : maxDur}
              isToday={d.isToday}
              colorActive={colorActive}
              colorToday={colorToday}
              label={`${d[dataKey]}${suffix}`}
            />
            <span
              className={`text-[10px] mt-1 font-medium ${
                d.isToday ? "text-blue-600" : "text-slate-400"
              }`}
            >
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-5">
      <h2 className="text-sm font-bold text-slate-700">📊 7-Day Overview</h2>

      <Section
        title="Total ml"
        dataKey="totalMl"
        colorActive="#93c5fd"
        colorToday="#2563eb"
        suffix=""
      />

      <div className="border-t border-slate-100" />

      <Section
        title="Avg duration (min)"
        dataKey="avgDuration"
        colorActive="#6ee7b7"
        colorToday="#059669"
        suffix=" min"
      />
    </div>
  );
}
