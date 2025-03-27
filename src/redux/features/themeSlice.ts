import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ThemeState = {
    darkMode: boolean;
};

// Initialize from localStorage if available
const getInitialTheme = (): boolean => {
    // Safe guard for SSR
    if (typeof window === 'undefined') {
        return false;
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme === 'dark';
    }

    // Check user preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const initialState: ThemeState = {
    darkMode: false, // Default value, will be updated when initializeTheme is called
};

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setDarkMode: (state, action: PayloadAction<boolean>) => {
            state.darkMode = action.payload;
            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('theme', action.payload ? 'dark' : 'light');
            }
        },
        toggleTheme: (state) => {
            state.darkMode = !state.darkMode;
            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('theme', state.darkMode ? 'dark' : 'light');
            }
        },
        initializeTheme: (state) => {
            // Only update if we're on the client side
            if (typeof window !== 'undefined') {
                state.darkMode = getInitialTheme();
            }
        },
    },
});

export const { setDarkMode, toggleTheme, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;
