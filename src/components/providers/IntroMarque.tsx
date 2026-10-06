"use client";

import Image from "next/image";
import { useEffect, useRef, type AnimationEvent } from "react";

const CLE = "jazzy-intro";
const NOM = "Jazzy World Business";

/**
 * Script exécuté avant la peinture (présent dans le HTML statique) :
 * si l'intro a déjà été vue dans cette session, on la masque immédiatement,
 * sinon on la marque comme vue. Aucun impact sur le contenu (toujours rendu dessous).
 */
const SCRIPT = `(function(){try{var e=document.getElementById("${CLE}");if(!e)return;if(sessionStorage.getItem("${CLE}")){e.hidden=true}else{sessionStorage.setItem("${CLE}","1")}}catch(_){}})();`;

/*
 * Animation 100 % CSS : elle démarre dès l'affichage du HTML, sans attendre
 * l'hydratation JS (téléphones lents). Seuls transform / opacity / filter sont animés.
 * Chronologie : globe 0–0,7 s · lettres 0,25–1 s · rideau 1,1–1,9 s.
 */
const CSS = `
#${CLE}{position:fixed;inset:0;z-index:100;pointer-events:auto;animation:ji-fin 0s linear 1.95s forwards}
#${CLE}[hidden]{display:none}
@media (prefers-reduced-motion: reduce){#${CLE}{display:none}}
@keyframes ji-fin{to{visibility:hidden;pointer-events:none}}
#${CLE} .ji-panneau{position:absolute;inset:0;will-change:transform}
#${CLE} .ji-panneau::after{content:"";position:absolute;left:-10%;right:-10%;top:calc(100% - 1px);height:14vh;border-radius:0 0 50% 50%;background:inherit}
#${CLE} .ji-arriere{animation:ji-rideau .7s cubic-bezier(.76,0,.24,1) 1.24s forwards}
#${CLE} .ji-avant{animation:ji-rideau .7s cubic-bezier(.76,0,.24,1) 1.1s forwards}
@keyframes ji-rideau{to{transform:translate3d(0,-120%,0)}}
#${CLE} .ji-contenu{animation:ji-sortie .35s cubic-bezier(.55,0,1,.45) 1s forwards}
@keyframes ji-sortie{to{opacity:0;transform:translate3d(0,-28px,0) scale(.97);filter:blur(4px)}}
#${CLE} .ji-globe{opacity:0;transform:scale(.35) rotate(-50deg);filter:blur(10px);animation:ji-globe .75s cubic-bezier(.22,1,.36,1) .05s forwards}
@keyframes ji-globe{to{opacity:1;transform:none;filter:blur(0)}}
#${CLE} .ji-halo{opacity:0;transform:scale(.6);animation:ji-halo 1.1s cubic-bezier(.22,1,.36,1) .15s forwards}
@keyframes ji-halo{60%{opacity:.7}to{opacity:.45;transform:scale(1.25)}}
#${CLE} .ji-lettre{display:inline-block;opacity:0;transform:translate3d(0,105%,0) rotate(6deg);animation:ji-lettre .55s cubic-bezier(.22,1,.36,1) forwards}
@keyframes ji-lettre{to{opacity:1;transform:none}}
#${CLE} .ji-sous{opacity:0;animation:ji-sous .5s ease-out .6s forwards}
@keyframes ji-sous{from{opacity:0;transform:translate3d(0,8px,0)}to{opacity:.75;transform:none}}
`;

/**
 * Intro de marque (première visite de la session) : le globe apparaît, le nom
 * s'écrit lettre par lettre, puis un rideau se lève sur la page.
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
        <div className="ji-panneau ji-arriere degrade-marque" />
        <div className="ji-panneau ji-avant bg-nuit-900">
          <div className="ji-contenu flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
            <div className="relative size-28 sm:size-36">
              <div className="ji-halo absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgba(79,195,232,0.55),rgba(29,111,224,0.35)_45%,transparent_70%)] blur-xl" />
              <Image
                src="/brand/globe.webp"
                alt=""
                width={600}
                height={600}
                loading="eager"
                className="ji-globe relative size-full object-contain drop-shadow-[0_10px_30px_rgba(79,195,232,0.35)]"
              />
            </div>
            <p className="font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              {NOM.split(" ").map((mot, m) => (
                <span key={m} className="inline-block overflow-hidden whitespace-nowrap px-[0.12em] pb-[0.08em] align-bottom">
                  {mot.split("").map((c, k) => {
                    const delai = 0.25 + i++ * 0.03;
                    return (
                      <span key={k} className="ji-lettre" style={{ animationDelay: `${delai.toFixed(2)}s` }}>
                        {c}
                      </span>
                    );
                  })}
                </span>
              ))}
            </p>
            <p className="ji-sous text-xs font-medium uppercase tracking-[0.35em] text-ciel-200 sm:text-sm">
              Kinshasa · Livraison partout
            </p>
          </div>
        </div>
      </div>
      <div hidden suppressHydrationWarning dangerouslySetInnerHTML={{ __html: `<script>${SCRIPT}</script>` }} />
    </>
  );
}
