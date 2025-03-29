'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            // Check if email already exists in the initial mock database
            if (email === 'test@example.com') {
                toast.error(
                    'Email already exists. Please use a different email.'
                );
                setIsLoading(false);
                return;
            }

            // Check if email already exists in localStorage
            let existingUsers = [];
            try {
                const storedUsers = localStorage.getItem('registeredUsers');
                if (storedUsers) {
                    existingUsers = JSON.parse(storedUsers);
                    if (
                        existingUsers.some((user: any) => user.email === email)
                    ) {
                        toast.error(
                            'Email already exists. Please use a different email.'
                        );
                        setIsLoading(false);
                        return;
                    }
                }
            } catch (error) {
                console.error('Error checking existing users:', error);
            }

            // Create a new user with a unique ID
            const newUser = {
                id: `user_${Date.now()}`,
                name,
                email,
                password,
            };

            // Save the new user to localStorage
            const updatedUsers = [...existingUsers, newUser];
            localStorage.setItem(
                'registeredUsers',
                JSON.stringify(updatedUsers)
            );

            // Simulate a delay to mimic API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast.success('Registration successful! Please log in.');
            router.push('/login');
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium"
                    >
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                        placeholder="Enter your name"
                        required
                    />
                </div>

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

                <div className="mb-4">
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

                <div className="mb-6">
                    <label
                        htmlFor="confirmPassword"
                        className="block mb-2 text-sm font-medium"
                    >
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                        placeholder="Confirm your password"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                >
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </form>

            <p className="mt-4 text-sm text-center">
                Already have an account?{' '}
                <Link
                    href="/login"
                    className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                    Sign In
                </Link>
            </p>
        </div>
    );
}
