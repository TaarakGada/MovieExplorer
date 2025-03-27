'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { movieAPI, getImageUrl } from '@/services/api';
import { FaStar, FaCalendarAlt, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addFavorite, removeFavorite } from '@/redux/features/favoritesSlice';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface MovieDetails {
    id: string;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
    release_date: string;
    runtime: number;
    genres: { id: number; name: string }[];
}

interface Credit {
    id: number;
    name: string;
    character?: string;
    job?: string;
    profile_path: string | null;
}

export default function MovieDetailPage() {
    const { id } = useParams();
    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [similarMovies, setSimilarMovies] = useState<any[]>([]);
    const [cast, setCast] = useState<Credit[]>([]);
    const [crew, setCrew] = useState<Credit[]>([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useAppDispatch();
    const favorites = useAppSelector((state) => state.favorites.movies);
    const isFavorite = favorites.some((m) => m.id === id);
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        // Redirect to login if not authenticated
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                setLoading(true);

                // Fetch movie details
                const response = await movieAPI.getDetails(id as string);
                setMovie(response.data);

                // Fetch similar movies
                const similarResponse = await movieAPI.getSimilar(id as string);
                setSimilarMovies(similarResponse.data.results.slice(0, 5));

                // Fetch cast and crew
                const creditsResponse = await movieAPI.getCredits(id as string);
                setCast(creditsResponse.data.cast.slice(0, 10));

                // Get only director, writer, and producer
                const filteredCrew = creditsResponse.data.crew.filter(
                    (person: Credit) =>
                        ['Director', 'Writer', 'Producer'].includes(
                            person.job || ''
                        )
                );
                setCrew(filteredCrew.slice(0, 5));

                setLoading(false);
            } catch (error) {
                console.error('Error fetching movie details:', error);
                setLoading(false);
            }
        };

        if (id) {
            fetchMovieDetails();
        }
    }, [id]);

    const handleFavoriteToggle = () => {
        if (!movie) return;

        if (isFavorite) {
            dispatch(removeFavorite(id as string));
            toast.info('Removed from favorites');
        } else {
            dispatch(
                addFavorite({
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    vote_average: movie.vote_average,
                    release_date: movie.release_date,
                    overview: movie.overview,
                })
            );
            toast.success('Added to favorites');
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="text-center py-12">
                <p className="text-xl">Movie not found</p>
            </div>
        );
    }

    return (
        <div className="pb-12">
            {/* Backdrop */}
            <div className="relative w-full h-[300px] md:h-[400px] mb-8">
                <Image
                    src={getImageUrl(movie.backdrop_path, 'original')}
                    alt={movie.title}
                    fill
                    className="object-cover opacity-30"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
            </div>

            <div className="max-w-6xl mx-auto px-4 relative -mt-40">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Poster */}
                    <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
                        <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-lg">
                            <Image
                                src={getImageUrl(movie.poster_path)}
                                alt={movie.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Favorite button */}
                        <button
                            onClick={handleFavoriteToggle}
                            className="w-full mt-4 py-2 px-4 rounded-md flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                        >
                            {isFavorite ? (
                                <>
                                    <FaHeart /> Remove from Favorites
                                </>
                            ) : (
                                <>
                                    <FaRegHeart /> Add to Favorites
                                </>
                            )}
                        </button>
                    </div>

                    {/* Details */}
                    <div className="md:w-2/3 lg:w-3/4">
                        <h1 className="text-3xl font-bold mb-2">
                            {movie.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <div className="flex items-center">
                                <FaStar className="text-yellow-500 mr-1" />
                                <span>{movie.vote_average.toFixed(1)}</span>
                            </div>

                            <div className="flex items-center">
                                <FaCalendarAlt className="mr-1 text-gray-500" />
                                <span>
                                    {new Date(movie.release_date).getFullYear()}
                                </span>
                            </div>

                            <div>
                                {movie.runtime && (
                                    <span>
                                        {Math.floor(movie.runtime / 60)}h{' '}
                                        {movie.runtime % 60}m
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {movie.genres.map((genre) => (
                                <span
                                    key={genre.id}
                                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm"
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-3">Overview</h2>
                            <p className="text-gray-700 dark:text-gray-300">
                                {movie.overview}
                            </p>
                        </div>

                        {/* Cast */}
                        {cast.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-xl font-bold mb-3">Cast</h2>
                                <div className="flex overflow-x-auto space-x-4 pb-4">
                                    {cast.map((person) => (
                                        <div
                                            key={person.id}
                                            className="flex-shrink-0 w-24"
                                        >
                                            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2">
                                                <Image
                                                    src={
                                                        person.profile_path
                                                            ? getImageUrl(
                                                                  person.profile_path
                                                              )
                                                            : '/placeholder-avatar.png'
                                                    }
                                                    alt={person.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <p className="text-sm font-semibold text-center truncate">
                                                {person.name}
                                            </p>
                                            <p className="text-xs text-gray-500 text-center truncate">
                                                {person.character}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Crew */}
                        {crew.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-xl font-bold mb-3">Crew</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {crew.map((person) => (
                                        <div
                                            key={`${person.id}-${person.job}`}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                                <Image
                                                    src={
                                                        person.profile_path
                                                            ? getImageUrl(
                                                                  person.profile_path
                                                              )
                                                            : '/placeholder-avatar.png'
                                                    }
                                                    alt={person.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">
                                                    {person.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {person.job}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Similar Movies */}
                        {similarMovies.length > 0 && (
                            <div>
                                <h2 className="text-xl font-bold mb-3">
                                    Similar Movies
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {similarMovies.map((movie) => (
                                        <a
                                            key={movie.id}
                                            href={`/movie/${movie.id}`}
                                            className="block group"
                                        >
                                            <div className="relative aspect-[2/3] rounded overflow-hidden mb-2">
                                                <Image
                                                    src={getImageUrl(
                                                        movie.poster_path
                                                    )}
                                                    alt={movie.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <p className="text-sm font-semibold truncate">
                                                {movie.title}
                                            </p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
