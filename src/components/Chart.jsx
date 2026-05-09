import { sgDate } from "../utils/date";

export default function Chart({ records }) {
  const today = new Date();

  const days = [...Array(7)].map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const data = days.map((day) => {
    const key = sgDate(day);
    const total = records
      .filter((r) => sgDate(r.time) === key)
      .reduce((sum, r) => sum + Number(r.amount), 0);
    return {
      label: day.toLocaleDateString("en-SG", { weekday: "short" }),
      total,
    };
  });

  const max = Math.max(...data.map((d) => Number(d.total) || 0), 1);

  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <h2 className="font-semibold text-gray-700 mb-3">Last 7 Days</h2>

      <div className="flex items-end gap-3 h-36">
        {data.map((d, i) => {
          const safeTotal = Number(d.total) || 0;
          const percent = (safeTotal / max) * 100;
          const barHeight = safeTotal === 0 ? "4px" : `${Math.max(percent, 3)}%`;

          return (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="relative w-full h-28 flex items-end justify-center">
                <div
                  className="w-full bg-blue-500 rounded-t-xl transition-all duration-300 relative"
                  style={{ height: barHeight }}
                >
                  {safeTotal > 0 && (
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] text-gray-600 font-medium">
                      {safeTotal}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[11px] text-gray-400 mt-2">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
