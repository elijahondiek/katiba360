import { NextRequest, NextResponse } from 'next/server';

/**
 * Google OAuth callback handler
 * 
 * This route handles the callback from Google OAuth authentication.
 * It receives the authorization code and state parameter and redirects
 * to the client-side callback page with the parameters in the URL.
 */
export async function GET(request: NextRequest) {
  try {
    // Get the URL and search parameters
    const { searchParams } = new URL(request.url);
    
    // Extract code and state from query parameters
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    // If there's an error or no code, redirect to login page with error
    if (error || !code) {
      console.error('OAuth error:', error ?? 'No authorization code received');
      return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
    }
    
    // Instead of using cookies, pass the code and state as query parameters
    // This is more reliable across different browsers and environments
    const callbackUrl = new URL('/auth/callback', request.url);
    callbackUrl.searchParams.set('code', code);
    
    if (state) {
      callbackUrl.searchParams.set('state', state);
    }
    
    return NextResponse.redirect(callbackUrl);
  } catch (error) {
    console.error('Error in Google OAuth callback:', error);
    return NextResponse.redirect(new URL('/login?error=server_error', request.url));
  }
}
