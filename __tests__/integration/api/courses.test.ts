import { createMocks } from 'node-mocks-http'
import { POST } from '@/app/api/courses/route'
import { db } from '@/lib/db'

// Mock dependencies
jest.mock('@/lib/db')
jest.mock('@clerk/nextjs', () => ({
  auth: jest.fn(),
}))

const mockDb = db as jest.Mocked<typeof db>
const mockAuth = require('@clerk/nextjs').auth as jest.MockedFunction<any>

describe('/api/courses', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST', () => {
    it('should create a new course successfully', async () => {
      // Setup mocks
      mockAuth.mockReturnValue({ userId: 'user-123' })
      mockDb.course.create.mockResolvedValue({
        id: 'course-123',
        userId: 'user-123',
        title: 'Test Course',
        description: null,
        imageUrl: null,
        price: null,
        isPublished: false,
        categoryId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Create request
      const { req } = createMocks({
        method: 'POST',
        body: JSON.stringify({ title: 'Test Course' }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Execute
      const response = await POST(req as any)
      const data = await response.json()

      // Assertions
      expect(response.status).toBe(200)
      expect(data.title).toBe('Test Course')
      expect(data.userId).toBe('user-123')
      expect(mockDb.course.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          title: 'Test Course',
        },
      })
    })

    it('should return 401 when user is not authenticated', async () => {
      // Setup mocks
      mockAuth.mockReturnValue({ userId: null })

      // Create request
      const { req } = createMocks({
        method: 'POST',
        body: JSON.stringify({ title: 'Test Course' }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Execute
      const response = await POST(req as any)

      // Assertions
      expect(response.status).toBe(401)
      expect(mockDb.course.create).not.toHaveBeenCalled()
    })

    it('should return 500 when database operation fails', async () => {
      // Setup mocks
      mockAuth.mockReturnValue({ userId: 'user-123' })
      mockDb.course.create.mockRejectedValue(new Error('Database error'))

      // Create request
      const { req } = createMocks({
        method: 'POST',
        body: JSON.stringify({ title: 'Test Course' }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Execute
      const response = await POST(req as any)

      // Assertions
      expect(response.status).toBe(500)
    })

    it('should handle missing title in request body', async () => {
      // Setup mocks
      mockAuth.mockReturnValue({ userId: 'user-123' })

      // Create request
      const { req } = createMocks({
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Execute
      const response = await POST(req as any)

      // Assertions
      expect(response.status).toBe(500) // Should handle validation error
    })
  })
}



