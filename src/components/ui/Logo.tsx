import clsx from "clsx";
import Image from "next/image";
import { boutique } from "@/lib/catalogue";

/**
 * Logo officiel de la boutique (image d'origine, jamais retouchée).
 * Sur fond noir (`surFondNoir`), il est posé sur une plaque blanche pour rester lisible sans changer ses couleurs.
 */
export function Logo({
  surFondNoir = false,
  prioritaire = false,
  className,
}: {
  surFondNoir?: boolean;
  prioritaire?: boolean;
  className?: string;
}) {
  return (
    <span className={clsx("inline-flex", surFondNoir && "bg-white px-3 py-2", className)}>
      <Image
        src="/brand/logo.webp"
        alt={boutique.nom}
        width={640}
        height={308}
        priority={prioritaire}
        className={surFondNoir ? "h-12 w-auto" : "h-9 w-auto lg:h-11"}
      />
    </span>
  );
}
