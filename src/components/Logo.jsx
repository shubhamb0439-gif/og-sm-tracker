import logo from '../assets/og-logo.png'

export default function Logo({ className = 'h-9 w-auto', showWordmark = true }) {
  return (
    <div className="flex items-center gap-2.5">
      <img src={logo} alt="OG logo" className={`${className} rounded-lg`} />
      {showWordmark && (
        <div className="leading-tight">
          <p className="font-bold text-brand-900 tracking-tight">OG Social</p>
          <p className="text-[11px] text-brand-500 -mt-0.5">Content Tracker</p>
        </div>
      )}
    </div>
  )
}
