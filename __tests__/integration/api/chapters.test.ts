import { createMocks } from 'node-mocks-http'
import { POST } from '@/app/api/courses/[courseId]/chapters/route'
import { PUT } from '@/app/api/courses/[courseId]/chapters/[chapterId]/progress/route'
import { db } from '@/lib/db'

// Mock dependencies
jest.mock('@/lib/db')
jest.mock('@clerk/nextjs', () => ({
  auth: jest.fn(),
}))

const mockDb = db as jest.Mocked<typeof db>
const mockAuth = require('@clerk/nextjs').auth as jest.MockedFunction<any>

describe('/api/courses/[courseId]/chapters', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST - Create Chapter', () => {
    it('should create a new chapter successfully', async () => {
      // Setup mocks
      mockAuth.mockReturnValue({ userId: 'user-123' })
      mockDb.course.findUnique.mockResolvedValue({
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
      mockDb.chapter.findFirst.mockResolvedValue({
        id: 'chapter-1',
        title: 'Existing Chapter',
        description: null,
        videoUrl: null,
        position: 0,
        isPublished: false,
        isFree: false,
        courseId: 'course-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      mockDb.chapter.create.mockResolvedValue({
        id: 'chapter-2',
        title: 'New Chapter',
        description: null,
        videoUrl: null,
        position: 1,
        isPublished: false,
        isFree: false,
        courseId: 'course-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Create request
      const { req } = createMocks({
        method: 'POST',
        body: JSON.stringify({ title: 'New Chapter' }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Execute
      const response = await POST(req as any, { params: { courseId: 'course-123' } })
      const data = await response.json()

      // Assertions
      expect(response.status).toBe(200)
      expect(data.title).toBe('New Chapter')
      expect(data.position).toBe(1)
      expect(mockDb.chapter.create).toHaveBeenCalledWith({
        data: {
          title: 'New Chapter',
          courseId: 'course-123',
          position: 1,
        },
      })
    })

    it('should return 401 when user is not course owner', async () => {
      // Setup mocks
      mockAuth.mockReturnValue({ userId: 'user-456' })
      mockDb.course.findUnique.mockResolvedValue(null)

      // Create request
      const { req } = createMocks({
        method: 'POST',
        body: JSON.stringify({ title: 'New Chapter' }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Execute
      const response = await POST(req as any, { params: { courseId: 'course-123' } })

      // Assertions
      expect(response.status).toBe(401)
      expect(mockDb.chapter.create).not.toHaveBeenCalled()
    })
  })
})

describe('/api/courses/[courseId]/chapters/[chapterId]/progress', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('PUT - Update Progress', () => {
    it('should update chapter progress successfully', async () => {
      // Setup mocks
      mockAuth.mockReturnValue({ userId: 'user-123' })
      mockDb.userProgress.upsert.mockResolvedValue({
        id: 'progress-123',
        userId: 'user-123',
        chapterId: 'chapter-123',
        isCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Create request
      const { req } = createMocks({
        method: 'PUT',
        body: JSON.stringify({ isCompleted: true }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Execute
      const response = await PUT(req as any, {
        params: { courseId: 'course-123', chapterId: 'chapter-123' }
      })

      // Assertions
      expect(response.status).toBe(200)
      expect(mockDb.userProgress.upsert).toHaveBeenCalledWith({
        where: {
          userId_chapterId: {
            userId: 'user-123',
            chapterId: 'chapter-123',
          },
        },
        update: {
          isCompleted: true,
        },
        create: {
          userId: 'user-123',
          chapterId: 'chapter-123',
          isCompleted: true,
        },
      })
    })

    it('should return 401 when user is not authenticated', async () => {
      // Setup mocks
      mockAuth.mockReturnValue({ userId: null })

      // Create request
      const { req } = createMocks({
        method: 'PUT',
        body: JSON.stringify({ isCompleted: true }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Execute
      const response = await PUT(req as any, {
        params: { courseId: 'course-123', chapterId: 'chapter-123' }
      })

      // Assertions
      expect(response.status).toBe(401)
      expect(mockDb.userProgress.upsert).not.toHaveBeenCalled()
    })
  })
}



