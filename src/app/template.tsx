"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

// Le tout premier rendu (HTML statique + hydratation) n'est pas animé :
// le contenu reste visible immédiatement (SEO, LCP). Seules les navigations suivantes le sont.
let premierRendu = true;

/** Transition entre les pages : simple fondu. */
export default function Template({ children }: { children: ReactNode }) {
  const [animer] = useState(() => !premierRendu);

  useEffect(() => {
    premierRendu = false;
  }, []);

  return (
    <motion.div
      initial={animer ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
