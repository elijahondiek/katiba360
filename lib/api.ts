/**
 * API utilities for making requests to the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;


/**
 * Make a request to the backend API
 */
export async function fetchAPI(
  endpoint: string, 
  options: RequestInit = {}
): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  let accessToken = null;
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('accessToken');
    // Ensure we don't send "undefined" as the token
    if (accessToken === 'undefined' || accessToken === 'null') {
      accessToken = null;
    }
  }
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  };

  const finalOptions = {
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // Enhanced logging for debugging
  if (DEBUG_MODE) {
    console.log('--- API Request ---');
    console.log(`Endpoint: ${endpoint}`);
    console.log(`URL: ${url}`);
    console.log('Options:', JSON.stringify(finalOptions, null, 2));
    console.log('-------------------');
  }

  const response = await fetch(url, finalOptions);

  let data;
  try {
    data = await response.json();
  } catch (e) {
    console.error('Failed to parse response as JSON:', e);
    console.error('Response status:', response.status);
    console.error('Response headers:', response.headers);
    throw new Error('Invalid JSON response from server');
  }

  if (!response.ok) {
    const error = new Error(data.detail ?? 'An error occurred while fetching data');
    (error as any).status = response.status;
    console.error('API Error:', { url, status: response.status, response: data });
    throw error;
  }

  return data;
}

/**
 * Make a request with automatic token refresh on 401 errors
 */
export async function fetchAPIWithRefresh(
  endpoint: string, 
  options: RequestInit = {}
): Promise<any> {
  // Import here to avoid circular dependency
  const { apiInterceptorService } = await import('@/services/api-interceptor.service');
  return apiInterceptorService.fetchWithRefresh(endpoint, options);
}

/**
 * Exchange Google OAuth code for tokens
 */
