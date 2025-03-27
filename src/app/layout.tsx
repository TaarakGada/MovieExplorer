import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/providers/Providers';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
    title: 'Movie Explorer',
    description: 'Explore and discover movies',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`antialiased`}>
                <Providers>
                    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
                        <Navbar />
                        <main className="flex-grow container mx-auto px-4 py-8">
                            {children}
                        </main>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
