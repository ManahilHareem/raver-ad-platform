import { getToken, logout } from './auth';

/**
 * A wrapper around the native fetch API that automatically adds authentication headers
 * and handles 401 Unauthorized responses by logging the user out.
 */
export const apiFetch = async (
  url: string | URL,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken();

  const headers = new Headers(options.headers || {});
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    cache: 'no-store',
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Immediate logout if the token is invalid or expired
    logout();
    // Throw an error to stop further processing in the calling code
    throw new Error('Unauthorized');
  }

  return response;
};
