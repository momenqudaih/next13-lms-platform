import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'

// Mock providers for testing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <div data-testid="test-wrapper">
      {children}
    </div>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Test data factories
export const createMockCourse = (overrides = {}) => ({
  id: 'course-123',
  title: 'Test Course',
  description: 'Test course description',
  imageUrl: '/test-image.jpg',
  price: 29.99,
  isPublished: true,
  categoryId: 'category-123',
  userId: 'user-123',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

export const createMockChapter = (overrides = {}) => ({
  id: 'chapter-123',
  title: 'Test Chapter',
  description: 'Test chapter description',
  videoUrl: '/test-video.mp4',
  position: 0,
  isPublished: true,
  isFree: false,
  courseId: 'course-123',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

export const createMockUser = (overrides = {}) => ({
  id: 'user-123',
  firstName: 'Test',
  lastName: 'User',
  emailAddresses: [{ emailAddress: 'test@example.com' }],
  ...overrides,
})

export const createMockPurchase = (overrides = {}) => ({
  id: 'purchase-123',
  userId: 'user-123',
  courseId: 'course-123',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

export const createMockProgress = (overrides = {}) => ({
  id: 'progress-123',
  userId: 'user-123',
  chapterId: 'chapter-123',
  isCompleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

// API response helpers
export const mockApiResponse = (data: any, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => data,
  text: async () => JSON.stringify(data),
})

// Database mock helpers
export const mockDbOperations = {
  course: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  chapter: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  purchase: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  userProgress: {
    upsert: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
}

// Reset all mocks
export const resetAllMocks = () => {
  Object.values(mockDbOperations).forEach(model => {
    Object.values(model).forEach(method => {
      if (jest.isMockFunction(method)) {
        method.mockReset()
      }
    })
  })
}



