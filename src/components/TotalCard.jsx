export default function TotalCard({ total }) {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl shadow-lg p-5 text-center animate-fadeIn">
      <p className="text-blue-100 text-xs font-semibold uppercase tracking-widest mb-1">
        Today's Total
      </p>
      <p className="text-5xl font-extrabold text-white tracking-tight">
        {total}
        <span className="text-2xl font-semibold text-blue-200 ml-1">ml</span>
      </p>
    </div>
  );
}
