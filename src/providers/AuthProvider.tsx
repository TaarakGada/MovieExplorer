'use client';

import { useAppDispatch } from '@/redux/hooks';
import { loginSuccess, logout } from '@/redux/features/authSlice';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface AuthProviderProps {
    children: React.ReactNode;
}

// Public routes that don't require authentication
const publicRoutes = ['/login', '/register'];

export default function AuthProvider({ children }: AuthProviderProps) {
    const { data: session, status } = useSession();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Update Redux auth state based on NextAuth session
        if (session?.user) {
            // Make sure we always have an ID
            const userId = session.user.id || `user_${Date.now()}`;

            // Log the session data to help with debugging
            console.log('Session data:', JSON.stringify(session.user, null, 2));

            dispatch(
                loginSuccess({
                    id: userId,
                    name: session.user.name || 'User',
                    email: session.user.email || '',
                })
            );

            // For debugging
            console.log('User authenticated:', {
                id: userId,
                name: session.user.name,
                email: session.user.email,
            });
        } else if (status === 'unauthenticated') {
            console.log('User is not authenticated');
            dispatch(logout());

            // Redirect to login if trying to access protected routes
            if (!publicRoutes.includes(pathname) && pathname !== '/') {
                router.push('/login');
            }
        }
    }, [session, status, dispatch, router, pathname]);

    return <>{children}</>;
}
