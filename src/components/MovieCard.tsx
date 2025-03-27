'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/services/api';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
    addFavorite,
    removeFavorite,
    Movie,
} from '@/redux/features/favoritesSlice';
import { toast } from 'react-toastify';

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    const dispatch = useAppDispatch();
    const favorites = useAppSelector((state) => state.favorites.movies);
    const isFavorite = favorites.some((fav) => fav.id === movie.id);

    const handleFavoriteToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isFavorite) {
            dispatch(removeFavorite(movie.id));
            toast.info('Removed from favorites');
        } else {
            dispatch(addFavorite(movie));
            toast.success('Added to favorites');
        }
    };

    return (
        <Link
            href={`/movie/${movie.id}`}
            className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800"
        >
            <div className="relative aspect-[2/3] w-full">
                <Image
                    src={getImageUrl(movie.poster_path)}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                    priority={false}
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
            </div>
        </Link>
    );
}
