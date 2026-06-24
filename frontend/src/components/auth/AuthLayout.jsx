import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { easeSoft } from '../../lib/motion';
import { SITE } from '../../constants/site';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 bg-gradient-to-br from-midnight via-slate-900 to-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[28rem] h-[28rem] bg-blue-600/10 rounded-full blur-3xl" aria-hidden />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" aria-hidden />
      <div className="absolute inset-0 bg-noise opacity-[0.07] mix-blend-overlay pointer-events-none" aria-hidden />

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: easeSoft }}
      >
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 sm:p-10 shadow-depth-dark">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center ring-2 ring-white/10">
                <span className="text-midnight font-bold text-sm">SM</span>
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
            {subtitle && <p className="mt-2 text-slate-400 text-sm">{subtitle}</p>}
            <p className="mt-1 text-slate-500 text-xs">{SITE.name}</p>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export function AuthInput({ id, label, type = 'text', ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder-slate-500 input-focus-glow"
        {...props}
      />
    </div>
  );
}

export function AuthError({ message }) {
  if (!message) return null;
  return (
    <div className="p-3 rounded-xl bg-red-500/10 border border-red-400/30 text-red-200 text-sm">
      {message}
    </div>
  );
}

export function AuthDivider({ label }) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/10" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-transparent px-3 text-slate-500 uppercase tracking-wider">{label}</span>
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
            className={`h-1 flex-1 rounded-full ${i < score ? colors[score - 1] : 'bg-white/10'}`}
          />
        ))}
      </div>
      <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
        {checks.map((c) => (
          <li key={c.label} className={c.met ? 'text-emerald-400' : 'text-slate-500'}>
            {c.met ? '✓' : '○'} {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