export async function exchangeGoogleCode(
  code: string,
  redirectUri: string,
  state?: string
): Promise<any> {
  return fetchAPI('/api/v1/auth/google', {
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
  return fetchAPI('/api/v1/users/profile');
}

/**
 * Update the current user's profile
 * @param profileData Profile data to update
 */
export async function updateUserProfile(profileData: {
  display_name?: string;
  bio?: string;
}): Promise<any> {
  return fetchAPI('/api/v1/users/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
}

/**
 * Get the constitution overview
 */
export async function getConstitutionOverview(): Promise<any> {
  return fetchAPI('/api/v1/constitution');
}

/**
 * Get all chapters with pagination
 * @param limit Number of chapters to fetch
 * @param offset Offset for pagination
 */
export async function getChapters(limit: number = 10, offset: number = 0): Promise<any> {
  return fetchAPI(`/api/v1/constitution/chapters?limit=${limit}&offset=${offset}`);
}

/**
 * Get a chapter by its number
 * @param chapterNumber Chapter number
 */
export async function getChapterByNumber(chapterNumber: number, options?: { force_reload?: boolean }): Promise<any> {
  const params = new URLSearchParams();
  if (options?.force_reload) {
    params.append('force_reload', 'true');
  }
  const url = `/api/v1/constitution/chapters/${chapterNumber}${params.toString() ? `?${params.toString()}` : ''}`;
  return fetchAPI(url);
}

/**
 * Force reload constitution data from the backend (clears cache)
 */
export async function reloadConstitutionData(): Promise<any> {
  return fetchAPI('/api/v1/constitution/reload', {
    method: 'POST',
  });
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
  return fetchAPI(`/api/v1/constitution/chapters/${chapterNumber}/articles/${articleNumber}`);
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
  const url = `/api/v1/constitution/search?query=${encodeURIComponent(query)}${
    chapter !== undefined ? `&chapter=${chapter}` : ''
  }${article !== undefined ? `&article=${article}` : ''}&limit=${limit}&offset=${offset}&highlight=${highlight}&no_cache=${no_cache}`;
  return fetchAPI(url);
}

/**
 * Find related articles by reference
 * @param reference Reference string (e.g., '1.2')
 */
export async function getRelatedArticles(reference: string): Promise<any> {
  return fetchAPI(`/api/v1/constitution/related/${reference}`);
}

/**
 * Get popular/trending sections
 * @param timeframe Timeframe string (e.g., 'week', 'month')
 */
export async function getPopularSections(timeframe: string = 'week'): Promise<any> {
  return fetchAPI(`/api/v1/constitution/popular?timeframe=${timeframe}`);
}

/**
 * Save a bookmark for the user
 * @param userId User's UUID
 * @param bookmark Bookmark object with type, reference, and title
 */
export async function saveBookmark(
  userId: string,
  bookmark: {
    type: string;
    reference: string;
    title: string;
  }
): Promise<any> {
  return fetchAPI(
    `/api/v1/constitution/user/${userId}/bookmarks`,
    {
      method: 'POST',
      body: JSON.stringify({
        bookmark_type: bookmark.type,
        reference: bookmark.reference,
        title: bookmark.title,
      }),
    }
  );
}

/**
 * Get all bookmarks for a user
 * @param userId User's UUID
 */
export async function getUserBookmarks(userId: string): Promise<any> {
  return fetchAPIWithRefresh(`/api/v1/constitution/user/${userId}/bookmarks`);
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
  // console.log(`Removing bookmark: userId=${userId}, bookmarkId=${bookmarkId}`);
  const url = `/api/v1/constitution/user/${userId}/bookmarks/${bookmarkId}`;
  // console.log(`DELETE request to: ${url}`);
  
  return fetchAPI(
    url,
    {
      method: 'DELETE',
    }
  );
}

// Debug mode for logging
const DEBUG_MODE = process.env.NODE_ENV === 'development';

/**
 * Update reading progress for the user
 * @param userId User's UUID
 * @param itemType Type of item (e.g., 'chapter', 'article')
 * @param reference Reference string (e.g., '1', '1.2')
 * @param readTimeMinutes Incremental time spent reading in minutes for this session only
 */
export async function updateReadingProgress({
  userId,
  itemType,
  reference,
  readTimeMinutes,
}: {
  userId: string;
  itemType: 'chapter' | 'article';
  reference: string;
  readTimeMinutes: number;
}) {
  try {
    // Ensure readTimeMinutes is a valid number, never null or NaN
    const safeReadTimeMinutes = typeof readTimeMinutes === 'number' && !isNaN(readTimeMinutes) ? 
      Math.max(0, readTimeMinutes) : 0;
    
    // Log the API call for debugging
    if (DEBUG_MODE) {
      console.log(`[READ TIME DEBUG] API call: Sending incremental read time of ${safeReadTimeMinutes} minutes to server`);
      console.log(`[READ TIME DEBUG] API params: userId=${userId}, itemType=${itemType}, reference=${reference}`);
    }
    
    const response = await fetchAPI(
      `/api/v1/constitution/user/${userId}/progress`,
      {
        method: 'POST',
        body: JSON.stringify({
          item_type: itemType,
          reference,
          read_time_minutes: safeReadTimeMinutes,
          is_incremental: true, // Flag to tell backend this is incremental time
        }),
      }
    );
    
    if (DEBUG_MODE && response?.body?.progress) {
      console.log(`[READ TIME DEBUG] API response: total_read_time_minutes=${response.body.progress.total_read_time_minutes || 0}`);
    }
    
    return response;
  } catch (error) {
    console.error('Error updating reading progress:', error);
    throw error;
  }
}

/**
 * Get reading progress for a user
 * @param userId User's UUID
 */
export async function getUserReadingProgress(userId: string): Promise<any> {
  return fetchAPIWithRefresh(`/api/v1/constitution/user/${userId}/progress`);
}

/**
 * Get user's reading streak
 */
export async function getUserReadingStreak(): Promise<any> {
  return fetchAPI('/api/v1/reading/streak');
}

/**
 * Get reading analytics for a specific period
 * @param period Time period ('week', 'month', 'year')
 */
export async function getReadingAnalytics(period: string): Promise<any> {
  return fetchAPI(`/api/v1/reading/analytics/${period}`)
}

/**
 * Get user achievements
 */
export async function getUserAchievements(): Promise<any> {
  return fetchAPIWithRefresh('/api/v1/achievements');
}

/**
 * Get user saved content
 * @param folderId Optional folder ID to filter by
 */
export async function getUserSavedContent(folderId?: string): Promise<any> {
  const queryParam = folderId ? `?folder_id=${folderId}` : '';
  return fetchAPI(`/api/v1/content/saved${queryParam}`);
}

/**
 * Save content for user
 * @param contentData Content data to save
 */
export async function saveContent(contentData: {
  content_type: string;
  content_id: string;
  title: string;
  description?: string;
  folder_id?: string;
}): Promise<any> {
  return fetchAPI('/api/v1/content/saved', {
    method: 'POST',
    body: JSON.stringify(contentData),
  });
}

/**
 * Remove saved content
 * @param contentId Content ID to remove
 */
export async function removeSavedContent(contentId: string): Promise<any> {
  return fetchAPI(`/api/v1/content/saved/${contentId}`, {
    method: 'DELETE',
  });
}

/**
 * Get user's offline content
 */
export async function getUserOfflineContent(): Promise<any> {
  return fetchAPI('/api/v1/content/offline');
}

/**
 * Add content for offline access
 * @param contentData Offline content data
 */
export async function addOfflineContent(contentData: {
  content_id: string;
  content_type: string;
  priority?: number;
}): Promise<any> {
  return fetchAPI('/api/v1/content/offline', {
    method: 'POST',
    body: JSON.stringify(contentData),
  });
}

/**
 * Remove offline content
 * @param contentId Content ID to remove from offline
 */
export async function removeOfflineContent(contentId: string): Promise<any> {
  return fetchAPI(`/api/v1/content/offline/${contentId}`, {
    method: 'DELETE',
  });
}
