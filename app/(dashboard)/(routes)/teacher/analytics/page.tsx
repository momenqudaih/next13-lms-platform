import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, BookOpen } from 'lucide-react';

import { getAnalytics } from '@/actions/get-analytics';
import { getCourseAnalytics } from '@/actions/get-ai-analytics';
import { db } from '@/lib/db';
import { DataCard, AIInsightCard, CourseAnalyticsCard } from './_components/ai-cards';
import { Chart } from './_components/chart';

const AnalyticsPage = async () => {
    const { userId } = await auth();
    if (!userId) {
        return redirect('/');
    }

    // Get traditional analytics
    const {
        data,
        totalRevenue,
        totalSales,
    } = await getAnalytics(userId);

    // Get teacher's courses for AI analytics
    const courses = await db.course.findMany({
        where: {
            userId,
            isPublished: true, // Only analyze published courses
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 6, // Limit to 6 courses for performance
    });

    // Get AI analytics for each course (with error handling)
    const courseAnalytics = await Promise.allSettled(
        courses.map(async (course) => {
            try {
                const analytics = await getCourseAnalytics(course.id);
                return {
                    courseId: course.id,
                    courseTitle: course.title,
                    ...analytics
                };
            } catch (error) {
                console.error(`Failed to get analytics for course ${course.id}:`, error);
                return {
                    courseId: course.id,
                    courseTitle: course.title,
                    error: true
                };
            }
        })
    );

    // Process successful analytics
    const successfulAnalytics = courseAnalytics
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map(result => result.value)
        .filter(analytics => !analytics.error);

    // Generate overall insights
    const totalStudentsAcrossAllCourses = successfulAnalytics.reduce(
        (sum, analytics) => sum + (analytics.analytics?.totalStudents || 0), 0
    );
    
    const averageCompletionRate = successfulAnalytics.length > 0 
        ? successfulAnalytics.reduce(
            (sum, analytics) => sum + (analytics.analytics?.completionRate || 0), 0
        ) / successfulAnalytics.length
        : 0;

    const problematicCourses = successfulAnalytics.filter(
        analytics => (analytics.analytics?.completionRate || 0) < 50
    );

    const highPerformingCourses = successfulAnalytics.filter(
        analytics => (analytics.analytics?.completionRate || 0) >= 80
    );

    return (
        <div className='p-6 space-y-6'>
            {/* Traditional Metrics */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                <DataCard
                    label="Total Revenue"
                    value={totalRevenue}
                    shouldFormat
                />
                <DataCard
                    label="Total Sales"
                    value={totalSales}
                    shouldFormat={false}
                />
                <DataCard
                    label="Total Students"
                    value={totalStudentsAcrossAllCourses}
                    shouldFormat={false}
                />
                <DataCard
                    label="Avg Completion"
                    value={Math.round(averageCompletionRate)}
                    shouldFormat={false}
                />
            </div>

            {/* Revenue Chart */}
            <Chart data={data} />

            {/* AI Insights Section */}
            {successfulAnalytics.length > 0 && (
                <>
                    <div className="border-t pt-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <Brain className="h-5 w-5 text-purple-600" />
                            <h2 className="text-xl font-semibold">AI-Powered Insights</h2>
                        </div>

                        {/* Overall Insights */}
                        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-3">
                            {averageCompletionRate >= 70 && (
                                <AIInsightCard
                                    title="Strong Performance"
                                    insight={`Your courses have an excellent average completion rate of ${Math.round(averageCompletionRate)}%. Students are highly engaged with your content.`}
                                    type="positive"
                                    icon={<CheckCircle className="h-4 w-4" />}
                                />
                            )}

                            {problematicCourses.length > 0 && (
                                <AIInsightCard
                                    title="Courses Need Attention"
                                    insight={`${problematicCourses.length} course(s) have completion rates below 50%. Consider reviewing content difficulty and engagement strategies.`}
                                    type="warning"
                                    icon={<AlertTriangle className="h-4 w-4" />}
                                />
                            )}

                            {highPerformingCourses.length > 0 && (
                                <AIInsightCard
                                    title="Top Performing Courses"
                                    insight={`${highPerformingCourses.length} course(s) have completion rates above 80%. These courses can serve as templates for future content.`}
                                    type="positive"
                                    icon={<TrendingUp className="h-4 w-4" />}
                                />
                            )}

                            {totalStudentsAcrossAllCourses > 100 && (
                                <AIInsightCard
                                    title="Growing Audience"
                                    insight={`You've reached ${totalStudentsAcrossAllCourses} students across all courses. Consider creating advanced courses for your engaged learners.`}
                                    type="positive"
                                    icon={<BookOpen className="h-4 w-4" />}
                                />
                            )}
                        </div>
                    </div>

                    {/* Individual Course Analytics */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4">Course Performance Analysis</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {successfulAnalytics.map((courseAnalytics) => (
                                <CourseAnalyticsCard
                                    key={courseAnalytics.courseId}
                                    courseTitle={courseAnalytics.courseTitle}
                                    analytics={{
                                        totalStudents: courseAnalytics.analytics?.totalStudents || 0,
                                        completionRate: courseAnalytics.analytics?.completionRate || 0,
                                        averageProgress: courseAnalytics.analytics?.averageProgress || 0,
                                        overallAssessment: courseAnalytics.analytics?.overallAssessment,
                                        contentDifficulty: courseAnalytics.analytics?.contentDifficulty,
                                        engagementInsights: courseAnalytics.analytics?.engagementInsights,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Loading state for courses without analytics */}
            {courses.length > 0 && successfulAnalytics.length === 0 && (
                <div className="border-t pt-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <Brain className="h-5 w-5 text-purple-600 animate-pulse" />
                        <h2 className="text-xl font-semibold">Generating AI Insights...</h2>
                    </div>
                    <p className="text-muted-foreground">
                        AI is analyzing your course data to provide personalized insights. This may take a few moments.
                    </p>
                </div>
            )}

            {/* No courses message */}
            {courses.length === 0 && (
                <div className="border-t pt-6">
                    <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Published Courses</h3>
                        <p className="text-muted-foreground">
                            Publish your first course to start seeing AI-powered insights about student engagement and performance.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnalyticsPage;