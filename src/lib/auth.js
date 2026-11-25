export const authStorage = {
  save: (data) => {
    localStorage.setItem('nekacy-auth', JSON.stringify(data));
  },
  get: () => {
    if (typeof window === 'undefined') return null;
    const value = localStorage.getItem('nekacy-auth');
    return value ? JSON.parse(value) : null;
  },
  clear: () => {
    localStorage.removeItem('nekacy-auth');
  },
};
