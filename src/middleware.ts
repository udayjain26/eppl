import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/estimates(.*)',
  '/clients(.*)',
  '/api(.*)', // Add this line to protect /api routes
])

export default clerkMiddleware((auth, request) => {
  const pathname = request.nextUrl.pathname
  const userId = auth().userId

  // Check if the request is for a protected route and protect it
  if (isProtectedRoute(request)) {
    auth().protect()
  }

  // If the user is authenticated and the request is for the home page, redirect to the dashboard
  if (userId && pathname === '/') {
    return NextResponse.redirect(new URL('/clients', request.url))
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
