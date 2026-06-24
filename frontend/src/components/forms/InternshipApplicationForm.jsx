import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import { internshipService } from '../../services/api';
import { events } from '../../services/analytics';
import { useThemeMode } from '../../context/ThemeContext';
import { easePremium } from '../../animations/variants';

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const ACCEPTED_RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export function InternshipApplicationForm() {
  const { t } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const inputCls = isLight ? 'input-premium-light' : 'input-premium';
  const [data, setData] = useState({
    applicant_name: '',
    email: '',
    phone_number: '',
    college_university: '',
    current_year_semester: '',
    areas_of_interest: '',
    cover_letter: '',
  });
  const [resume, setResume] = useState(null);
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = t('internship.form.errors.email');
    const digits = data.phone_number.replace(/\D/g, '');
    const normalized = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
    if (!/^[6-9]\d{9}$/.test(normalized)) e.phone_number = t('internship.form.errors.phone');
    if (!data.college_university.trim()) e.college_university = t('internship.form.errors.college');
    if (!data.current_year_semester.trim()) e.current_year_semester = t('internship.form.errors.yearSemester');
    if (!data.areas_of_interest.trim()) e.areas_of_interest = t('internship.form.errors.areasOfInterest');
    if (!resume) {
      e.resume = t('internship.form.errors.resume');
    } else if (!ACCEPTED_RESUME_TYPES.includes(resume.type)) {
      e.resume = t('internship.form.errors.resumeType');
    } else if (resume.size > MAX_RESUME_BYTES) {
      e.resume = t('internship.form.errors.resume');
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const resetForm = () => {
    setData({
      applicant_name: '',
      email: '',
      phone_number: '',
      college_university: '',
      current_year_semester: '',
      areas_of_interest: '',
      cover_letter: '',
    });
    setResume(null);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const digits = data.phone_number.replace(/\D/g, '');
      const normalizedPhone =
        digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;

      const formData = new FormData();
      Object.entries({ ...data, phone_number: normalizedPhone }).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      formData.append('resume', resume);
      const response = await internshipService.apply(formData);
      if (response.status === 201 || response.status === 200) {
        setSubmitted(true);
        resetForm();
        events.formSubmit('internship');
      }
    } catch (err) {
      const apiError =
        err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.error ||
        t('internship.form.errors.submit');
      setErrors({ submit: apiError });
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="applicant_name" className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-ink/70' : 'text-slate-300'}`}>
              {t('internship.form.name')} *
            </label>
            <input
              id="applicant_name"
              type="text"
              value={data.applicant_name}
              onChange={(e) => set('applicant_name', e.target.value)}
              className={`${inputCls} !pt-3.5 !pb-3.5 w-full`}
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
              className={`${inputCls} !pt-3.5 !pb-3.5 w-full`}
              autoComplete="email"
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="phone_number" className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-ink/70' : 'text-slate-300'}`}>
              {t('internship.form.phone')} *
            </label>
            <input
              id="phone_number"
              type="tel"
              value={data.phone_number}
              onChange={(e) => set('phone_number', e.target.value)}
              className={`${inputCls} !pt-3.5 !pb-3.5 w-full`}
              autoComplete="tel"
              aria-invalid={!!errors.phone_number}
            />
            {errors.phone_number && <p className="mt-1.5 text-sm text-red-400">{errors.phone_number}</p>}
          </div>
          <div>
            <label htmlFor="college_university" className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-ink/70' : 'text-slate-300'}`}>
              {t('internship.form.college')} *
            </label>
            <input
              id="college_university"
              type="text"
              value={data.college_university}
              onChange={(e) => set('college_university', e.target.value)}
              className={`${inputCls} !pt-3.5 !pb-3.5 w-full`}
              aria-invalid={!!errors.college_university}
            />
            {errors.college_university && <p className="mt-1.5 text-sm text-red-400">{errors.college_university}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="current_year_semester" className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-ink/70' : 'text-slate-300'}`}>
            {t('internship.form.yearSemester')} *
          </label>
          <input
            id="current_year_semester"
            type="text"
            value={data.current_year_semester}
            onChange={(e) => set('current_year_semester', e.target.value)}
            className={`${inputCls} !pt-3.5 !pb-3.5 w-full`}
            placeholder="e.g. 3rd Year / 5th Semester"
            aria-invalid={!!errors.current_year_semester}
          />
          {errors.current_year_semester && <p className="mt-1.5 text-sm text-red-400">{errors.current_year_semester}</p>}
        </div>

        <div>
          <label htmlFor="areas_of_interest" className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-ink/70' : 'text-slate-300'}`}>
            {t('internship.form.areasOfInterest')} *
          </label>
          <textarea
            id="areas_of_interest"
            value={data.areas_of_interest}
            onChange={(e) => set('areas_of_interest', e.target.value)}
            rows={3}
            className={`${inputCls} !pt-3.5 !pb-3.5 resize-none w-full`}
            placeholder={t('internship.form.areasHint')}
            aria-invalid={!!errors.areas_of_interest}
          />
          {errors.areas_of_interest && <p className="mt-1.5 text-sm text-red-400">{errors.areas_of_interest}</p>}
        </div>

        <div>
          <label htmlFor="resume" className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-ink/70' : 'text-slate-300'}`}>
            {t('internship.form.resume')} *
          </label>
          <input
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => {
              setResume(e.target.files?.[0] || null);
              if (errors.resume) setErrors((prev) => ({ ...prev, resume: '' }));
            }}
            className={`block w-full text-sm ${isLight ? 'text-muted' : 'text-slate-300'} file:mr-4 file:rounded-xl file:border-0 file:bg-accent file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-primary`}
            aria-invalid={!!errors.resume}
          />
          <p className={`mt-1.5 text-xs ${isLight ? 'text-muted' : 'text-slate-500'}`}>{t('internship.form.resumeHint')}</p>
          {errors.resume && <p className="mt-1.5 text-sm text-red-400">{errors.resume}</p>}
        </div>

        <div>
          <label htmlFor="cover_letter" className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-ink/70' : 'text-slate-300'}`}>
            {t('internship.form.coverLetter')}
          </label>
          <textarea
            id="cover_letter"
            value={data.cover_letter}
            onChange={(e) => set('cover_letter', e.target.value)}
            rows={4}
            className={`${inputCls} !pt-3.5 !pb-3.5 resize-none w-full`}
            placeholder={t('internship.form.coverLetterHint')}
          />
        </div>

        <Button type="submit" onClick={undefined} disabled={loading} className="w-full sm:w-auto">
          {loading ? t('internship.form.submitting') : t('internship.form.submit')}
        </Button>
      </form>
    </GlassCard>
  );
}

export default InternshipApplicationForm;
