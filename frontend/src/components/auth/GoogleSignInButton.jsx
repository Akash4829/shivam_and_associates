import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { GoogleLogin, useGoogleOAuth } from '@react-oauth/google';
import { getApiOrigin } from '../../utils/axiosConfig';

function getGoogleLoginUri() {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // Google redirect must POST back to the same site origin (use Vercel /api proxy).
    return `${window.location.origin.replace(/^http:/, 'https:')}/api/auth/google`;
  }
  return `${getApiOrigin()}/api/auth/google`;
}

/**
 * Google Sign-In via full-page redirect (no popup).
 * Popup mode is unreliable when FedCM is disabled or the browser blocks windows.
 */
export default function GoogleSignInButton({
  redirectPath = '/',
  onSuccess,
  onError,
  disabled = false,
}) {
  const { scriptLoadedSuccessfully } = useGoogleOAuth();
  const containerRef = useRef(null);
  const [width, setWidth] = useState(320);

  const loginUri = useMemo(() => getGoogleLoginUri(), []);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const measured = Math.floor(el.getBoundingClientRect().width);
    if (measured > 0) {
      setWidth(Math.min(measured, 400));
    }

    return undefined;
  }, []);

  if (disabled) {
    return (
      <div className="w-full rounded-xl bg-slate-200 py-3.5 text-center text-sm text-slate-500">
        Continue with Google
      </div>
    );
  }

  if (!scriptLoadedSuccessfully) {
    return (
      <div className="w-full rounded-xl bg-slate-100 py-3.5 text-center text-sm text-slate-400 animate-pulse">
        Loading Google sign-in…
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
        ux_mode="redirect"
        login_uri={loginUri}
        state={redirectPath}
        use_fedcm_for_prompt={false}
        use_fedcm_for_button={false}
        auto_select={false}
      />
    </div>
  );
}
