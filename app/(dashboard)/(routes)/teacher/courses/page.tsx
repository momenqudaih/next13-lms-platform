import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { redirect } from 'next/navigation';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const CoursesPage = async () => {
    // Dynamic imports to prevent build-time issues
    const { auth } = await import('@clerk/nextjs');
    const { db } = await import('@/lib/db');
    
    const { userId } = await auth();

    if (!userId) {
        return redirect('/');
    }

    const courses = await db.course.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <div className="p-6">
            <DataTable columns={columns} data={courses} />
        </div>
    );
};

export default CoursesPage;
