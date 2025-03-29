import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Server-side user management
const dataDir = path.join(process.cwd(), 'data');
const userFilePath = path.join(dataDir, 'users.json');

// Initial users
const initialUsers = [
    {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
    },
];

// Get all users
const getUsers = () => {
    try {
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

// Save users to file
const saveUsers = (users) => {
    try {
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving users:', error);
        return false;
    }
};

// GET endpoint to check if user exists (for login)
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const users = getUsers();
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

        const users = getUsers();

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

        // Save user
        const updatedUsers = [...users, newUser];
        const saved = saveUsers(updatedUsers);

        if (!saved) {
            return NextResponse.json(
                { error: 'Error saving user' },
                { status: 500 }
            );
        }

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
