export default function TotalCard({ total }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5 text-center">
      <p className="text-gray-400 text-sm">Today's Total</p>
      <p className="text-4xl font-bold text-blue-600">{total} ml</p>
    </div>
  );
}
