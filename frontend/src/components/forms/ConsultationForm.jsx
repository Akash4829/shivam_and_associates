import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { appointmentsService } from '../../services/api';
import { events } from '../../services/analytics';
import Button from '../ui/Button';
import { useThemeMode } from '../../context/ThemeContext';
import { practiceAreas } from '../../data/practiceAreas';

export function ConsultationForm() {
  const { t } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const inputCls = isLight ? 'input-premium-light' : 'input-premium';
  const labelCls = `mb-1.5 block text-sm font-medium ${isLight ? 'text-ink' : 'text-off-white'}`;

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    client_name: '',
    phone_number: '',
    email: '',
    practice_area: '',
    case_summary: '',
    preferred_date: '',
    preferred_time: '',
    website: '',
  });

  const set = (name, value) => {
    setData((d) => ({ ...d, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!data.client_name.trim()) e.client_name = t('form.errors.name');
    const digits = data.phone_number.replace(/\D/g, '');
    const normalized = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
    if (!/^[6-9]\d{9}$/.test(normalized)) e.phone_number = t('form.errors.phone');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = t('form.errors.email');
    if (data.case_summary.length > 2000) e.case_summary = t('form.errors.summary');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const digits = data.phone_number.replace(/\D/g, '');
      const normalizedPhone =
        digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
      await appointmentsService.create({
        client_name: data.client_name.trim(),
        phone_number: normalizedPhone,
        email: data.email.trim(),
        practice_area: data.practice_area || undefined,
        case_summary: data.case_summary.trim() || undefined,
        preferred_date: data.preferred_date || undefined,
        preferred_time: data.preferred_time || undefined,
        website: data.website,
      });
      setSubmitted(true);
      events.formSubmit('consultation');
    } catch (err) {
      const apiError =
        err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.error ||
        t('form.errors.submit');
      setErrors({ submit: apiError === 'Access token required' ? t('form.errors.submit') : apiError });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={`rounded-xl border p-8 text-center ${isLight ? 'border-border bg-white' : 'border-white/10 bg-secondary'}`}>
        <p className="text-accent text-sm font-semibold uppercase tracking-wider">{t('form.successTitle')}</p>
        <p className={`mt-3 text-base ${isLight ? 'text-ink' : 'text-off-white'}`}>{t('form.successDesc')}</p>
        <Button
          className="mt-6"
          onClick={() => {
            setSubmitted(false);
            setData({
              client_name: '',
              phone_number: '',
              email: '',
              practice_area: '',
              case_summary: '',
              preferred_date: '',
              preferred_time: '',
              website: '',
            });
          }}
        >
          {t('form.submitAnother')}
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className={`space-y-4 rounded-xl border p-6 sm:p-8 ${isLight ? 'border-border bg-white' : 'border-white/10 bg-secondary'}`}
      noValidate
    >
      <div>
        <h2 className={`font-heading text-xl ${isLight ? 'text-ink' : 'text-off-white'}`}>{t('form.title')}</h2>
        <p className={`mt-1 text-sm ${isLight ? 'text-muted' : 'text-slate-400'}`}>{t('form.confidential')}</p>
      </div>

      {errors.submit && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {errors.submit}
        </p>
      )}

      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={data.website}
          onChange={(e) => set('website', e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="client_name" className={labelCls}>
          {t('form.name')} *
        </label>
        <input
          id="client_name"
          className={inputCls}
          value={data.client_name}
          onChange={(e) => set('client_name', e.target.value)}
          autoComplete="name"
          required
        />
        {errors.client_name && <p className="mt-1 text-sm text-red-600">{errors.client_name}</p>}
      </div>

      <div>
        <label htmlFor="phone_number" className={labelCls}>
          {t('form.phone')} *
        </label>
        <input
          id="phone_number"
          className={inputCls}
          value={data.phone_number}
          onChange={(e) => set('phone_number', e.target.value)}
          autoComplete="tel"
          inputMode="tel"
          required
        />
        {errors.phone_number && <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>}
      </div>

      <div>
        <label htmlFor="email" className={labelCls}>
          {t('form.email')} *
        </label>
        <input
          id="email"
          type="email"
          className={inputCls}
          value={data.email}
          onChange={(e) => set('email', e.target.value)}
          autoComplete="email"
          required
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="practice_area" className={labelCls}>
          {t('form.caseType')}
        </label>
        <select
          id="practice_area"
          className={inputCls}
          value={data.practice_area}
          onChange={(e) => set('practice_area', e.target.value)}
        >
          <option value="">{t('form.caseTypePlaceholder')}</option>
          {practiceAreas.map((area) => (
            <option key={area.id} value={t(area.titleKey)}>
              {t(area.titleKey)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="case_summary" className={labelCls}>
          {t('form.caseSummary')}
        </label>
        <textarea
          id="case_summary"
          className={`${inputCls} min-h-[120px] resize-y`}
          rows={5}
          maxLength={2000}
          value={data.case_summary}
          onChange={(e) => set('case_summary', e.target.value)}
        />
        {errors.case_summary && <p className="mt-1 text-sm text-red-600">{errors.case_summary}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="preferred_date" className={labelCls}>
            {t('form.preferredDate')}
          </label>
          <input
            id="preferred_date"
            type="date"
            className={inputCls}
            value={data.preferred_date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => set('preferred_date', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="preferred_time" className={labelCls}>
            {t('form.preferredTime')}
          </label>
          <input
            id="preferred_time"
            type="time"
            className={inputCls}
            value={data.preferred_time}
            onChange={(e) => set('preferred_time', e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? t('common.loading') : t('form.submit')}
      </Button>
    </form>
  );
}

export default ConsultationForm;
