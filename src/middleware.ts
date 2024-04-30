import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from './server/queries'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/quotations(.*)',
  '/clients(.*)',
])

function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

export default clerkMiddleware((auth, request) => {
  const pathname = request.nextUrl.pathname
  const userId = auth().userId

  // check if the request is for a protected route and protect it
  if (isProtectedRoute(request)) {
    auth().protect()
  }

  // if the user is authenticated and the request is for the home page, redirect to the dashboard
  if (userId && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
