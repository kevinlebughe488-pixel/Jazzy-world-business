"use client";

import Image from "next/image";
import clsx from "clsx";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  type PanInfo,
  type Variants,
} from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useState, type KeyboardEvent, type PointerEvent } from "react";

const SEUIL_GLISSER = 60; // px
const SEUIL_VITESSE = 400; // px/s
const ZOOM = 1.9;

const glissement: Variants = {
  entree: (sens: number) => ({ x: sens > 0 ? "40%" : "-40%", opacity: 0, scale: 0.96, filter: "blur(8px)" }),
  centre: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
  sortie: (sens: number) => ({ x: sens > 0 ? "-40%" : "40%", opacity: 0, scale: 0.96, filter: "blur(8px)" }),
};

const fondu: Variants = {
  entree: { opacity: 0 },
  centre: { opacity: 1 },
  sortie: { opacity: 0 },
};

export function Galerie({ images, nom }: { images: string[]; nom: string }) {
  const reduire = useReducedMotion();
  const [[index, sens], setEtat] = useState<[number, number]>([0, 0]);
  const [zoom, setZoom] = useState(false);
  const origineX = useMotionValue(50);
  const origineY = useMotionValue(50);
  const origine = useMotionTemplate`${origineX}% ${origineY}%`;
  const total = images.length;
  const plusieurs = total > 1;

  function aller(cible: number) {
    if (!plusieurs) return;
    const suivant = (cible + total) % total;
    if (suivant === index) return;
    setZoom(false);
    // Sens du glissement : on prend le plus court chemin visuel.
    setEtat([suivant, cible > index ? 1 : -1]);
  }

  function finGlisser(_: unknown, info: PanInfo) {
    if (info.offset.x < -SEUIL_GLISSER || info.velocity.x < -SEUIL_VITESSE) aller(index + 1);
    else if (info.offset.x > SEUIL_GLISSER || info.velocity.x > SEUIL_VITESSE) aller(index - 1);
  }

  function suivreSouris(e: PointerEvent<HTMLDivElement>) {
    if (reduire || e.pointerType !== "mouse" || !window.matchMedia("(hover: hover)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    origineX.set(((e.clientX - r.left) / r.width) * 100);
    origineY.set(((e.clientY - r.top) / r.height) * 100);
    if (!zoom) setZoom(true);
  }

  function clavier(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      aller(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      aller(index - 1);
    }
  }

  if (total === 0) {
    return (
      <div className="degrade-marque grid aspect-square place-items-center rounded-[2rem] text-white/80">
        <span className="font-display text-lg">Photo bientôt disponible</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row-reverse lg:gap-5">
      {/* Image principale */}
      <div
        role="region"
        aria-roledescription="carrousel"
        aria-label={`Photos de ${nom}`}
        tabIndex={plusieurs ? 0 : undefined}
        onKeyDown={clavier}
        className="group relative aspect-square flex-1 overflow-hidden rounded-[2rem] bg-white shadow-[0_2px_4px_rgba(36,26,82,0.05),0_30px_60px_-30px_rgba(123,63,179,0.45)] ring-1 ring-nuit/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet"
      >
        <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-creme via-white to-ciel-200/50" />
        <div aria-hidden className="absolute -left-16 -top-16 size-64 rounded-full bg-violet-300/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-20 -right-10 size-72 rounded-full bg-ciel/25 blur-3xl" />

        <AnimatePresence initial={false} custom={sens} mode="popLayout">
          <motion.div
            key={index}
            custom={sens}
            variants={reduire ? fondu : glissement}
            initial="entree"
            animate="centre"
            exit="sortie"
            transition={
              reduire
                ? { duration: 0.2 }
                : { x: { type: "spring", stiffness: 300, damping: 32 }, default: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
            }
            drag={plusieurs && !zoom ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={finGlisser}
            onPointerMove={suivreSouris}
            onPointerLeave={() => setZoom(false)}
            className={clsx(
              "absolute inset-0 touch-pan-y",
              plusieurs && !zoom && "cursor-grab active:cursor-grabbing",
              zoom && "cursor-zoom-in",
            )}
          >
            <motion.div
              className="relative size-full"
              animate={{ scale: zoom ? ZOOM : 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              style={{ transformOrigin: origine }}
            >
              <Image
                src={images[index]}
                alt={`${nom} - photo ${index + 1} sur ${total}`}
                fill
                priority={index === 0}
                draggable={false}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="pointer-events-none select-none object-cover"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Indice zoom (desktop) */}
        <span
          aria-hidden
          className={clsx(
            "verre pointer-events-none absolute right-4 top-4 hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-nuit/80 ring-1 ring-white/60 transition-opacity duration-300 [@media(hover:hover)]:flex",
            zoom ? "opacity-0" : "opacity-100",
          )}
        >
          <ZoomIn className="size-3.5" aria-hidden /> Survolez pour zoomer
        </span>

        {plusieurs && (
          <>
            <FlecheNav sens="precedent" onClick={() => aller(index - 1)} />
            <FlecheNav sens="suivant" onClick={() => aller(index + 1)} />

            {/* Points de pagination */}
            <div className="verre absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-3 py-2 ring-1 ring-white/60">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => aller(i)}
                  aria-label={`Afficher la photo ${i + 1}`}
                  aria-current={i === index}
                  className="relative grid h-4 place-items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
                >
                  <span
                    className={clsx(
                      "block h-1.5 rounded-full transition-all duration-500 ease-[var(--ease-doux)]",
                      i === index ? "w-6 bg-violet" : "w-1.5 bg-nuit/25",
                    )}
                  />
                </button>
              ))}
            </div>
            <p className="sr-only" aria-live="polite">
              Photo {index + 1} sur {total}
            </p>
          </>
        )}
      </div>

      {/* Miniatures */}
      {plusieurs && (
        <div className="flex gap-3 overflow-x-auto pb-1 lg:w-20 lg:flex-col lg:overflow-visible lg:pb-0 xl:w-24">
          {images.map((src, i) => (
            <motion.button
              key={src}
              type="button"
              onClick={() => aller(i)}
              aria-label={`Afficher la photo ${i + 1}`}
              aria-current={i === index}
              initial={reduire ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduire ? undefined : { y: -3 }}
              whileTap={{ scale: 0.94 }}
              className={clsx(
                "relative aspect-square w-20 shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-nuit/10 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet lg:w-full",
                i === index ? "opacity-100" : "opacity-60 hover:opacity-100",
              )}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover" draggable={false} />
              {i === index && (
                <motion.span
                  layoutId="miniature-active"
                  className="absolute inset-0 rounded-2xl ring-[2.5px] ring-inset ring-violet"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

function FlecheNav({ sens, onClick }: { sens: "precedent" | "suivant"; onClick: () => void }) {
  const Icone = sens === "precedent" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={sens === "precedent" ? "Photo précédente" : "Photo suivante"}
      className={clsx(
        "verre absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-nuit shadow-lg shadow-nuit/10 ring-1 ring-white/70 transition-[opacity,transform] duration-300 hover:scale-110 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-violet",
        "lg:opacity-0 lg:group-hover:opacity-100",
        sens === "precedent" ? "left-3" : "right-3",
      )}
    >
      <Icone className="size-5" aria-hidden />
    </button>
  );
}
