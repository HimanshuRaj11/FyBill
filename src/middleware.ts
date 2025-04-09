import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/Login', '/Register', '/forgot-password', '/reset-password']
const privatePaths = ['/Dashboard', '/Profile', '/Settings', '/Invoice', '/Customers', '/Staff']

const isPublicPath = (path: string) => {
    return publicPaths.some(publicPath => path.startsWith(publicPath))
}

const isPrivatePath = (path: string) => {
    return privatePaths.some(privatePath => path.startsWith(privatePath))
}

const verifyToken = (request: NextRequest) => {
    const token = request.cookies.get('FyBill_auth_token')?.value

    if (!token) return false

    // Here you would typically verify the token with your backend
    // For now, we'll just check if it exists
    return true
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Allow access to static files and API routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        pathname.includes('.')
    ) {
        return NextResponse.next()
    }

    // Check if the path is public
    if (isPublicPath(pathname)) {
        // If user is already authenticated and trying to access login/register, redirect to dashboard
        if (verifyToken(request)) {
            return NextResponse.redirect(new URL('/Dashboard', request.url))
        }
        // Allow access to public paths
        return NextResponse.next()
    }

    // Check if the path is private
    if (isPrivatePath(pathname)) {
        // If user is not authenticated, redirect to login
        if (!verifyToken(request)) {
            const loginUrl = new URL('/Login', request.url)
            loginUrl.searchParams.set('redirect', pathname)
            return NextResponse.redirect(loginUrl)
        }
        return NextResponse.next()
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}