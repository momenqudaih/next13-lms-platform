import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Clerk authentication
jest.mock('@clerk/nextjs', () => ({
  auth: jest.fn(() => ({ userId: 'test-user-id' })),
  useAuth: jest.fn(() => ({ userId: 'test-user-id', isSignedIn: true })),
  useUser: jest.fn(() => ({ 
    user: { id: 'test-user-id', firstName: 'Test', lastName: 'User' },
    isLoaded: true 
  })),
  SignIn: jest.fn(({ children }) => children),
  SignUp: jest.fn(({ children }) => children),
  UserButton: jest.fn(() => <div data-testid="user-button">User Button</div>),
}))

// Prisma client will be mocked in individual test files as needed

// Mock environment variables
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'test-clerk-key'
process.env.CLERK_SECRET_KEY = 'test-clerk-secret'
process.env.DATABASE_URL = 'mysql://test:test@localhost:3306/test'
process.env.UPLOADTHING_SECRET = 'test-uploadthing-secret'
process.env.UPLOADTHING_APP_ID = 'test-uploadthing-app-id'
process.env.MUX_TOKEN_ID = 'test-mux-token'
process.env.MUX_TOKEN_SECRET = 'test-mux-secret'
process.env.STRIPE_API_KEY = 'test-stripe-key'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
process.env.STRIPE_WEBHOOK_SECRET = 'test-webhook-secret'
