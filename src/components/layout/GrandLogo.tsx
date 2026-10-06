"use client";

import { useRef } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { useProgression } from "@/components/animations/useProgression";

const MOTS = ["JAZZY", "WORLD"];

/** Logo géant en bas du pied de page : chaque lettre monte à son tour pendant qu'on arrive en bas. */
export function GrandLogo({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // Animations réduites : lettres directement en place (progression figée à 1).
  const progression = useProgression(ref, ["start end", "end end"], false, 1);
  const lettres = MOTS.join(" ").split("");
  const total = lettres.length;

  return (
    <div ref={ref} aria-hidden="true" className={className}>
      <p className="flex select-none justify-between overflow-hidden font-affiche text-[18.5vw] uppercase leading-none text-white lg:text-[17.5vw]">
        {lettres.map((c, i) =>
          c === " " ? (
            <span key={i} className="w-[3vw]" />
          ) : (
            <Lettre key={i} progression={progression} index={i} total={total}>
              {c}
            </Lettre>
          ),
        )}
      </p>
    </div>
  );
}

function Lettre({
  children,
  progression,
  index,
  total,
}: {
  children: string;
  progression: MotionValue<number>;
  index: number;
  total: number;
}) {
  const debut = (index / total) * 0.5;
  const y = useTransform(progression, [debut, debut + 0.5], ["100%", "0%"]);
  const rotation = useTransform(progression, [debut, debut + 0.5], [index % 2 ? 12 : -12, 0]);
  return (
    <span className="inline-block overflow-hidden">
      <motion.span className="inline-block origin-bottom" style={{ y, rotate: rotation }}>
        {children}
      </motion.span>
    </span>
  );
}
