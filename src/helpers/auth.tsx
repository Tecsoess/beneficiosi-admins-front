export const AUTH_KEY = 'beneficio-admin-auth';


export const setAuth = (authInfo: any) => {
  if (authInfo) {
    localStorage.setItem(AUTH_KEY, authInfo);
  }
};

export const clearAuth = () => {
  localStorage.removeItem(AUTH_KEY)
};

export const getAuth = () => {
  return localStorage.getItem(AUTH_KEY);
};

export const deleteAuth = () => {
  localStorage.removeItem(AUTH_KEY);
};
