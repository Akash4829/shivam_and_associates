import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useThemeMode } from '../../context/ThemeContext';
import { easePremium } from '../../animations/variants';

export function Modal({ open, onClose, title, children, labelledBy = 'modal-title', size = 'md' }) {
  const reduceMotion = useReducedMotion();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  const sizeCls = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }[size];

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
        >
          <motion.div
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 60, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.35, ease: easePremium }}
            className={`relative z-10 w-full ${sizeCls} rounded-t-3xl sm:rounded-3xl border ${
              isLight
                ? 'bg-white border-navy/10 shadow-depth-md'
                : 'bg-secondary border-white/10 shadow-depth-dark'
            } overflow-hidden`}
          >
            <div className="flex items-center justify-between px-6 pt-5 pb-2">
              {title && (
                <h2
                  id={labelledBy}
                  className={`font-heading text-lg ${isLight ? 'text-ink' : 'text-off-white'}`}
                >
                  {title}
                </h2>
              )}
              <button
                type="button"
                onClick={onClose}
                className={`ml-auto inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                  isLight
                    ? 'border-navy/15 text-ink hover:bg-navy/5'
                    : 'border-white/10 text-off-white hover:bg-white/5'
                }`}
                aria-label="Close"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>
            <div className="px-6 pb-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default Modal;
