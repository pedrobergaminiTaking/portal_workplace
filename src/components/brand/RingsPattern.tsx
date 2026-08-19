type RingsVariant = "dark" | "light" | "orange" | "hero";

// Os nomes dos arquivos não batem com a cor real do conteúdo (herdado dos
// exports originais da identidade visual) — mapeado aqui pelo que cada
// arquivo realmente mostra, não pelo nome do arquivo.
//
// `period` é o tamanho real (em px, na resolução nativa do arquivo) em que
// o padrão se repete sem emenda — medido por autocorrelação de pixel
// (comparando uma faixa horizontal da imagem com ela mesma deslocada em N
// px e achando o menor deslocamento com diferença ~0). Usar o arquivo
// inteiro como ladrilho (tamanho nativo) deixa uma emenda visível porque a
// tela exportada não é um múltiplo exato do período real do padrão.
const VARIANT_IMAGE: Record<
  RingsVariant,
  { src: string; fallback: string; naturalSize: number; period: number }
> = {
  dark: {
    src: "/brand/patterns/PATTERN_MEDIA_CINZA_TAKING.png",
    fallback: "#111111",
    naturalSize: 1080,
    period: 175,
  },
  hero: {
    src: "/brand/patterns/PATTERN_GRANDE_CINZAMEDIO_TAKING@0.5x.png",
    fallback: "#111111",
    naturalSize: 540,
    period: 197,
  },
  orange: {
    src: "/brand/patterns/PATTERN_UNIDADE_CINZA_TAKING@3x.png",
    fallback: "#ff5a1f",
    naturalSize: 3240,
    period: 394,
  },
  light: {
    src: "/brand/patterns/PATTERN_PEQUENA_LARANJA_TAKING@3x.png",
    fallback: "#f5f5f5",
    naturalSize: 3240,
    period: 394,
  },
};

/**
 * Textura de anéis interligados da identidade Taking (asset oficial, não
 * uma reprodução em SVG). Uso decorativo (heroes, divisores de seção,
 * cartões de destaque) — nunca atrás de texto longo.
 *
 * O `<pattern>` do SVG usa o tile no tamanho do período real (ver acima) em
 * vez do tamanho do arquivo inteiro, para repetir sem emenda; o `<image>`
 * dentro do tile mantém o tamanho nativo do arquivo e é recortado pelo
 * próprio tile, sem distorcer o desenho.
 */
export function RingsPattern({
  variant = "dark",
  className,
}: {
  variant?: RingsVariant;
  className?: string;
}) {
  const { src, fallback, naturalSize, period } = VARIANT_IMAGE[variant];
  const patternId = `rings-${variant}`;

  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <pattern id={patternId} width={period} height={period} patternUnits="userSpaceOnUse">
          <rect width={period} height={period} fill={fallback} />
          <image href={src} x={0} y={0} width={naturalSize} height={naturalSize} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
