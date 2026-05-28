/**
 * Subtle, premium-feeling motion presets (slower, softer easing).
 */
export const easeSoft = [0.16, 1, 0.3, 1];

export const springSoft = { type: 'spring', stiffness: 200, damping: 34, mass: 0.85 };

export const transitionScroll = { duration: 0.7, ease: easeSoft };

export const transitionHover = { duration: 0.45, ease: easeSoft };
