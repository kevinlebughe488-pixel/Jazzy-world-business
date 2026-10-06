"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCheck, ChevronDown, Eye } from "lucide-react";
import { boutique } from "@/lib/catalogue";

/** Aperçu repliable du message, présenté comme une bulle WhatsApp. */
export function ApercuWhatsApp({ message }: { message: string }) {
  const [ouvert, setOuvert] = useState(false);
  const reduire = useReducedMotion();
  const id = useId();
  const heure = new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="ring-1 ring-gris-300">
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        aria-expanded={ouvert}
        aria-controls={id}
        className="flex min-h-12 w-full items-center gap-3 px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-[0.12em] text-noir transition-colors hover:bg-noir/[0.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-noir"
      >
        <Eye className="size-4 text-noir" aria-hidden="true" />
        <span className="flex-1">
          {ouvert
            ? "Masquer l'aperçu du message"
            : "Voir le message qui sera envoyé"}
        </span>
        <motion.span
          animate={{ rotate: ouvert ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="size-4 text-noir/50" aria-hidden="true" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {ouvert && (
          <motion.div
            id={id}
            key="apercu"
            initial={
              reduire ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="origin-top px-2 pb-2"
          >
            <div className="overflow-hidden rounded-xl bg-[#efeae2]">
              <div className="flex items-center gap-2.5 bg-[#075e54] px-3 py-2 text-white">
                <span className="grid size-8 place-items-center overflow-hidden rounded-full bg-white">
                  <Image
                    src="/brand/globe.webp"
                    alt=""
                    width={32}
                    height={32}
                    className="size-7 object-contain"
                  />
                </span>
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-sm font-semibold">
                    {boutique.nom}
                  </p>
                  <p className="text-[0.7rem] text-white/75">
                    {boutique.whatsappAffiche}
                  </p>
                </div>
              </div>
              <div
                className="max-h-80 overflow-y-auto overscroll-contain p-3"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(0,0,0,0.045) 1px, transparent 1px)",
                  backgroundSize: "14px 14px",
                }}
              >
                <motion.div
                  initial={reduire ? false : { opacity: 0, x: 16, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{
                    delay: 0.12,
                    type: "spring",
                    stiffness: 260,
                    damping: 22,
                  }}
                  className="relative ml-auto max-w-[92%] rounded-lg rounded-tr-none bg-[#d9fdd3] px-3 pt-2 pb-1.5 text-[0.85rem] leading-relaxed text-[#111b21] shadow-sm"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-0 -right-2 size-0 border-t-[10px] border-r-[10px] border-t-[#d9fdd3] border-r-transparent"
                  />
                  <p className="break-words whitespace-pre-wrap">{message}</p>
                  <p className="mt-1 flex items-center justify-end gap-1 text-[0.65rem] text-[#667781]">
                    {heure}
                    <CheckCheck
                      className="size-3.5 text-[#53bdeb]"
                      aria-hidden="true"
                    />
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
