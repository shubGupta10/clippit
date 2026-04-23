import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/bookmarklet(.*)',
]);

const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)']);

export default clerkMiddleware(async (auth, request) => {
    const { userId, sessionClaims } = await auth();
    const isBookmarklet = request.nextUrl.pathname.startsWith('/bookmarklet');

    // Unauthenticated users can only access public routes
    if (!userId && !isPublicRoute(request)) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Authenticated users on public routes → redirect to dashboard
    if (userId && isPublicRoute(request) && !isBookmarklet) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Onboarding gate: if user is logged in but hasn't completed onboarding,
    // redirect to /onboarding. This uses Clerk's publicMetadata (already synced
    // from your backend), so it's instant — no API call needed.
    if (userId && !isOnboardingRoute(request) && !isPublicRoute(request)) {
        const onboardingComplete = (sessionClaims?.metadata as any)?.onboardingComplete === true
            || (sessionClaims as any)?.publicMetadata?.onboardingComplete === true;

        if (!onboardingComplete) {
            return NextResponse.redirect(new URL('/onboarding', request.url));
        }
    }

    // If user is onboarded but on /onboarding, redirect to dashboard
    if (userId && isOnboardingRoute(request)) {
        const onboardingComplete = (sessionClaims?.metadata as any)?.onboardingComplete === true
            || (sessionClaims as any)?.publicMetadata?.onboardingComplete === true;

        if (onboardingComplete) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }
});

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|.*\\.png$).*)',
    ],
};