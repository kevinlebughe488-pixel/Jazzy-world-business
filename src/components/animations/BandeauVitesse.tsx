"use client";

import clsx from "clsx";
import { useEffect, useRef, type ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  wrap,
} from "framer-motion";
import { useEnergie } from "./Energie";

/**
 * Texte qui défile en boucle. Sa vitesse augmente quand on fait défiler la page
 * (et avec la profondeur de défilement), il s'incline selon la vitesse,
 * et change de sens quand on remonte.
 */
export function BandeauVitesse({
  children,
  vitesseBase = 4,
  sens = 1,
  className,
}: {
  children: ReactNode;
  /** Vitesse au repos, en % de la largeur d'une copie par seconde. */
  vitesseBase?: number;
  sens?: 1 | -1;
  className?: string;
}) {
  const reduit = useReducedMotion();
  const { vitesse, energie } = useEnergie();
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { margin: "100px 0px" });

  const x = useMotionValue(0);
  const actif = useMotionValue(1);
  const direction = useRef<number>(sens);

  useEffect(() => {
    actif.set(reduit ? 0 : 1);
  }, [reduit, actif]);

  const facteurVitesse = useTransform(vitesse, [-2500, 0, 2500], [-6, 0, 6], { clamp: false });
  const inclinaison = useTransform([vitesse, energie, actif], ([v, e, a]: number[]) =>
    a * Math.max(-14, Math.min(14, (v / 3000) * 8 * e)),
  );
  const translation = useTransform(x, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduit || !visible) return;
    const f = facteurVitesse.get();
    if (f < -0.05) direction.current = -sens;
    else if (f > 0.05) direction.current = sens;
    let deplacement = direction.current * vitesseBase * energie.get() * (delta / 1000);
    deplacement += deplacement * Math.abs(f);
    x.set(x.get() - deplacement / 2);
  });

  return (
    <div ref={ref} className={clsx("overflow-hidden", className)}>
      <motion.div
        aria-hidden="true"
        className="flex w-max flex-nowrap will-change-transform"
        style={{ x: translation, skewX: inclinaison }}
      >
        <div className="flex shrink-0 flex-nowrap">{children}</div>
        <div className="flex shrink-0 flex-nowrap">{children}</div>
      </motion.div>
    </div>
  );
}
