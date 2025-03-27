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

// Component for the movies content that uses search params
function MoviesContent() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search');

    useEffect(() => {
        // Reset state when search query changes
        setMovies([]);
        setPage(1);
        setHasMore(true);
        setLoading(true);
        fetchMovies(1);
    }, [searchQuery]);

    const fetchMovies = async (pageNum: number) => {
        try {
            let response;
            if (searchQuery) {
                response = await movieAPI.getSearchResults(
                    searchQuery,
                    pageNum
                );
            } else {
                response = await movieAPI.getPopular(pageNum);
            }

            const { results, total_pages } = response.data;

            if (pageNum === 1) {
                setMovies(results);
            } else {
                setMovies((prev) => [...prev, ...results]);
            }

            setHasMore(pageNum < total_pages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching movies:', error);
            setLoading(false);
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
        <>
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
                    <p className="text-xl">No movies found</p>
                </div>
            )}

            {!loading && hasMore && (
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
    );
}

export default function Home() {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        // Redirect to login if not authenticated
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (status === 'authenticated') {
        return (
            <>
                <SearchBar />
                <Suspense
                    fallback={
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                            {Array.from({ length: 10 }).map((_, index) => (
                                <MovieCardSkeleton
                                    key={`suspense-skeleton-${index}`}
                                />
                            ))}
                        </div>
                    }
                >
                    <MoviesContent />
                </Suspense>
            </>
        );
    }

    return null;
}
