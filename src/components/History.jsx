import { sgDate, sgTime, durationMinutes } from "../utils/date";

export default function History({ records, onDelete, onEdit }) {
  const today = sgDate(new Date());
  const yesterday = sgDate(new Date(Date.now() - 86400000));

  const groups = { Today: [], Yesterday: [], Older: [] };

  records.forEach((r) => {
    const d = sgDate(r.time);
    if (d === today) groups.Today.push(r);
    else if (d === yesterday) groups.Yesterday.push(r);
    else groups.Older.push(r);
  });

  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([title, list]) =>
        list.length > 0 ? (
          <div key={title}>
            <h3 className="text-sm font-semibold text-gray-500 space">{title}</h3>

            {list.map((r) => (
              <div
                key={r._id}
                className="bg-white p-4 rounded-xl shadow flex justify-between"
              >
                <div>
                  <p className="font-bold text-blue-600">{r.amount} ml</p>

                  <p className="text-xs text-gray-400">
                    {sgTime(r.startTime)} - {sgTime(r.endTime)} (
                    {durationMinutes(r.startTime, r.endTime)} min)
                  </p>

                  {title === "Older" && (
                    <p className="text-[11px] text-gray-400 mt-1">
                      {sgDate(r.time)}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => onEdit(r)}
                    className="text-blue-500"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(r._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null
      )}
    </div>
  );
}
