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
  entree: (sens: number) => ({ x: sens > 0 ? "40%" : "-40%", opacity: 0 }),
  centre: { x: 0, opacity: 1 },
  sortie: (sens: number) => ({ x: sens > 0 ? "-40%" : "40%", opacity: 0 }),
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
      <div className="grid aspect-square place-items-center rounded-carte bg-lin text-encre-doux">
        <span className="font-serif text-2xl">Photo bientôt disponible</span>
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
        className="group relative aspect-square flex-1 overflow-hidden rounded-carte bg-lin focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-encre"
      >

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
                : { x: { type: "spring", stiffness: 300, damping: 36 }, default: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
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
            "pointer-events-none absolute right-4 top-4 hidden items-center gap-1.5 rounded-full bg-carte/85 px-3 py-1.5 text-xs text-encre-doux backdrop-blur-md transition-opacity duration-300 [@media(hover:hover)]:flex",
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
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-carte/85 px-3 py-2 backdrop-blur-md">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => aller(i)}
                  aria-label={`Afficher la photo ${i + 1}`}
                  aria-current={i === index}
                  className="relative grid h-4 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-encre"
                >
                  <span
                    className={clsx(
                      "block h-1.5 rounded-full transition-all duration-500 ease-[var(--ease-doux)]",
                      i === index ? "w-6 bg-encre" : "w-1.5 bg-encre/25",
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
            <button
              key={src}
              type="button"
              onClick={() => aller(i)}
              aria-label={`Afficher la photo ${i + 1}`}
              aria-current={i === index}
              className={clsx(
                "relative aspect-square w-20 shrink-0 overflow-hidden rounded-media bg-lin transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-encre lg:w-full",
                i === index ? "opacity-100" : "opacity-55 hover:opacity-100",
              )}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover" draggable={false} />
              {i === index && (
                <motion.span
                  layoutId="miniature-active"
                  className="absolute inset-0 rounded-media ring-2 ring-inset ring-encre"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
            </button>
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
        "absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-carte/85 text-encre shadow-doux backdrop-blur-md transition-[opacity,transform] duration-300 hover:scale-105 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-encre",
        "lg:opacity-0 lg:group-hover:opacity-100",
        sens === "precedent" ? "left-3" : "right-3",
      )}
    >
      <Icone className="size-5" aria-hidden />
    </button>
  );
}
