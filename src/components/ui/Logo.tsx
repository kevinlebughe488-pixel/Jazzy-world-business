import clsx from "clsx";
import Image from "next/image";
import { boutique } from "@/lib/catalogue";

/** Logo officiel de la boutique (image d'origine, fond transparent, jamais retouchée). */
export function Logo({ prioritaire = false, className }: { prioritaire?: boolean; className?: string }) {
  return (
    <span className={clsx("inline-flex", className)}>
      <Image
        src="/brand/logo.webp"
        alt={boutique.nom}
        width={640}
        height={308}
        priority={prioritaire}
        className="h-9 w-auto lg:h-10"
      />
    </span>
  );
}
