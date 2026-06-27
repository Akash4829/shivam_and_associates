import React, { useLayoutEffect, useRef, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

/**
 * GoogleLogin requires width in pixels (max 400). Passing "100%" breaks the iframe
 * and makes the button appear clickable but unresponsive.
 */
export default function GoogleSignInButton({ onSuccess, onError, disabled = false }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(320);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const update = () => {
      const measured = Math.floor(el.getBoundingClientRect().width);
      if (measured > 0) {
        setWidth(Math.min(measured, 400));
      }
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (disabled) {
    return (
      <div className="w-full rounded-xl bg-slate-200 py-3.5 text-center text-sm text-slate-500">
        Continue with Google
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full flex justify-center min-h-[44px]">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        theme="filled_blue"
        size="large"
        width={width}
        text="continue_with"
        shape="rectangular"
        useOneTap={false}
      />
    </div>
  );
}
