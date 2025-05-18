/**
 * API utilities for making requests to the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/**
 * Make a request to the backend API
 */
export async function fetchAPI(
  endpoint: string, 
  options: RequestInit = {}
): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get access token from localStorage if available
  let accessToken = null;
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('accessToken');
  }
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      // Add authorization header if token exists
      ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail ?? 'An error occurred while fetching data');
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

/**
 * Get the current user's profile
 */
export async function getUserProfile(): Promise<any> {
  return fetchAPI('/users/profile');
}

/**
 * Get the constitution overview
 */
export async function getConstitutionOverview(): Promise<any> {
  return fetchAPI('/constitution');
}

/**
 * Get all chapters with pagination
 * @param limit Number of chapters to fetch
 * @param offset Offset for pagination
 */
export async function getChapters(limit: number = 10, offset: number = 0): Promise<any> {
  return fetchAPI(`/constitution/chapters?limit=${limit}&offset=${offset}`);
}

/**
 * Get a chapter by its number
 * @param chapterNumber Chapter number
 */
export async function getChapterByNumber(chapterNumber: number): Promise<any> {
  return fetchAPI(`/constitution/chapters/${chapterNumber}`);
}

/**
 * Get an article by chapter and article number
 * @param chapterNumber Chapter number
 * @param articleNumber Article number
 */
export async function getArticleByChapterAndArticle(
  chapterNumber: number,
  articleNumber: number
): Promise<any> {
  return fetchAPI(`/constitution/chapters/${chapterNumber}/articles/${articleNumber}`);
}

/**
 * Search the constitution
 * @param params Search parameters (query, chapter, article, limit, offset, highlight, no_cache)
 */
export async function searchConstitution(params: {
  query: string;
  chapter?: number;
  article?: number;
  limit?: number;
  offset?: number;
  highlight?: boolean;
  no_cache?: boolean;
}): Promise<any> {
  const {
    query,
    chapter,
    article,
    limit = 10,
    offset = 0,
    highlight = false,
    no_cache = false,
  } = params;
  const url = `/constitution/search?query=${encodeURIComponent(query)}${
    chapter !== undefined ? `&chapter=${chapter}` : ''
  }${article !== undefined ? `&article=${article}` : ''}&limit=${limit}&offset=${offset}&highlight=${highlight}&no_cache=${no_cache}`;
  return fetchAPI(url);
}

/**
 * Find related articles by reference
 * @param reference Reference string (e.g., '1.2')
 */
export async function getRelatedArticles(reference: string): Promise<any> {
  return fetchAPI(`/constitution/related/${reference}`);
}

/**
 * Get popular/trending sections
 * @param timeframe Timeframe string (e.g., 'week', 'month')
 */
export async function getPopularSections(timeframe: string = 'week'): Promise<any> {
  return fetchAPI(`/constitution/popular?timeframe=${timeframe}`);
}

/**
 * Save a bookmark for the user
 * @param userId User's UUID
 * @param bookmark_type Type of bookmark (e.g., 'chapter', 'article', etc)
 * @param reference Reference string (e.g., '1', '1.2', etc)
 * @param title Title of the bookmarked item
 */
export async function saveBookmark({
  userId,
  bookmark_type,
  reference,
  title,
}: {
  userId: string;
  bookmark_type: string;
  reference: string;
  title: string;
}): Promise<any> {
  return fetchAPI(
    `/constitution/user/${userId}/bookmarks`,
    {
      method: 'POST',
      body: JSON.stringify({
        bookmark_type,
        reference,
        title,
      }),
    }
  );
}

/**
 * Get all bookmarks for a user
 * @param userId User's UUID
 */
export async function getUserBookmarks(userId: string): Promise<any> {
  return fetchAPI(`/constitution/user/${userId}/bookmarks`);
}

/**
 * Remove a bookmark for the user
 * @param userId User's UUID
 * @param bookmarkId The ID of the bookmark to remove
 */
export async function removeBookmark(
  userId: string,
  bookmarkId: string
): Promise<any> {
  console.log(`Removing bookmark: userId=${userId}, bookmarkId=${bookmarkId}`);
  const url = `/constitution/user/${userId}/bookmarks/${bookmarkId}`;
  console.log(`DELETE request to: ${url}`);
  
  return fetchAPI(
    url,
    {
      method: 'DELETE',
    }
  );
}
