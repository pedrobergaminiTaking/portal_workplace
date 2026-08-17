type RingsVariant = "dark" | "light" | "orange" | "hero";

const VARIANTS: Record<
  RingsVariant,
  { background: string; stroke: string; tile: number; radius: number; strokeWidth: number }
> = {
  dark: { background: "#111111", stroke: "#2b2b2b", tile: 24, radius: 9, strokeWidth: 5 },
  light: { background: "#f5f5f5", stroke: "#e2e2e2", tile: 24, radius: 9, strokeWidth: 5 },
  orange: { background: "#ff5a1f", stroke: "#e04d15", tile: 24, radius: 9, strokeWidth: 5 },
  hero: { background: "#111111", stroke: "#242424", tile: 28, radius: 10, strokeWidth: 5 },
};

/**
 * Textura de anéis interligados da identidade Taking. Uso decorativo
 * (heroes, divisores de seção, cartões de destaque) — nunca atrás de texto longo.
 */
export function RingsPattern({
  variant = "dark",
  className,
}: {
  variant?: RingsVariant;
  className?: string;
}) {
  const { background, stroke, tile, radius, strokeWidth } = VARIANTS[variant];
  const patternId = `rings-${variant}`;

  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={patternId}
          width={tile}
          height={tile}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={0} cy={0} r={radius} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
          <circle cx={tile} cy={tile} r={radius} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
          <circle cx={tile} cy={0} r={radius} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
          <circle cx={0} cy={tile} r={radius} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={background} />
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
