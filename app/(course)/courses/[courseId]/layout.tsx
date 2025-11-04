import { redirect } from 'next/navigation';
import { CourseSideBar } from './_components/course-sidebar';
import { CourseNavbar } from './_components/course-navbar';

// Force dynamic rendering for this layout
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const CourseLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { courseId: string };
}) => {
    // Dynamic imports to prevent build-time issues
    const { auth } = await import('@clerk/nextjs');
    const { getProgress } = await import('@/actions/get-progress');
    const { db } = await import('@/lib/db');
    
    const { userId } = auth();

    if (!userId) {
        return redirect('/');
    }

    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
        },
        include: {
            chapters: {
                where: {
                    isPublished: true,
                },
                include: {
                    userProgress: {
                        where: {
                            userId,
                        },
                    },
                },
                orderBy: {
                    position: 'asc',
                },
            },
        },
    });

    if (!course) {
        return redirect('/');
    }

    const progressCount = await getProgress(userId, course.id);

    return (
        <div className="h-full">
            <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
                <CourseNavbar course={course} progressCount={progressCount} />
            </div>
            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <CourseSideBar course={course} progressCount={progressCount} />
            </div>
            <main className="md:pl-80 h-full pt-[80px]">{children}</main>
        </div>
    );
};

export default CourseLayout;
