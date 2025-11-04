import { getProgress } from '@/actions/get-progress'
import { db } from '@/lib/db'

// Mock the database
jest.mock('@/lib/db')
const mockDb = db as jest.Mocked<typeof db>

describe('getProgress', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 0 when no chapters exist', async () => {
    mockDb.chapter.findMany.mockResolvedValue([])
    
    const result = await getProgress('user-1', 'course-1')
    
    expect(result).toBe(0)
    expect(mockDb.chapter.findMany).toHaveBeenCalledWith({
      where: {
        courseId: 'course-1',
        isPublished: true,
      },
      select: {
        id: true,
      },
    })
  })

  it('should calculate progress correctly', async () => {
    const mockChapters = [
      { id: 'chapter-1' },
      { id: 'chapter-2' },
      { id: 'chapter-3' },
      { id: 'chapter-4' },
    ]
    
    const mockCompletedChapters = [
      { chapterId: 'chapter-1' },
      { chapterId: 'chapter-2' },
    ]

    mockDb.chapter.findMany.mockResolvedValue(mockChapters)
    mockDb.userProgress.findMany.mockResolvedValue(mockCompletedChapters)
    
    const result = await getProgress('user-1', 'course-1')
    
    expect(result).toBe(50) // 2/4 * 100 = 50%
    expect(mockDb.userProgress.findMany).toHaveBeenCalledWith({
      where: {
        userId: 'user-1',
        chapterId: {
          in: ['chapter-1', 'chapter-2', 'chapter-3', 'chapter-4'],
        },
        isCompleted: true,
      },
    })
  })

  it('should return 100 when all chapters are completed', async () => {
    const mockChapters = [
      { id: 'chapter-1' },
      { id: 'chapter-2' },
    ]
    
    const mockCompletedChapters = [
      { chapterId: 'chapter-1' },
      { chapterId: 'chapter-2' },
    ]

    mockDb.chapter.findMany.mockResolvedValue(mockChapters)
    mockDb.userProgress.findMany.mockResolvedValue(mockCompletedChapters)
    
    const result = await getProgress('user-1', 'course-1')
    
    expect(result).toBe(100)
  })

  it('should handle database errors gracefully', async () => {
    mockDb.chapter.findMany.mockRejectedValue(new Error('Database error'))
    
    const result = await getProgress('user-1', 'course-1')
    
    expect(result).toBe(0)
  })
}



