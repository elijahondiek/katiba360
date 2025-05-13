import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { fetchAPI } from '@/lib/api';

/**
 * Logout API route handler
 * 
 * This route handles user logout by:
 * 1. Calling the backend logout endpoint to invalidate tokens
 * 2. Clearing authentication cookies and local storage
 * 3. Redirecting to the login page
 */
export async function POST(request: NextRequest) {
  try {
    // Get the access token from the request
    const authHeader = request.headers.get('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    
    if (accessToken) {
      try {
        // Call the backend logout endpoint
        await fetchAPI('/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } catch (error) {
        // If the backend call fails, we still want to log out locally
        console.error('Error calling backend logout:', error);
      }
    }
    
    // Clear the accessToken cookie (set to expired)
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    response.cookies.set('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0), // Expire immediately
    });
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    
    // Return error response
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to logout' 
      },
      { status: 500 }
    );
  }
}
