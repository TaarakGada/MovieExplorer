import axios from 'axios';

// Use environment variables or fallback to a hardcoded API key for testing
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '10c3bca577620538a14ab1835ac2ae35'; // Temporary hardcoded key for debugging
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

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
        return '/placeholder.jpg'; // Simplified to one placeholder
    }
    return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Movie endpoints
export const movieAPI = {
    getPopular: (page = 1) =>
        api.get('/movie/popular', {
            params: { page }
        }).then(response => {
            console.log('Popular movies API response:', response.data);
            return response;
        }).catch(error => {
            console.error('Error fetching popular movies:', error);
            throw error;
        }),
    getSearchResults: (query: string, page = 1) =>
        api.get('/search/movie', {
            params: { query, page }
        }).then(response => {
            console.log('Search API response:', response.data);
            return response;
        }).catch(error => {
            console.error('Error searching movies:', error);
            throw error;
        }),
    getDetails: (id: string) =>
        api.get(`/movie/${id}`),
    getSimilar: (id: string) =>
        api.get(`/movie/${id}/similar`),
    getCredits: (id: string) =>
        api.get(`/movie/${id}/credits`)
};

export default api;
