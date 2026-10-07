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
    <ul className="divide-y divide-trait-fort border-y border-trait-fort">
      {questions.map((q, i) => {
        const estOuverte = ouverte === i;
        const idBouton = `${base}-q-${i}`;
        const idPanneau = `${base}-r-${i}`;
        return (
          <motion.li
            key={q.question}
            initial={reduit ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="font-sans text-base">
              <button
                type="button"
                id={idBouton}
                aria-expanded={estOuverte}
                aria-controls={idPanneau}
                onClick={() => setOuverte(estOuverte ? null : i)}
                className="group flex min-h-16 w-full items-center gap-4 rounded-md py-5 text-left text-encre focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-encre"
              >
                <span className="flex-1 font-serif text-2xl leading-snug sm:text-[1.65rem]">{q.question}</span>
                <motion.span
                  animate={{ rotate: estOuverte ? 45 : 0 }}
                  transition={reduit ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 22 }}
                  className={clsx(
                    "grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-300",
                    estOuverte ? "bg-ocre text-encre" : "bg-lin text-encre group-hover:bg-trait",
                  )}
                >
                  <Plus className="size-4" aria-hidden="true" />
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
                      : { height: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.25 } }
                  }
                  className="overflow-hidden"
                >
                  <motion.div
                    initial={reduit ? false : { y: -8 }}
                    animate={{ y: 0 }}
                    exit={{ y: -8 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-[65ch] pb-6 pr-12 leading-relaxed text-encre-doux"
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
