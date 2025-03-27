import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_API_URL;

// Create axios instance with base configuration
const api = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
    },
});

// Movie endpoints
export const movieAPI = {
    getPopular: (page = 1) => api.get('/movie/popular', { params: { page } }),
    getDetails: (id: string) => api.get(`/movie/${id}`),
    getSearchResults: (query: string, page = 1) =>
        api.get('/search/movie', { params: { query, page } }),
    getSimilar: (id: string) => api.get(`/movie/${id}/similar`),
    getVideos: (id: string) => api.get(`/movie/${id}/videos`),
    getCredits: (id: string) => api.get(`/movie/${id}/credits`),
};

// Image URL helper
export const getImageUrl = (path: string, size = 'w500') => {
    if (!path) return '/placeholder-image.jpg';
    return `${process.env.NEXT_PUBLIC_TMDB_IMAGE_URL}/${size}${path}`;
};

export default api;
