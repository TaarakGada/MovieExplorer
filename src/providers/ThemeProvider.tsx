'use client';

import { useAppSelector } from '@/redux/hooks';
import { useEffect } from 'react';

interface ThemeProviderProps {
    children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
    const { darkMode } = useAppSelector((state) => state.theme);

    useEffect(() => {
        // Update the HTML class for dark mode
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return <>{children}</>;
}
