export const easePremium = [0.16, 1, 0.3, 1];

export const springPremium = { type: 'spring', stiffness: 260, damping: 28 };

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easePremium } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: easePremium } },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: easePremium } },
};

export const slideFromRight = {
  closed: { x: '100%', transition: { duration: 0.4, ease: easePremium } },
  open: { x: 0, transition: { duration: 0.45, ease: easePremium } },
};

export const bottomSheet = {
  closed: { y: '100%', transition: { duration: 0.38, ease: easePremium } },
  open: { y: 0, transition: { duration: 0.42, ease: easePremium } },
};

export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easePremium } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.3, ease: easePremium } },
};

export const hoverLift = {
  rest: { y: 0, scale: 1 },
  hover: { y: -4, scale: 1.02, transition: { duration: 0.3, ease: easePremium } },
};
