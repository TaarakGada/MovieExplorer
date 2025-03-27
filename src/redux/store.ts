import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './features/themeSlice';
import authReducer from './features/authSlice';
import favoritesReducer from './features/favoritesSlice';

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        auth: authReducer,
        favorites: favoritesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
