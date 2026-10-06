"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

// Le tout premier rendu (HTML statique + hydratation) n'est pas animé :
// le contenu reste visible immédiatement (SEO, LCP). Seules les navigations suivantes le sont.
let premierRendu = true;

/** Transition entre les pages : fondu + léger glissement + flou qui se dissipe. */
export default function Template({ children }: { children: ReactNode }) {
  const [animer] = useState(() => !premierRendu);

  useEffect(() => {
    premierRendu = false;
  }, []);

  return (
    <motion.div
      initial={animer ? { opacity: 0, y: 14, filter: "blur(8px)" } : false}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
