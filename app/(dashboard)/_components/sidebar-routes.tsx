'use client';

import { Layout, Compass, List, BarChart } from 'lucide-react';
import { SidebarItem } from './SidebarItem';
import { usePathname } from 'next/navigation';

const guestRoutes = [
    {
        icon: Layout,
        label: 'Dashboard',
        href: '/',
    },
    {
        icon: Compass,
        label: 'Browse',
        href: '/search',
    },
];

const teacherRoutes = [
    {
        icon: List,
        label: 'Courses',
        href: '/teacher/courses',
    },
    {
        icon: BarChart,
        label: 'Analytics',
        href: '/teacher/analytics',
    },
];

const SidebarRoutes = () => {
    const pathname = usePathname();

    const isTeacherPage = pathname?.includes('/teacher');

    const routes = isTeacherPage ? teacherRoutes : guestRoutes;
    return (
        <div className="flex flex-col w-full">
            {routes.map((route, i) => (
                <SidebarItem key={route.href} {...route} />
            ))}
        </div>
    );
};

export default SidebarRoutes;
