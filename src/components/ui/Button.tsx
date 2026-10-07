import clsx from "clsx";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

type Variante = "primaire" | "secondaire" | "whatsapp" | "fantome" | "inverse";

const styles: Record<Variante, string> = {
  primaire: "bg-encre text-papier hover:bg-encre-doux",
  secondaire: "bg-carte text-encre ring-1 ring-inset ring-trait-fort hover:ring-encre/45",
  whatsapp: "bg-whatsapp text-encre hover:bg-whatsapp-fonce",
  fantome: "text-encre hover:bg-encre/5",
  /** Bouton clair, pour les cartes sombres */
  inverse: "bg-papier text-encre hover:bg-lin focus-visible:outline-papier",
};

const base =
  "group/bouton inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 text-[0.95rem] font-medium whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-300 ease-[var(--ease-doux)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-encre disabled:pointer-events-none disabled:opacity-50";

type Commun = {
  variante?: Variante;
  /** Pastille ocre avec une flèche, en fin de bouton (appel principal de la page). */
  fleche?: boolean;
  className?: string;
  children: ReactNode;
};

function Fleche() {
  return (
    <span
      aria-hidden="true"
      className="-mr-3.5 grid size-9 shrink-0 place-items-center rounded-full bg-ocre text-encre transition-transform duration-300 ease-[var(--ease-doux)] group-hover/bouton:translate-x-0.5"
    >
      <ArrowRight className="size-4" strokeWidth={2.2} />
    </span>
  );
}

export function Button({
  variante = "primaire",
  fleche,
  className,
  children,
  type = "button",
  ...props
}: Commun & Omit<ComponentProps<"button">, "children">) {
  return (
    <button type={type} className={clsx(base, styles[variante], className)} {...props}>
      {children}
      {fleche && <Fleche />}
    </button>
  );
}

export function ButtonLink({
  href,
  variante = "primaire",
  fleche,
  className,
  children,
  externe,
}: Commun & { href: string; externe?: boolean }) {
  const classes = clsx(base, styles[variante], className);
  if (externe) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
        {fleche && <Fleche />}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
      {fleche && <Fleche />}
    </Link>
  );
}
