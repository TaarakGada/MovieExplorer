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

// Update getImageUrl to handle null/undefined paths
export const getImageUrl = (path: string | null | undefined, size = 'w500') => {
    if (!path) {
        // Return placeholder based on size requested
        return size.includes('original') ? 'public\placeholder.jpg' : 'public\placeholder.jpg';
    }
    return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Movie endpoints
export const movieAPI = {
    getPopular: (page = 1) =>
        api.get('/movie/popular', {
            params: { page }
        }).then(response => {
            // Filter out movies without posters
            response.data.results = response.data.results.filter(movie => movie.poster_path);
            return response;
        }),
    getSearchResults: (query: string, page = 1) =>
        api.get('/search/movie', {
            params: { query, page }
        }).then(response => {
            // Filter out movies without posters
            response.data.results = response.data.results.filter(movie => movie.poster_path);
            return response;
        }),
    getDetails: (id: string) =>
        api.get(`/movie/${id}`),
    getSimilar: (id: string) =>
        api.get(`/movie/${id}/similar`),
    getCredits: (id: string) =>
        api.get(`/movie/${id}/credits`)
};

export default api;
