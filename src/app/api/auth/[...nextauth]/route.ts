import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Create the handler using the authOptions
const handler = NextAuth(authOptions);

// Export only the GET and POST handlers - not the authOptions
export const GET = handler;
export const POST = handler;
