import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost:
    'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-accent border border-accent/30 hover:bg-accent/10 transition-colors duration-300',
  whatsapp:
    'inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-depth-sm hover:brightness-110 transition-all duration-300',
};

export function MagneticButton({
  children,
  variant = 'primary',
  to,
  href,
  onClick,
  type = 'button',
  className = '',
  strength = 18,
  ariaLabel,
  ...rest
}) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const tx = useSpring(x, { stiffness: 250, damping: 20, mass: 0.6 });
  const ty = useSpring(y, { stiffness: 250, damping: 20, mass: 0.6 });

  const onMove = (e) => {
    if (reduceMotion || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const relX = e.clientX - r.left - r.width / 2;
    const relY = e.clientY - r.top - r.height / 2;
    x.set((relX / r.width) * strength);
    y.set((relY / r.height) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const cls = `${variants[variant] || variants.primary} ${className}`;

  const content = (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: tx, y: ty }}
      className="inline-flex"
    >
      {to && (
        <Link to={to} className={cls} aria-label={ariaLabel} {...rest}>
          {children}
        </Link>
      )}
      {!to && href && (
        <a
          href={href}
          className={cls}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          aria-label={ariaLabel}
          {...rest}
        >
          {children}
        </a>
      )}
      {!to && !href && (
        <button type={type} onClick={onClick} className={cls} aria-label={ariaLabel} {...rest}>
          {children}
        </button>
      )}
    </motion.span>
  );

  return content;
}

export default MagneticButton;
