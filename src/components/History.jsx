import { useMemo } from "react";
import SwipeItem from "./SwipeItem";
import { sgDate } from "../utils/date";

export default function History({ records, onDelete, onEdit }) {
  // Calculate today & yesterday once
  const { today, yesterday } = useMemo(() => {
    const now = new Date();

    const today = sgDate(now);

    const y = new Date(now);
    y.setDate(y.getDate() - 1);
    const yesterday = sgDate(y);

    return { today, yesterday };
  }, []);

  // Group records
  const groups = { Today: [], Yesterday: [], Older: [] };

  records.forEach((r) => {
    const d = sgDate(r.time);
    if (d === today) groups.Today.push(r);
    else if (d === yesterday) groups.Yesterday.push(r);
    else groups.Older.push(r);
  });

  // Find latest record id
  const latestId = useMemo(() => {
    if (records.length === 0) return null;

    return [...records]
      .sort((a, b) => new Date(b.time) - new Date(a.time))[0]
      ._id;
  }, [records]);

  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([title, list]) =>
        list.length > 0 ? (
          <div key={title}>
            <h3 className="text-sm font-semibold text-gray-500">
              {title}
            </h3>

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
