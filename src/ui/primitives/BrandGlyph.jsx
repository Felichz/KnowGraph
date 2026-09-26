// Glifo de marca: tres nodos conectados; el último en iris (G.4).
export function BrandGlyph({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="brand-glyph">
      <rect width="64" height="64" rx="14" fill="#1D1B19" />
      <path d="M18 44 L32 22 L46 40" fill="none" stroke="#938F87" strokeWidth="4" strokeLinecap="round" />
      <circle cx="18" cy="44" r="6" fill="#EEECE7" />
      <circle cx="32" cy="22" r="6" fill="#EEECE7" />
      <circle cx="46" cy="40" r="6" fill="#909CF5" />
    </svg>
  );
}
