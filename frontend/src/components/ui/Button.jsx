import React from 'react';
import { Link } from 'react-router-dom';

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
  const cls = `${variants[variant] || variants.primary} ${className} ${disabled ? 'opacity-50 pointer-events-none' : ''}`;

  if (to) {
    return (
      <Link to={to} className={cls} aria-label={ariaLabel} onClick={onClick} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} aria-label={ariaLabel} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={cls} disabled={disabled} aria-label={ariaLabel} {...props}>
      {children}
    </button>
  );
}

export default Button;
