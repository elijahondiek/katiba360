/**
 * API utilities for making requests to the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Make a request to the backend API
 */
export async function fetchAPI(
  endpoint: string, 
  options: RequestInit = {}
): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'An error occurred while fetching data');
  }

  return data;
}

/**
 * Exchange Google OAuth code for tokens
 */
export async function exchangeGoogleCode(
  code: string,
  redirectUri: string,
  state?: string
): Promise<any> {
  return fetchAPI('/auth/google', {
    method: 'POST',
    body: JSON.stringify({
      code,
      redirect_uri: redirectUri,
      state,
    }),
  });
}
