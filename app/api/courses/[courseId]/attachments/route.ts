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
        const { url } = await req.json();

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

        const attachment = await db.attachment.create({
            data: {
                url,
                name: url.split('/').pop(),
                courseId: params.courseId,
            },
        });

        return NextResponse.json(attachment);
    } catch (error) {
        console.log('COURSE_ID_ATTACHMENTS', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
