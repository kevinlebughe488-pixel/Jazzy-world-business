import clsx from "clsx";

/** Logo typographique de la boutique (noir sur blanc par défaut, `clair` pour les fonds noirs). */
export function Logo({ clair = false, className }: { clair?: boolean; className?: string }) {
  return (
    <span className={clsx("flex flex-col items-center leading-none", clair ? "text-white" : "text-noir", className)}>
      <span className="font-affiche text-[1.55rem] uppercase tracking-[0.06em] lg:text-[1.8rem]">Jazzy World</span>
      <span className="mt-[3px] pl-[0.6em] text-[0.5rem] font-bold uppercase tracking-[0.6em] lg:text-[0.55rem]">
        Business
      </span>
    </span>
  );
}
