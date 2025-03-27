import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Movie {
    id: string;
    title: string;
    poster_path: string;
    vote_average: number;
    release_date?: string;
    overview?: string;
}

interface FavoritesState {
    movies: Movie[];
}

// Initialize state from localStorage if available
const getInitialFavorites = (): Movie[] => {
    if (typeof window !== 'undefined') {
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
            return JSON.parse(savedFavorites);
        }
    }
    return [];
};

const initialState: FavoritesState = {
    movies: [],
};

export const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        addFavorite: (state, action: PayloadAction<Movie>) => {
            if (!state.movies.some(movie => movie.id === action.payload.id)) {
                state.movies.push(action.payload);
                // Save to localStorage
                if (typeof window !== 'undefined') {
                    localStorage.setItem('favorites', JSON.stringify(state.movies));
                }
            }
        },
        removeFavorite: (state, action: PayloadAction<string>) => {
            state.movies = state.movies.filter(movie => movie.id !== action.payload);
            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('favorites', JSON.stringify(state.movies));
            }
        },
        initializeFavorites: (state) => {
            state.movies = getInitialFavorites();
        },
    },
});

export const { addFavorite, removeFavorite, initializeFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
