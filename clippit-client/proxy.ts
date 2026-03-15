import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
    const { userId } = await auth();

    if (userId && isPublicRoute(request)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if (!userId && !isPublicRoute(request)) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }
});

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|.*\\.png$).*)',
    ],
};