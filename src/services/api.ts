import axios from 'axios';

// Use environment variables
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_API_URL || 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL || 'https://image.tmdb.org/t/p';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY
    }
});

// Helper function to get image URLs
export const getImageUrl = (path: string, size = 'w500') => {
    if (!path) return null;
    return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Movie endpoints
export const movieAPI = {
    getPopular: (page = 1) =>
        api.get('/movie/popular', {
            params: { page }
        }),
    getSearchResults: (query: string, page = 1) =>
        api.get('/search/movie', {
            params: { query, page }
        }),
    getDetails: (id: string) =>
        api.get(`/movie/${id}`),
    getSimilar: (id: string) =>
        api.get(`/movie/${id}/similar`),
    getCredits: (id: string) =>
        api.get(`/movie/${id}/credits`)
};

export default api;
