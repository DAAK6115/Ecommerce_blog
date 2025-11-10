import { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, logout as apiLogout, adminListProducts, probeIsStaff } from './api';


const AuthCtx = createContext(null);
export function useAuth() { return useContext(AuthCtx); }

function decodeJwt(token) {
  try {
    const base = token.split('.')[1];
    const json = atob(base.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return {};
  }
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasTokens = !!localStorage.getItem('tokens');
    const email = localStorage.getItem('lastEmail') || null;
    let meta = { is_staff: false, is_superuser: false };

    try {
      const { access } = JSON.parse(localStorage.getItem('tokens') || '{}');
      if (access) {
        const payload = decodeJwt(access);
        meta.is_staff = !!payload.is_staff;
        meta.is_superuser = !!payload.is_superuser;
      }
    } catch {}

    (async () => {
      if (hasTokens) {
        let isStaff = false;
        try { isStaff = await probeIsStaff(); } catch {}
        setUser({ email, is_staff: isStaff, is_superuser: meta.is_superuser });
      } else {
        setUser(null);
      }
      setLoading(false);
    })();
  }, []);

  async function login(email, password) {
  await apiLogin({ email, password });
  localStorage.setItem('lastEmail', email);

  let isStaff = false, isSuper = false;
  try {
    const { access } = JSON.parse(localStorage.getItem('tokens') || '{}');
    if (access) {
      const payload = decodeJwt(access);
      isSuper = !!payload.is_superuser;
    }
  } catch {}

  try { isStaff = await probeIsStaff(); } catch {}

  const u = { email, is_staff: isStaff, is_superuser: isSuper };
  setUser(u);
  return u;
}


  function logout() {
    apiLogout();
    localStorage.removeItem('lastEmail');
    setUser(null);
  }

  const value = { user, setUser, login, logout, loading, isAuth: !!user };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
