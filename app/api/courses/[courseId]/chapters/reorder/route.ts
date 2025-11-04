import { NextResponse } from 'next/server';

// Route segment config - force dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function PUT(
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

        const { list } = await req.json();

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
        });

        if (!courseOwner) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        for (let item of list) {
            await db.chapter.update({
                where: { id: item.id },
                data: {
                    position: item.position,
                },
            });
        }

        return new NextResponse('Success', { status: 200 });
    } catch (error) {
        console.log('REORDER', error);
        return new NextResponse('Internal server error');
    }
}
