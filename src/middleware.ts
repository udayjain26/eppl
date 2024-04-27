import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

export default clerkMiddleware((auth, request) => {
  const pathname = request.nextUrl.pathname
  const userId = auth().userId

  if (isProtectedRoute(request)) {
    auth().protect()
  }

  if (userId && pathname === '/') {
    console.log('Wow', request.url)
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
