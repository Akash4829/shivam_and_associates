import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { springPremium } from '../../animations/variants';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-accent border border-accent/30 hover:bg-accent/10 transition-all duration-300',
  whatsapp: 'inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-depth-sm hover:brightness-110 transition-all duration-300',
};

export function Button({
  children,
  variant = 'primary',
  to,
  href,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  ariaLabel,
  ...props
}) {
  const reduceMotion = useReducedMotion();
  const cls = `${variants[variant] || variants.primary} ${className} ${disabled ? 'opacity-50 pointer-events-none' : ''}`;

  const wrap = (node) => (
    <motion.span
      whileHover={reduceMotion || disabled ? undefined : { scale: 1.02 }}
      whileTap={reduceMotion || disabled ? undefined : { scale: 0.98 }}
      transition={springPremium}
      className="inline-flex"
    >
      {node}
    </motion.span>
  );

  if (to) {
    return wrap(
      <Link to={to} className={cls} aria-label={ariaLabel} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return wrap(
      <a href={href} className={cls} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} aria-label={ariaLabel} {...props}>
        {children}
      </a>
    );
  }

  return wrap(
    <button type={type} onClick={onClick} className={cls} disabled={disabled} aria-label={ariaLabel} {...props}>
      {children}
    </button>
  );
}

export default Button;
