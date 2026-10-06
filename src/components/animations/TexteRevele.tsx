"use client";

import clsx from "clsx";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useProgression } from "./useProgression";

type Decalage = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

/**
 * Paragraphe dont les mots s'allument un par un au fil du défilement
 * (la lecture avance avec le doigt / la molette).
 */
export function TexteRevele({
  texte,
  className,
  classeMot,
  decalage = ["start 85%", "end 45%"],
  opaciteDepart = 0.14,
}: {
  texte: string;
  className?: string;
  classeMot?: string;
  decalage?: Decalage;
  opaciteDepart?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  // Animations réduites : tous les mots restent allumés (progression figée à 1).
  const progression = useProgression(ref, decalage, false, 1);
  const mots = texte.split(" ");

  return (
    <p ref={ref} className={clsx("flex flex-wrap", className)}>
      <span className="sr-only">{texte}</span>
      {mots.map((mot, i) => {
        const debut = i / mots.length;
        const fin = Math.min(1, debut + 1.5 / mots.length);
        return (
          <Mot
            key={i}
            progression={progression}
            plage={[debut, fin]}
            opaciteDepart={opaciteDepart}
            className={classeMot}
          >
            {mot}
          </Mot>
        );
      })}
    </p>
  );
}

function Mot({
  children,
  progression,
  plage,
  opaciteDepart,
  className,
}: {
  children: string;
  progression: MotionValue<number>;
  plage: [number, number];
  opaciteDepart: number;
  className?: string;
}) {
  const opacite = useTransform(progression, plage, [opaciteDepart, 1]);
  const y = useTransform(progression, plage, ["0.35em", "0em"]);
  return (
    <span aria-hidden="true" className="relative mr-[0.25em] inline-block">
      <motion.span className={clsx("inline-block", className)} style={{ opacity: opacite, y }}>
        {children}
      </motion.span>
    </span>
  );
}
