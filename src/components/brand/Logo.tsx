import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Logotipo oficial (arte-final em fundo preto). O arquivo fonte é um
 * quadrado com a marca centralizada numa faixa horizontal fina — usamos
 * object-cover num contêiner baixo/largo para recortar as bordas e mostrar
 * só a faixa da marca, sem precisar de uma versão já cortada do asset.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-8 w-[168px]", className)}>
      <Image
        src="/brand/logo/FUNDO-PRETO-GRUPO-TAKING-HORINZOTAL.png"
        alt="Grupo Taking"
        fill
        sizes="168px"
        className="object-cover object-center"
        priority
      />
    </div>
  );
}
