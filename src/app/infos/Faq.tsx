"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import clsx from "clsx";

export type QuestionFaq = { question: string; reponse: ReactNode };

export function Faq({ questions }: { questions: QuestionFaq[] }) {
  const [ouverte, setOuverte] = useState<number | null>(0);
  const reduit = useReducedMotion();
  const base = useId();

  return (
    <ul className="divide-y divide-gris-200 overflow-hidden border-y border-noir bg-white">
      {questions.map((q, i) => {
        const estOuverte = ouverte === i;
        const idBouton = `${base}-q-${i}`;
        const idPanneau = `${base}-r-${i}`;
        return (
          <motion.li
            key={q.question}
            initial={reduit ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className={clsx("relative transition-colors duration-300", estOuverte && "bg-gris-50/60")}
          >
            <span
              aria-hidden="true"
              className={clsx(
                "bg-noir absolute inset-y-0 left-0 w-1 origin-top transition-transform duration-500 ease-[var(--ease-doux)]",
                estOuverte ? "scale-y-100" : "scale-y-0",
              )}
            />
            <h3 className="font-sans text-base">
              <button
                type="button"
                id={idBouton}
                aria-expanded={estOuverte}
                aria-controls={idPanneau}
                onClick={() => setOuverte(estOuverte ? null : i)}
                className="group flex min-h-16 w-full items-center gap-4 px-5 py-4 text-left font-semibold text-noir focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-noir sm:px-7 sm:py-5"
              >
                <span className="flex-1 text-sm font-bold uppercase leading-snug tracking-[0.06em] sm:text-base">{q.question}</span>
                <motion.span
                  animate={{ rotate: estOuverte ? 45 : 0 }}
                  transition={reduit ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 22 }}
                  className={clsx(
                    "grid size-9 shrink-0 place-items-center transition-colors duration-300",
                    estOuverte ? "bg-noir text-white" : "bg-noir/5 text-noir group-hover:bg-gris-100 group-hover:text-noir",
                  )}
                >
                  <Plus className="size-5" aria-hidden="true" />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {estOuverte && (
                <motion.div
                  key="contenu"
                  id={idPanneau}
                  role="region"
                  aria-labelledby={idBouton}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={
                    reduit
                      ? { duration: 0 }
                      : { height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.25 } }
                  }
                  className="overflow-hidden"
                >
                  <motion.div
                    initial={reduit ? false : { y: -8 }}
                    animate={{ y: 0 }}
                    exit={{ y: -8 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="px-5 pb-6 pr-16 text-[15px] leading-relaxed text-noir/75 sm:px-7 sm:pr-20 sm:text-base"
                  >
                    {q.reponse}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </ul>
  );
}
