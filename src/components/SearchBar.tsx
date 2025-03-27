'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import { debounce } from 'lodash';

export default function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    // Debounce the search to avoid too many URL changes
    const debouncedSearch = useCallback(
        debounce((query: string) => {
            if (query.trim()) {
                router.push(`/?search=${encodeURIComponent(query.trim())}`);
            } else {
                router.push('/');
            }
        }, 500),
        [router]
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    };

    return (
        <div className="relative max-w-3xl mx-auto mb-8">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search for movies..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
        </div>
    );
}
