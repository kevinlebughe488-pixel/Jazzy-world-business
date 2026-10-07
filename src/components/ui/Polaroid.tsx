import clsx from "clsx";
import Image from "next/image";
import type { CSSProperties } from "react";

type CouleurRuban = "sauge" | "ocre";

const RUBANS: Record<CouleurRuban, string> = {
  sauge: "bg-sauge/75",
  ocre: "bg-ocre/60",
};

/**
 * Photo façon tirage instantané : cadre clair, bout de ruban adhésif, légende manuscrite.
 * Seule exception au rayon des cartes : un tirage photo a des coins presque droits.
 */
export function Polaroid({
  src,
  alt,
  legende,
  rotation = 0,
  ruban,
  sizes,
  priority,
  className,
  cadrage = "aspect-[4/5]",
}: {
  src: string;
  alt: string;
  legende?: string;
  rotation?: number;
  ruban?: CouleurRuban;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Proportions de la photo */
  cadrage?: string;
}) {
  return (
    <figure
      className={clsx("relative rounded-[6px] bg-carte p-2.5 pb-2 shadow-releve sm:p-3 sm:pb-2.5", className)}
      style={{ rotate: `${rotation}deg` } as CSSProperties}
    >
      {ruban && (
        <span
          aria-hidden="true"
          className={clsx("ruban -top-3 left-1/2 -translate-x-1/2 -rotate-3", RUBANS[ruban])}
        />
      )}
      <div className={clsx("relative overflow-hidden rounded-[3px] bg-lin", cadrage)}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
      {legende && (
        <figcaption className="mt-1.5 px-1 font-plume text-[1.35rem] leading-tight text-encre-doux sm:text-2xl">
          {legende}
        </figcaption>
      )}
    </figure>
  );
}
