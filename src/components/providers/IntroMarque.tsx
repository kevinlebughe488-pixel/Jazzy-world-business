"use client";

import Image from "next/image";
import { useEffect, useRef, type AnimationEvent } from "react";

const CLE = "jazzy-intro";
const NOM = "Jazzy World";

/**
 * Script exécuté avant la peinture (présent dans le HTML statique) :
 * si l'intro a déjà été vue dans cette session, on la masque immédiatement,
 * sinon on la marque comme vue et on signale à la page (html[data-intro])
 * de retarder ses animations d'entrée. Aucun impact sur le contenu (toujours rendu dessous).
 */
const SCRIPT = `(function(){try{var e=document.getElementById("${CLE}");if(!e)return;if(sessionStorage.getItem("${CLE}")||matchMedia("(prefers-reduced-motion: reduce)").matches){e.hidden=true}else{sessionStorage.setItem("${CLE}","1");document.documentElement.setAttribute("data-intro","")}}catch(_){}})();`;

/*
 * Animation 100 % CSS : elle démarre dès l'affichage du HTML, sans attendre
 * l'hydratation JS (téléphones lents). Seuls transform / opacity sont animés.
 * Chronologie : globe 0–0,8 s · lettres 0,1–0,9 s · trait 0,5–1 s · rideaux 1,1–1,9 s.
 */
const CSS = `
#${CLE}{position:fixed;inset:0;z-index:100;pointer-events:auto;animation:ji-fin 0s linear 1.95s forwards}
#${CLE}[hidden]{display:none}
@media (prefers-reduced-motion: reduce){#${CLE}{display:none}}
@keyframes ji-fin{to{visibility:hidden;pointer-events:none}}
#${CLE} .ji-panneau{position:absolute;inset:0;will-change:transform}
#${CLE} .ji-arriere{animation:ji-rideau .75s cubic-bezier(.76,0,.24,1) 1.22s forwards}
#${CLE} .ji-avant{animation:ji-rideau .75s cubic-bezier(.76,0,.24,1) 1.08s forwards}
@keyframes ji-rideau{to{transform:translate3d(0,-101%,0)}}
#${CLE} .ji-contenu{animation:ji-sortie .4s cubic-bezier(.55,0,1,.45) .98s forwards}
@keyframes ji-sortie{to{opacity:0;transform:translate3d(0,-40px,0) scale(1.06)}}
#${CLE} .ji-globe{opacity:0;transform:scale(.35) rotate(-50deg);animation:ji-globe .75s cubic-bezier(.22,1,.36,1) .05s forwards}
@keyframes ji-globe{to{opacity:1;transform:none}}
#${CLE} .ji-lettre{display:inline-block;transform:translate3d(0,110%,0);animation:ji-lettre .6s cubic-bezier(.22,1,.36,1) forwards}
@keyframes ji-lettre{to{transform:none}}
#${CLE} .ji-trait{transform:scaleX(0);transform-origin:left;animation:ji-trait .55s cubic-bezier(.65,0,.35,1) .5s forwards}
@keyframes ji-trait{to{transform:none}}
#${CLE} .ji-sous{opacity:0;animation:ji-sous .5s ease-out .6s forwards}
@keyframes ji-sous{from{opacity:0;transform:translate3d(0,8px,0)}to{opacity:.7;transform:none}}
`;

/**
 * Intro de marque (première visite de la session) : le globe du logo apparaît,
 * le nom s'écrit lettre par lettre sur fond noir, puis deux rideaux se lèvent sur la page.
 * Le contenu est toujours rendu dessous (SEO) ; l'intro est purement décorative.
 */
export function IntroMarque() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.hidden) return;
    // Filet de sécurité : retire l'overlay même si animationend n'arrive pas.
    const t = window.setTimeout(() => {
      el.hidden = true;
    }, 2200);
    return () => window.clearTimeout(t);
  }, []);

  const terminer = (e: AnimationEvent<HTMLDivElement>) => {
    if (e.animationName === "ji-fin" && ref.current) ref.current.hidden = true;
  };

  let i = 0;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div id={CLE} ref={ref} aria-hidden="true" onAnimationEnd={terminer} suppressHydrationWarning>
        <div className="ji-panneau ji-arriere bg-gris-300" />
        <div className="ji-panneau ji-avant bg-noir">
          <div className="ji-contenu flex h-full flex-col items-center justify-center px-6 text-center">
            <Image
              src="/brand/globe.webp"
              alt=""
              width={600}
              height={600}
              loading="eager"
              className="ji-globe mb-6 size-24 object-contain sm:size-32"
            />
            <p className="font-affiche text-[17vw] uppercase leading-[0.9] tracking-[0.02em] text-white sm:text-[11vw]">
              {NOM.split(" ").map((mot, m) => (
                <span key={m} className="block overflow-hidden">
                  {mot.split("").map((c, k) => {
                    const delai = 0.1 + i++ * 0.045;
                    return (
                      <span key={k} className="ji-lettre" style={{ animationDelay: `${delai.toFixed(2)}s` }}>
                        {c}
                      </span>
                    );
                  })}
                </span>
              ))}
            </p>
            <span className="ji-trait mt-5 block h-px w-40 bg-white sm:w-64" />
            <p className="ji-sous mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.45em] text-white sm:text-xs">
              Kinshasa · Livraison partout
            </p>
          </div>
        </div>
      </div>
      <div hidden suppressHydrationWarning dangerouslySetInnerHTML={{ __html: `<script>${SCRIPT}</script>` }} />
    </>
  );
}
