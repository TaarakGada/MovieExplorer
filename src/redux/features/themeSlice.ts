import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ThemeState = {
    darkMode: boolean;
};

// Initialize from localStorage if available
const getInitialTheme = (): boolean => {
    if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        // Check user preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
};

const initialState: ThemeState = {
    darkMode: false, // Will be updated in useEffect when component mounts
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
            state.darkMode = getInitialTheme();
        },
    },
});

export const { setDarkMode, toggleTheme, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;
