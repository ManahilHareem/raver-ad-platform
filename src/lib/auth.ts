/**
 * Authentication utilities for managing the 'raver_token' cookie.
 */

const TOKEN_NAME = 'raver_token';

/**
 * Retrieves the token from cookies.
 */
export const getToken = (): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${TOKEN_NAME}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};

/**
 * Sets the token in cookies with a 1-day expiration.
 */
export const setToken = (token: string): void => {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + 1 * 24 * 60 * 60 * 1000);
  document.cookie = `${TOKEN_NAME}=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
};

/**
 * Removes the token from cookies.
 */
export const removeToken = (): void => {
  if (typeof document === 'undefined') return;
  document.cookie = `${TOKEN_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
};

/**
 * Logs out the user by clearing the token and redirecting to the login page.
 */
export const logout = (): void => {
  removeToken();
  if (typeof window !== 'undefined') {
    if (window.location.pathname !== '/' && window.location.pathname !== '/signup') {
      window.location.href = '/';
    }
  }
};
