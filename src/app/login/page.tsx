'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/redux/hooks';
import { loginStart, loginFailure } from '@/redux/features/authSlice';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        dispatch(loginStart());

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                dispatch(loginFailure(result.error));
                toast.error(result.error || 'Login failed');
            } else {
                toast.success('Login successful!');
                router.push('/');
            }
        } catch (error) {
            console.error('Login error:', error);
            dispatch(loginFailure('An unexpected error occurred'));
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                        placeholder="Enter your password"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <p className="mt-4 text-sm text-center">
                Don't have an account?{' '}
                <Link
                    href="/register"
                    className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                    Register
                </Link>
            </p>

            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>Demo credentials:</p>
                <p>Email: test@example.com</p>
                <p>Password: password123</p>
            </div>
        </div>
    );
}
