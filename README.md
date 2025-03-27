# Movie List Application

A web application for browsing and managing movie lists built with Next.js, Redux, and NextAuth.js.

## Features

### Authentication
- User registration and login functionality
- Secure session management using JWT tokens stored in HTTP-only cookies
- Protected routes that require authentication
- User session persistence across page refreshes

### Movie Management
- Browse popular movies from TMDB API
- View detailed information about specific movies
- Search for movies by title
- Add movies to favorites
- Create custom movie lists

### User Interface
- Responsive design that works on mobile and desktop
- Toast notifications for user feedback
- Loading states for asynchronous operations

## Technologies Used

- **Next.js**: React framework for server-side rendering and API routes
- **NextAuth.js**: Authentication library for Next.js applications
- **Redux Toolkit**: State management library
- **React Toastify**: Toast notification component
- **Axios**: HTTP client for API requests
- **TMDB API**: External API for movie data
- **TypeScript**: Type-safe JavaScript superset

## Implementation Details

### Authentication Flow
Authentication is implemented using NextAuth.js with a Credentials provider. JWT tokens are stored in HTTP-only cookies for secure session management.

```ts
// Authentication configuration
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      // Credentials configuration
    }),
  ],
  callbacks: {
    // Token and session callbacks
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Other configuration options
};
```

### State Management
Redux Toolkit is used for global state management, particularly for authentication state and user data.

```ts
// Auth slice example
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    // Other reducers
  },
});
```

### API Integration
The application uses the TMDB API for fetching movie data. API keys are stored in environment variables for security.
