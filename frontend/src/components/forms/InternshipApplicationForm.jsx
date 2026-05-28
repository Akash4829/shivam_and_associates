import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import { internshipService } from '../../services/api';
import { events } from '../../services/analytics';
import { useThemeMode } from '../../context/ThemeContext';
import { easePremium } from '../../animations/variants';

export function InternshipApplicationForm() {
  const { t } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const inputCls = isLight ? 'input-premium-light' : 'input-premium';
  const [data, setData] = useState({
    applicant_name: '',
    email: '',
    phone_number: '',
    statement: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (name, value) => {
    setData((d) => ({ ...d, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!data.applicant_name.trim()) e.applicant_name = t('internship.form.errors.name');
    if (!/\S+@\S+\.\S+/.test(data.email)) e.email = t('internship.form.errors.email');
    if (!/^\d{10}$/.test(data.phone_number.replace(/\D/g, ''))) e.phone_number = t('internship.form.errors.phone');
    if (!data.statement.trim()) e.statement = t('internship.form.errors.statement');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await internshipService.apply(data);
      if (response.status === 201 || response.status === 200) {
        setSubmitted(true);
        setData({ applicant_name: '', email: '', phone_number: '', statement: '' });
        events.formSubmit('internship');
      }
    } catch {
      setErrors({ submit: t('internship.form.errors.submit') });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <GlassCard className="p-10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-success text-2xl">
          ✓
        </div>
        <h3 className={`font-heading text-xl ${isLight ? 'text-ink' : 'text-off-white'}`}>
          {t('internship.form.successTitle')}
        </h3>
        <p className={`mt-3 text-sm ${isLight ? 'text-muted' : 'text-slate-400'}`}>
          {t('internship.form.successDesc')}
        </p>
        <Button className="mt-8" onClick={() => setSubmitted(false)}>
          {t('internship.form.submitAnother')}
        </Button>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 sm:p-8">
      <h3 className={`font-heading text-lg mb-1 ${isLight ? 'text-ink' : 'text-off-white'}`}>
        {t('internship.form.title')}
      </h3>
      <p className={`text-sm mb-6 ${isLight ? 'text-muted' : 'text-slate-400'}`}>
        {t('internship.form.subtitle')}
      </p>

      <AnimatePresence>
        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: easePremium }}
            className="mb-4 p-4 rounded-xl border border-red-400/40 bg-red-400/10 text-sm text-red-200"
            role="alert"
          >
            {errors.submit}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="applicant_name" className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-ink/70' : 'text-slate-300'}`}>
            {t('internship.form.name')} *
          </label>
          <input
            id="applicant_name"
            type="text"
            value={data.applicant_name}
            onChange={(e) => set('applicant_name', e.target.value)}
            className={`${inputCls} !pt-3.5 !pb-3.5`}
            autoComplete="name"
            aria-invalid={!!errors.applicant_name}
          />
          {errors.applicant_name && <p className="mt-1.5 text-sm text-red-400">{errors.applicant_name}</p>}
        </div>
        <div>
          <label htmlFor="email" className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-ink/70' : 'text-slate-300'}`}>
            {t('internship.form.email')} *
          </label>
          <input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => set('email', e.target.value)}
            className={`${inputCls} !pt-3.5 !pb-3.5`}
            autoComplete="email"
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="phone_number" className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-ink/70' : 'text-slate-300'}`}>
            {t('internship.form.phone')} *
          </label>
          <input
            id="phone_number"
            type="tel"
            value={data.phone_number}
            onChange={(e) => set('phone_number', e.target.value)}
            className={`${inputCls} !pt-3.5 !pb-3.5`}
            autoComplete="tel"
            aria-invalid={!!errors.phone_number}
          />
          {errors.phone_number && <p className="mt-1.5 text-sm text-red-400">{errors.phone_number}</p>}
        </div>
        <div>
          <label htmlFor="statement" className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-ink/70' : 'text-slate-300'}`}>
            {t('internship.form.statement')} *
          </label>
          <textarea
            id="statement"
            value={data.statement}
            onChange={(e) => set('statement', e.target.value)}
            rows={5}
            className={`${inputCls} !pt-3.5 !pb-3.5 resize-none`}
            placeholder={t('internship.form.statementHint')}
            aria-invalid={!!errors.statement}
          />
          {errors.statement && <p className="mt-1.5 text-sm text-red-400">{errors.statement}</p>}
        </div>
        <Button type="submit" onClick={undefined} disabled={loading} className="w-full sm:w-auto">
          {loading ? t('internship.form.submitting') : t('internship.form.submit')}
        </Button>
      </form>
    </GlassCard>
  );
}

export default InternshipApplicationForm;
