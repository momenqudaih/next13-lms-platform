import { NextResponse } from 'next/server';

// Route segment config - force dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } },
) {
    try {
        // Dynamic imports to prevent build-time issues
        const { db } = await import('@/lib/db');
        const { auth } = await import('@clerk/nextjs');
        
        const { userId } = auth();
        const { title } = await req.json();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
        });

        if (!courseOwner) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId: params.courseId,
            },
            orderBy: {
                position: 'desc',
            },
        });

        const newPosition = lastChapter ? lastChapter.position + 1 : 0;

        const chapter = await db.chapter.create({
            data: {
                title,
                courseId: params.courseId,
                position: newPosition,
            },
        });

        return NextResponse.json(chapter);
    } catch (error) {
        console.log('[CHAPTERS', error);
        return new NextResponse('Internal server error');
    }
}
