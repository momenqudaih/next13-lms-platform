import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function setupTestDb() {
  // Clean up existing test data
  await prisma.userProgress.deleteMany()
  await prisma.purchase.deleteMany()
  await prisma.muxData.deleteMany()
  await prisma.chapter.deleteMany()
  await prisma.attachment.deleteMany()
  await prisma.course.deleteMany()
  await prisma.category.deleteMany()
  await prisma.stripeCustomer.deleteMany()
  await prisma.userAnalytics.deleteMany()
  await prisma.courseAnalytics.deleteMany()
  await prisma.analyticsSession.deleteMany()

  // Create test categories
  const programmingCategory = await prisma.category.create({
    data: {
      name: 'Programming',
    },
  })

  const designCategory = await prisma.category.create({
    data: {
      name: 'Design',
    },
  })

  // Create test courses
  const course1 = await prisma.course.create({
    data: {
      userId: 'test-teacher-1',
      title: 'React Fundamentals',
      description: 'Learn React from scratch',
      imageUrl: '/react-course.jpg',
      price: 29.99,
      isPublished: true,
      categoryId: programmingCategory.id,
    },
  })

  const course2 = await prisma.course.create({
    data: {
      userId: 'test-teacher-1',
      title: 'Advanced JavaScript',
      description: 'Master advanced JavaScript concepts',
      imageUrl: '/js-course.jpg',
      price: 49.99,
      isPublished: true,
      categoryId: programmingCategory.id,
    },
  })

  // Create test chapters
  await prisma.chapter.create({
    data: {
      title: 'Introduction to React',
      description: 'Getting started with React',
      videoUrl: '/intro-react.mp4',
      position: 0,
      isPublished: true,
      isFree: true,
      courseId: course1.id,
    },
  })

  await prisma.chapter.create({
    data: {
      title: 'Components and Props',
      description: 'Understanding React components',
      videoUrl: '/components-props.mp4',
      position: 1,
      isPublished: true,
      isFree: false,
      courseId: course1.id,
    },
  })

  await prisma.chapter.create({
    data: {
      title: 'State and Lifecycle',
      description: 'Managing component state',
      videoUrl: '/state-lifecycle.mp4',
      position: 2,
      isPublished: true,
      isFree: false,
      courseId: course1.id,
    },
  })

  // Create test purchase
  await prisma.purchase.create({
    data: {
      userId: 'test-student-1',
      courseId: course1.id,
    },
  })

  return {
    categories: [programmingCategory, designCategory],
    courses: [course1, course2],
  }
}

export async function cleanupTestDb() {
  await prisma.userProgress.deleteMany()
  await prisma.purchase.deleteMany()
  await prisma.muxData.deleteMany()
  await prisma.chapter.deleteMany()
  await prisma.attachment.deleteMany()
  await prisma.course.deleteMany()
  await prisma.category.deleteMany()
  await prisma.stripeCustomer.deleteMany()
  await prisma.userAnalytics.deleteMany()
  await prisma.courseAnalytics.deleteMany()
  await prisma.analyticsSession.deleteMany()
}

export { prisma }



