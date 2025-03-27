'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { toggleTheme } from '@/redux/features/themeSlice';
import { FaMoon, FaSun, FaUser, FaSignOutAlt, FaHeart } from 'react-icons/fa';
import { signOut } from 'next-auth/react';
import { logout } from '@/redux/features/authSlice';

export default function Navbar() {
    const { darkMode } = useAppSelector((state) => state.theme);
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const pathname = usePathname();

    const handleLogout = async () => {
        await signOut({ redirect: false });
        dispatch(logout());
    };

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link
                            href="/"
                            className="flex-shrink-0 flex items-center"
                        >
                            <span className="text-xl font-bold">
                                MovieExplorer
                            </span>
                        </Link>
                        {isAuthenticated && (
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    href="/"
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                        isActive('/')
                                            ? 'border-indigo-500 dark:border-indigo-400 text-gray-900 dark:text-white'
                                            : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                                >
                                    Movies
                                </Link>
                                <Link
                                    href="/favorites"
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                        isActive('/favorites')
                                            ? 'border-indigo-500 dark:border-indigo-400 text-gray-900 dark:text-white'
                                            : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                                >
                                    Favorites
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => dispatch(toggleTheme())}
                            className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? <FaSun /> : <FaMoon />}
                        </button>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/favorites"
                                    className="sm:hidden p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    aria-label="Favorites"
                                >
                                    <FaHeart />
                                </Link>
                                <span className="hidden md:block text-sm">
                                    {user?.name || user?.email}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    aria-label="Logout"
                                >
                                    <FaSignOutAlt />
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                aria-label="Login"
                            >
                                <FaUser />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
