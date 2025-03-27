'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Movie } from '@/redux/features/favoritesSlice';
import { movieAPI } from '@/services/api';
import MovieCard from '@/components/MovieCard';
import MovieCardSkeleton from '@/components/MovieCardSkeleton';
import SearchBar from '@/components/SearchBar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Create a wrapper component that uses useSearchParams
function HomeContent() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const searchQuery = searchParams?.get('search');
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        // Redirect to login if not authenticated
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        // Reset state when search query changes
        setMovies([]);
        setPage(1);
        setHasMore(true);
        setLoading(true);
        setError(null);

        if (status === 'authenticated') {
            fetchMovies(1);
        }
    }, [searchQuery, status]);

    const fetchMovies = async (pageNum: number) => {
        try {
            console.log(
                'Fetching movies, page:',
                pageNum,
                'search:',
                searchQuery || 'none'
            );
            let response;

            if (searchQuery) {
                response = await movieAPI.getSearchResults(
                    searchQuery,
                    pageNum
                );
            } else {
                response = await movieAPI.getPopular(pageNum);
            }

            // Complete response data for debugging
            console.log(
                'Complete API response:',
                JSON.stringify(response.data)
            );

            // More detailed error checking
            if (!response.data) {
                throw new Error('No data received from API');
            }

            if (
                !response.data.results ||
                !Array.isArray(response.data.results)
            ) {
                throw new Error('Invalid response format from API');
            }

            const { results, total_pages } = response.data;
            console.log(`Got ${results.length} raw movies`);

            // If results array is empty on first page, handle specifically
            if (results.length === 0 && pageNum === 1) {
                setMovies([]);
                setHasMore(false);
                setLoading(false);
                setError(
                    searchQuery
                        ? `No results found for "${searchQuery}"`
                        : 'No movies available at the moment'
                );
                return;
            }

            // Normalize the movie data to ensure it matches expected structure
            const normalizedMovies = results.map((movie: any) => ({
                id: movie.id?.toString() || `unknown-${Math.random()}`,
                title: movie.title || 'Unknown Title',
                poster_path: movie.poster_path,
                vote_average:
                    typeof movie.vote_average === 'number'
                        ? movie.vote_average
                        : 0,
                release_date: movie.release_date || '',
                // Add any other fields your MovieCard component expects
            }));

            console.log(`Using ${normalizedMovies.length} normalized movies`);

            if (pageNum === 1) {
                setMovies(normalizedMovies);
            } else {
                setMovies((prev) => [...prev, ...normalizedMovies]);
            }

            setHasMore(total_pages ? pageNum < total_pages : false);
            setLoading(false);
            setError(null);
        } catch (error) {
            console.error('Error fetching movies:', error);
            setLoading(false);
            setError(
                error instanceof Error
                    ? error.message
                    : 'Failed to fetch movies'
            );
        }
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            setLoading(true);
            fetchMovies(nextPage);
        }
    };

    // Handle scroll for infinite loading
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 100
            ) {
                loadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore]);

    return (
        <div>
            {status === 'loading' ? (
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            ) : status === 'authenticated' ? (
                <>
                    <SearchBar />

                    <h1 className="text-2xl font-bold mb-6">
                        {searchQuery
                            ? `Search Results for "${searchQuery}"`
                            : 'Popular Movies'}
                    </h1>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {movies.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                            />
                        ))}

                        {loading &&
                            Array.from({ length: 5 }).map((_, index) => (
                                <MovieCardSkeleton key={`skeleton-${index}`} />
                            ))}
                    </div>

                    {!loading && movies.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-xl">
                                {error || 'No movies found'}
                            </p>
                            <button
                                onClick={() => {
                                    setError(null);
                                    fetchMovies(1);
                                }}
                                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                            >
                                {searchQuery
                                    ? 'Try a different search'
                                    : 'Retry'}
                            </button>
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        router.push('/');
                                    }}
                                    className="mt-4 ml-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    View Popular Movies
                                </button>
                            )}
                        </div>
                    )}

                    {!loading && hasMore && movies.length > 0 && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={loadMore}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex justify-center items-center min-h-[60vh]">
                    <p>Redirecting to login...</p>
                </div>
            )}
        </div>
    );
}

// Main component with Suspense boundary
export default function Home() {
    return (
        <Suspense
            fallback={
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            }
        >
            <HomeContent />
        </Suspense>
    );
}
