import { redirect } from 'next/navigation';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
    // Dynamic import to prevent build-time issues
    const { db } = await import('@/lib/db');
    
    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
        },
        include: {
            chapters: {
                where: {
                    isPublished: true,
                },
                orderBy: {
                    position: 'asc',
                },
            },
        },
    });

    if (!course) {
        redirect('/');
    }

    return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
};

export default CourseIdPage;
