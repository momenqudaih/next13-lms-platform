import { NextResponse } from 'next/server';

// Route segment config - force dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string; attachmentId: string } },
) {
    try {
        // Dynamic imports to prevent build-time issues
        const { db } = await import('@/lib/db');
        const { auth } = await import('@clerk/nextjs');
        
        const { userId } = auth();

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

        // First verify the attachment exists and belongs to this course
        const attachment = await db.attachment.findUnique({
            where: {
                id: params.attachmentId,
            },
        });

        if (!attachment || attachment.courseId !== params.courseId) {
            return new NextResponse('Attachment not found', { status: 404 });
        }

        const deletedAttachment = await db.attachment.delete({
            where: {
                id: params.attachmentId,
            },
        });

        return NextResponse.json(deletedAttachment);
    } catch (error) {
        console.log('ATTACHMENTS_ID', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
