import { redirect } from 'next/navigation';

import { SearchInput } from '@/components/search-input';

import { Categories } from './_components/categories';
import { CoursesList } from './_components/courses-list';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface SearchParamsProps {
    searchParams: {
        title: string;
        categoryId: string;
    };
}

const page = async ({ searchParams }: SearchParamsProps) => {
    // Dynamic imports to prevent build-time issues
    const { auth } = await import('@clerk/nextjs');
    const { db } = await import('@/lib/db');
    const { getCourses } = await import('@/actions/get-courses');
    
    const { userId } = auth();

    if (!userId) {
        return redirect('/');
    }

    const categories = await db.category.findMany({
        orderBy: {
            name: 'asc',
        },
    });

    const courses = await getCourses({
        userId,
        ...searchParams,
    });

    return (
        <>
            <div className="px-6 pt-6 md:hidden md:mb-0 block">
                <SearchInput />
            </div>
            <div className="p-6 space-y-4">
                <Categories items={categories} />
                <CoursesList items={courses} />
            </div>
        </>
    );
};

export default page;
