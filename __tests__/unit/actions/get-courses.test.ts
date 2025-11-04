import { getCourses } from '@/actions/get-courses';
import { db } from '@/lib/db';

// Mock the database
jest.mock('@/lib/db');
const mockDb = db as jest.Mocked<typeof db>;

describe('getCourses', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCourses = [
    {
      id: 'course-1',
      title: 'React Basics',
      imageUrl: 'image1.jpg',
      price: 29.99,
      category: { name: 'Programming' },
      chapters: [{ id: 'chapter-1' }],
      purchases: [],
    },
    {
      id: 'course-2',
      title: 'Advanced JavaScript',
      imageUrl: 'image2.jpg',
      price: 49.99,
      category: { name: 'Programming' },
      chapters: [{ id: 'chapter-2' }, { id: 'chapter-3' }],
      purchases: [],
    },
  ];

  it('should return courses with progress when userId is provided', async () => {
    mockDb.course.findMany.mockResolvedValue(mockCourses);

    const result = await getCourses({
      userId: 'user-1',
      title: '',
      categoryId: '',
    });

    expect(mockDb.course.findMany).toHaveBeenCalledWith({
      where: {
        isPublished: true,
        title: {
          contains: '',
        },
        categoryId: '',
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          where: {
            userId: 'user-1',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  it('should filter by title when provided', async () => {
    mockDb.course.findMany.mockResolvedValue([mockCourses[0]]);

    await getCourses({
      userId: 'user-1',
      title: 'React',
      categoryId: '',
    });

    expect(mockDb.course.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          title: {
            contains: 'React',
          },
        }),
      })
    );
  });

  it('should filter by categoryId when provided', async () => {
    mockDb.course.findMany.mockResolvedValue([mockCourses[0]]);

    await getCourses({
      userId: 'user-1',
      title: '',
      categoryId: 'category-1',
    });

    expect(mockDb.course.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          categoryId: 'category-1',
        }),
      })
    );
  });

  it('should handle database errors gracefully', async () => {
    mockDb.course.findMany.mockRejectedValue(new Error('Database error'));

    const result = await getCourses({
      userId: 'user-1',
      title: '',
      categoryId: '',
    });

    expect(result).toEqual([]);
  });
});