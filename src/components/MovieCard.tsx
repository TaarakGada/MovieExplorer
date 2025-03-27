'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
    addFavorite,
    removeFavorite,
    Movie,
} from '@/redux/features/favoritesSlice';
import { toast } from 'react-toastify';
import { useState } from 'react';

interface MovieCardProps {
    movie: {
        id: string | number;
        title: string;
        poster_path: string | null;
        vote_average: number;
        release_date?: string;
    };
}

export default function MovieCard({ movie }: MovieCardProps) {
    const [imgError, setImgError] = useState(false);
    const dispatch = useAppDispatch();
    const favorites = useAppSelector((state) => state.favorites.movies);
    const isFavorite = favorites.some((fav) => fav.id === movie.id.toString());

    const handleFavoriteToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (isFavorite) {
            dispatch(removeFavorite(movie.id.toString()));
        } else {
            // Convert the movie prop to match the Movie type expected by Redux
            const favoriteMovie: Movie = {
                id: movie.id.toString(),
                title: movie.title,
                poster_path: movie.poster_path || '',
                release_date: movie.release_date || '',
                vote_average: movie.vote_average,
            };
            dispatch(addFavorite(favoriteMovie));
            toast.success('Added to favorites');
        }
    };

    // Use placeholder image when poster_path is null or when image loading fails
    const placeholderImage = '/placeholder.jpg';
    const imageSrc =
        movie.poster_path && !imgError
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : placeholderImage;

    return (
        <Link
            href={`/movie/${movie.id}`}
            className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800"
        >
            <div className="relative aspect-[2/3] w-full">
                <Image
                    src={imageSrc}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                    priority={false}
                    onError={() => setImgError(true)}
                />
                <button
                    onClick={handleFavoriteToggle}
                    className="absolute top-2 right-2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
                    aria-label={
                        isFavorite
                            ? 'Remove from favorites'
                            : 'Add to favorites'
                    }
                >
                    {isFavorite ? (
                        <FaHeart className="text-red-500" />
                    ) : (
                        <FaRegHeart />
                    )}
                </button>
            </div>
            <div className="p-4">
                <h3 className="font-bold truncate">{movie.title}</h3>
                <div className="flex items-center mt-2">
                    <FaStar className="text-yellow-500 mr-1" />
                    <span>{movie.vote_average.toFixed(1)}</span>
                </div>
                {movie.release_date && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(movie.release_date).getFullYear()}
                    </span>
                )}
            </div>
        </Link>
    );
}
