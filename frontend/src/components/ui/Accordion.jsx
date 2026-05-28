import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { easePremium } from '../../animations/variants';
import { useThemeMode } from '../../context/ThemeContext';

export function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  const reduceMotion = useReducedMotion();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';

  return (
    <motion.div className="space-y-3" role="list">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <motion.div
            key={item.id || i}
            role="listitem"
            className={`rounded-2xl border overflow-hidden transition-colors duration-300 ${
              isLight
                ? 'border-navy/10 bg-white'
                : 'border-white/[0.08] bg-white/[0.03]'
            } ${isOpen ? 'border-accent/30' : ''}`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className={`w-full flex items-center justify-between gap-4 px-6 py-5 text-left font-medium transition-colors ${
                isLight ? 'text-ink' : 'text-off-white'
              }`}
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.25 }}
                className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg border border-accent/30 text-accent text-xl leading-none"
                aria-hidden
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: easePremium }}
                >
                  <p
                    className={`px-6 pb-5 text-sm leading-relaxed ${
                      isLight ? 'text-muted' : 'text-slate-400'
                    }`}
                  >
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default Accordion;