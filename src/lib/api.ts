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
  
  // Only add Bearer token if it exists and is non-empty
  if (token && typeof token === 'string' && token.trim() !== '' && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      console.warn('Unauthorized API call detected - clearing session');
      // Immediate logout if the token is invalid or expired
      logout();
      // Throw an error to stop further processing in the calling code
      throw new Error('AUTH_UNAUTHORIZED');
    }

    return response;
  } catch (error: any) {
    if (error.message === 'AUTH_UNAUTHORIZED') throw error;
    
    console.error(`API Fetch Error [${url}]:`, error);
    throw error;
  }
};
