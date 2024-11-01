import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    // Create a response object
    const res = NextResponse.next();

    // Create the Supabase client
    const supabase = createMiddlewareClient({
      req: request,
      res,
      options: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
    });

    // Refresh session if expired
    const { data: { session }, error } = await supabase.auth.getSession();

    // If there's an error or no session and trying to access protected routes
    if ((error || !session) && !request.nextUrl.pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return res;
  } catch (e) {
    console.error('Middleware error:', e);
    // Return to login on error
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Update matcher to exclude auth routes and static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (auth pages)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
}; 