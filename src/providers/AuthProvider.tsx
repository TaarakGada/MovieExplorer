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
            dispatch(
                loginSuccess({
                    id: session.user.id || '',
                    name: session.user.name || '',
                    email: session.user.email || '',
                })
            );
        } else if (status === 'unauthenticated') {
            dispatch(logout());

            // Redirect to login if trying to access protected routes
            if (!publicRoutes.includes(pathname) && pathname !== '/') {
                router.push('/login');
            }
        }
    }, [session, status, dispatch, router, pathname]);

    return <>{children}</>;
}
