import { useMemo } from "react";
import SwipeItem from "./SwipeItem";
import { sgDate } from "../utils/date";

export default function History({ records, onDelete, onEdit }) {
  const { today, yesterday } = useMemo(() => {
    const now = new Date();
    const today = sgDate(now);
    const y = new Date(now);
    y.setDate(y.getDate() - 1);
    const yesterday = sgDate(y);
    return { today, yesterday };
  }, []);

  const groups = { Today: [], Yesterday: [], Older: [] };
  records.forEach((r) => {
    const d = sgDate(r.startTime);
    if (d === today) groups.Today.push(r);
    else if (d === yesterday) groups.Yesterday.push(r);
    else groups.Older.push(r);
  });

  const latestId = useMemo(() => {
    if (records.length === 0) return null;
    return [...records].sort((a, b) => new Date(b.time) - new Date(a.time))[0]._id;
  }, [records]);

  const hasAny = Object.values(groups).some((list) => list.length > 0);

  if (!hasAny) {
    return (
      <div className="text-center py-10 text-slate-400 text-sm animate-fadeIn">
        <p className="text-3xl mb-2">🍼</p>
        <p>No records yet — add your first session!</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      <h2 className="text-sm font-bold text-slate-700">📋 History</h2>
      {Object.entries(groups).map(([title, list]) =>
        list.length > 0 ? (
          <div key={title} className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                {title}
              </p>
              <span className="flex-1 h-px bg-slate-200" />
              <span className="text-[11px] text-slate-400 font-medium">
                {list.length} session{list.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-2">
              {list.map((r) => (
                <SwipeItem
                  key={r._id}
                  record={r}
                  title={title}
                  isLatest={r._id === latestId}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}
