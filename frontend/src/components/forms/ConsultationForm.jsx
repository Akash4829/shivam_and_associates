import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { appointmentsService } from '../../services/api';
import { events } from '../../services/analytics';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import { easePremium } from '../../animations/variants';
import { useThemeMode } from '../../context/ThemeContext';

function FloatingInput({ id, label, error, children }) {
  const [focused, setFocused] = useState(false);
  const hasValue = children.props.value?.length > 0;

  return (
    <motion.div className="relative">
      <label
        htmlFor={id}
        className={`floating-label ${focused || hasValue ? 'floating-label-active' : ''}`}
      >
        {label}
      </label>
      {React.cloneElement(children, {
        id,
        onFocus: (e) => {
          setFocused(true);
          children.props.onFocus?.(e);
        },
        onBlur: (e) => {
          setFocused(false);
          children.props.onBlur?.(e);
        },
      })}
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-sm text-red-400">
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}

export function ConsultationForm() {
  const { t } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const inputCls = isLight ? 'input-premium-light' : 'input-premium';

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    client_name: '',
    phone_number: '',
    email: '',
    case_summary: '',
    preferred_date: '',
  });

  const set = (name, value) => {
    setData((d) => ({ ...d, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  };

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!data.client_name.trim()) e.client_name = t('form.errors.name');
      if (!/^\d{10}$/.test(data.phone_number.replace(/\D/g, ''))) e.phone_number = t('form.errors.phone');
      if (!/\S+@\S+\.\S+/.test(data.email)) e.email = t('form.errors.email');
    }
    if (step === 2 && !data.case_summary.trim()) e.case_summary = t('form.errors.summary');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    try {
      await appointmentsService.create(data);
      setSubmitted(true);
      events.formSubmit('consultation');
    } catch {
      setErrors({ submit: t('form.errors.submit') });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <GlassCard className="p-10 text-center">
        <motion.div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-success text-2xl">✓</motion.div>
        <h2 className={`text-xl font-semibold ${isLight ? 'text-ink' : 'text-off-white'}`}>{t('form.successTitle')}</h2>
        <p className={`mt-3 text-sm ${isLight ? 'text-muted' : 'text-slate-400'}`}>{t('form.successDesc')}</p>
        <Button className="mt-8" onClick={() => { setSubmitted(false); setStep(1); setData({ client_name: '', phone_number: '', email: '', case_summary: '', preferred_date: '' }); }}>
          {t('form.submitAnother')}
        </Button>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 sm:p-8">
      <motion.div className="flex gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <motion.div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-accent' : 'bg-white/10'}`} />
        ))}
      </motion.div>
      <p className="text-xs text-accent font-semibold uppercase tracking-wider mb-6">
        {t(`form.step${step}`)}
      </p>

      <AnimatePresence mode="wait">
        <motion.form
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.3, ease: easePremium }}
          onSubmit={(e) => e.preventDefault()}
          className="space-y-5"
        >
          {errors.submit && <p className="text-sm text-red-400 p-3 rounded-xl bg-red-400/10">{errors.submit}</p>}

          {step === 1 && (
            <>
              <FloatingInput id="client_name" label={`${t('form.name')} *`} error={errors.client_name}>
                <input className={inputCls} value={data.client_name} onChange={(e) => set('client_name', e.target.value)} autoComplete="name" />
              </FloatingInput>
              <FloatingInput id="phone_number" label={`${t('form.phone')} *`} error={errors.phone_number}>
                <input className={inputCls} value={data.phone_number} onChange={(e) => set('phone_number', e.target.value)} autoComplete="tel" />
              </FloatingInput>
              <FloatingInput id="email" label={`${t('form.email')} *`} error={errors.email}>
                <input type="email" className={inputCls} value={data.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" />
              </FloatingInput>
            </>
          )}

          {step === 2 && (
            <FloatingInput id="case_summary" label={`${t('form.caseSummary')} *`} error={errors.case_summary}>
              <textarea className={`${inputCls} min-h-[140px] resize-none`} rows={5} value={data.case_summary} onChange={(e) => set('case_summary', e.target.value)} />
            </FloatingInput>
          )}

          {step === 3 && (
            <FloatingInput id="preferred_date" label={t('form.preferredDate')}>
              <input type="date" className={inputCls} value={data.preferred_date} min={new Date().toISOString().split('T')[0]} onChange={(e) => set('preferred_date', e.target.value)} />
            </FloatingInput>
          )}

          <motion.div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button type="button" variant="secondary" onClick={() => setStep((s) => s - 1)} className="flex-1">
                {t('form.back')}
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" onClick={() => validateStep() && setStep((s) => s + 1)} className="flex-1">
                {t('form.next')}
              </Button>
            ) : (
              <Button type="button" onClick={submit} disabled={loading} className="flex-1">
                {loading ? t('common.loading') : t('form.submit')}
              </Button>
            )}
          </motion.div>
        </motion.form>
      </AnimatePresence>
    </GlassCard>
  );
}

export default ConsultationForm;