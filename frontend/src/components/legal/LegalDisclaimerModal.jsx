import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeMode } from '../../context/ThemeContext';

const STORAGE_KEY = 'legal_disclaimer_accepted';

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => !el.hasAttribute('disabled'));
}

export default function LegalDisclaimerModal() {
  const { t } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef(null);
  const agreeRef = useRef(null);

  useEffect(() => {
    const accepted = sessionStorage.getItem(STORAGE_KEY);
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!visible) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    agreeRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = getFocusableElements(dialogRef.current);
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [visible]);

  const handleAgree = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  }, []);

  const handleExit = useCallback(() => {
    window.location.href = 'https://www.google.com';
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-disclaimer-title"
        aria-describedby="legal-disclaimer-body"
        className={`w-full max-w-lg rounded-2xl border p-6 sm:p-8 shadow-2xl ${
          isLight ? 'bg-off-white border-navy/15 text-ink' : 'bg-secondary border-white/10 text-off-white'
        }`}
      >
        <h2 id="legal-disclaimer-title" className="font-display text-xl font-semibold mb-4">
          {t('legal.disclaimerTitle')}
        </h2>
        <div id="legal-disclaimer-body" className={`space-y-3 text-sm leading-relaxed ${isLight ? 'text-muted' : 'text-slate-300'}`}>
          <p>{t('legal.disclaimerIntro')}</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>{t('legal.disclaimerPoint1')}</li>
            <li>{t('legal.disclaimerPoint2')}</li>
            <li>{t('legal.disclaimerPoint3')}</li>
            <li>{t('legal.disclaimerPoint4')}</li>
          </ul>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            ref={agreeRef}
            type="button"
            onClick={handleAgree}
            className="flex-1 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-primary hover:opacity-90 transition-opacity"
          >
            {t('legal.agree')}
          </button>
          <button
            type="button"
            onClick={handleExit}
            className={`flex-1 rounded-xl border px-5 py-3 text-sm font-medium transition-colors ${
              isLight ? 'border-navy/20 hover:bg-navy/5' : 'border-white/15 hover:bg-white/5'
            }`}
          >
            {t('legal.exit')}
          </button>
        </div>
      </div>
    </div>
  );
}
