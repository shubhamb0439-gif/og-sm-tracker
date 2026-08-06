export default function StatCard({ label, value, icon: Icon, accent = 'bg-brand-700' }) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className={`h-10 w-10 rounded-xl ${accent} text-white flex items-center justify-center shrink-0`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-2xl font-bold text-brand-900 leading-none">{value}</p>
        <p className="text-xs text-brand-500 mt-1">{label}</p>
      </div>
    </div>
  )
}
