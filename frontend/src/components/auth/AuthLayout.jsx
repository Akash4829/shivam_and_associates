import React from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '../../constants/site';

export default function AuthLayout({ title, subtitle, children, redirectNote }) {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 bg-off-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center ring-2 ring-accent/20">
              <span className="text-midnight font-bold text-sm">{SITE.logoInitials}</span>
            </div>
            <span className="font-display font-semibold text-slate-900">{SITE.shortName}</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-depth-sm">
          {redirectNote && (
            <p className="mb-5 rounded-xl bg-amber-50 border border-amber-200/80 px-4 py-3 text-sm text-amber-900">
              {redirectNote}
            </p>
          )}
          {title && !children && (
            <>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight text-center">{title}</h1>
              {subtitle && <p className="mt-2 text-slate-500 text-sm text-center">{subtitle}</p>}
            </>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export function AuthInput({ id, label, type = 'text', ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 outline-none transition-shadow"
        {...props}
      />
    </div>
  );
}

export function AuthError({ message }) {
  if (!message) return null;
  return (
    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{message}</div>
  );
}

export function AuthDivider({ label }) {
  return (
    <div className="relative my-2">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-white px-3 text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
    </div>
  );
}

export function PasswordStrength({ password }) {
  if (!password) return null;

  const checks = [
    { label: '8+ characters', met: password.length >= 8 },
    { label: 'Uppercase', met: /[A-Z]/.test(password) },
    { label: 'Lowercase', met: /[a-z]/.test(password) },
    { label: 'Number', met: /[0-9]/.test(password) },
    { label: 'Special char', met: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.met).length;
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-emerald-500'];

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i < score ? colors[score - 1] : 'bg-slate-200'}`}
          />
        ))}
      </div>
      <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
        {checks.map((c) => (
          <li key={c.label} className={c.met ? 'text-emerald-600' : 'text-slate-400'}>
            {c.met ? '✓' : '○'} {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
