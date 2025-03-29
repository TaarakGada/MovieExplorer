import { NextRequest, NextResponse } from 'next/server';

// In-memory user storage (this will reset when the serverless function cold starts)
let users = [
    {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
    },
];

// GET endpoint to check if user exists (for login)
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const userExists = users.some(user => user.email === email);
    return NextResponse.json({ exists: userExists });
}

// POST endpoint to register a new user
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        // Check if user already exists
        if (users.some(user => user.email === email)) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Create new user
        const newUser = {
            id: `user_${Date.now()}`,
            name,
            email,
            password,
        };

        // Save user to in-memory array
        users.push(newUser);

        return NextResponse.json(
            { success: true, message: 'User registered successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Server error during registration' },
            { status: 500 }
        );
    }
}
