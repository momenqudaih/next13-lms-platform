import { NextResponse } from 'next/server';

// Route segment config - force dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } },
) {
    try {
        // Dynamic imports to prevent build-time issues
        const { db } = await import('@/lib/db');
        const { auth } = await import('@clerk/nextjs');
        
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
        });

        if (!course) {
            return new NextResponse('Not found', { status: 404 });
        }

        const unpublishedCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId,
            },
            data: {
                isPublished: false,
            },
        });

        return NextResponse.json(unpublishedCourse);
    } catch (error) {
        console.log('[COURSE_ID_UNPUBLISH]', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
