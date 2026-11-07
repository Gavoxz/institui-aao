export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="24" height="24" stroke="#2E6BFF" strokeWidth="2" />
        <path d="M8 8v10M18 8v10" stroke="#fff" strokeWidth="2" />
        <path d="M13 8v10" stroke="#2E6BFF" strokeWidth="2" />
      </svg>
      <span className="text-[15px] font-semibold tracking-[0.24em]">INIA</span>
    </span>
  );
}
