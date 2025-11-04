import { NextResponse } from 'next/server';

// Route segment config - force dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string } },
) {
    try {
        // Dynamic imports to prevent build-time issues
        const { db } = await import('@/lib/db');
        const { auth } = await import('@clerk/nextjs');
        const Mux = (await import('@mux/mux-node')).default;
        
        const { video } = new Mux({
            tokenId: process.env.MUX_TOKEN_ID,
            tokenSecret: process.env.MUX_TOKEN_SECRET,
        });
        
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    },
                },
            },
        });

        if (!course) {
            return new NextResponse('Not Found', { status: 404 });
        }

        // cleanUp function.
        for (const chapter of course.chapters) {
            if (chapter.muxData?.assetId) {
                await video.assets.delete(chapter.muxData.assetId);
            }
        }

        const deletedCourse = await db.course.delete({
            where: {
                id: params.courseId,
            },
        });

        return NextResponse.json(deletedCourse);
    } catch (error) {
        console.log('[COURSE_ID_DELETE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } },
) {
    try {
        // Dynamic imports to prevent build-time issues
        const { db } = await import('@/lib/db');
        const { auth } = await import('@clerk/nextjs');
        
        const { userId } = auth();
        const { courseId } = params;
        const values = await req.json();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const course = await db.course.update({
            where: {
                id: courseId,
                userId,
            },
            data: {
                ...values,
            },
        });

        return NextResponse.json(course);
    } catch (error) {
        console.log('[COURSE_ID]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
