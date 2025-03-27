'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import { store } from '@/redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initializeTheme } from '@/redux/features/themeSlice';
import { initializeFavorites } from '@/redux/features/favoritesSlice';
import ThemeProvider from './ThemeProvider';
import AuthProvider from './AuthProvider';

interface ProvidersProps {
    children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    // Initialize theme and favorites from localStorage on client side
    useEffect(() => {
        store.dispatch(initializeTheme());
        store.dispatch(initializeFavorites());
    }, []);

    return (
        <Provider store={store}>
            <SessionProvider>
                <ThemeProvider>
                    <AuthProvider>
                        {children}
                        <ToastContainer position="bottom-right" />
                    </AuthProvider>
                </ThemeProvider>
            </SessionProvider>
        </Provider>
    );
}
