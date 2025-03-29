import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import fs from 'fs';
import path from 'path';

// Mock user database with initial test user
const initialUsers = [
    {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
    },
];

// Server-side user storage
const getUsersFromFile = () => {
    try {
        // In production, you would use a real database instead
        const dataDir = path.join(process.cwd(), 'data');
        const userFilePath = path.join(dataDir, 'users.json');

        // Create directory if it doesn't exist
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Create file with initial users if it doesn't exist
        if (!fs.existsSync(userFilePath)) {
            fs.writeFileSync(userFilePath, JSON.stringify(initialUsers));
            return initialUsers;
        }

        // Read and parse users
        const fileContent = fs.readFileSync(userFilePath, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading users file:', error);
        return initialUsers;
    }
};

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // Get users from server-side storage
                const users = getUsersFromFile();

                // Find user in database
                const user = users.find((user) => user.email === credentials.email);

                // Validate password and return user info
                if (user && user.password === credentials.password) {
                    // Only return data needed for authentication, not password
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    };
                }

                return null;
            },
        }),
    ],
    pages: {
        signIn: '/login',
        signOut: '/',
        error: '/login',
    },
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                // Explicitly copy the user ID to the token
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        session: async ({ session, token }) => {
            // Make sure the user object has the id property
            if (token && session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    cookies: {
        sessionToken: {
            name: `__Secure-next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true,  // Make sure this is true in production
            },
        },
    },
    debug: process.env.NODE_ENV === 'development',
};
