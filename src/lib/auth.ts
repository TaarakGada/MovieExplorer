import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Mock user database with initial test user
const initialUsers = [
    {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
    },
];

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

                // Get users from localStorage if available (client-side)
                let users = [...initialUsers];
                if (typeof window !== 'undefined') {
                    try {
                        const storedUsers = localStorage.getItem('registeredUsers');
                        if (storedUsers) {
                            const parsedUsers = JSON.parse(storedUsers);
                            users = [...initialUsers, ...parsedUsers];
                        }
                    } catch (error) {
                        console.error('Error parsing stored users:', error);
                    }
                }

                // Find user in combined user database (mock + localStorage)
                const user = users.find((user) => user.email === credentials.email);

                // Validate password
                if (user && user.password === credentials.password) {
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
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        session: async ({ session, token }) => {
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
};
