'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@/redux/hooks';
import MovieCard from '@/components/MovieCard';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
    const { movies } = useAppSelector((state) => state.favorites);
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
            <div>
                <h1 className="text-2xl font-bold mb-6">My Favorite Movies</h1>

                {movies.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {movies.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-xl mb-4">
                            You haven't added any favorites yet
                        </p>
                        <a
                            href="/"
                            className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            Explore Movies
                        </a>
                    </div>
                )}
            </div>
        );
    }

    return null;
}
