import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CheckCircle, Clock, InfoIcon } from "lucide-react";

import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { getUserAnalytics } from "@/actions/get-ai-analytics";
import { CoursesList } from "@/components/courses-list";
import { StudentInsights } from "@/components/student-insights";

import { InfoCard } from "./_components/info-card";
import { BannerCard } from "./_components/banner-card";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    completedCourses,
    coursesInProgress
  } = await getDashboardCourses(userId);

  // Get AI analytics for the student
  let userAnalytics = null;
  let analyticsError = null;

  try {
    const analyticsData = await getUserAnalytics(userId);
    userAnalytics = analyticsData;
  } catch (error) {
    console.error("Failed to get user analytics:", error);
    analyticsError = error instanceof Error ? error.message : "Failed to load insights";
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="grid grid-cols-1 gap-4">
        <BannerCard
          icon={InfoIcon}
          label="Welcome to the dashboard"
          description={`This is where you can see your progress 
            and continue your courses. This is a demonstration LMS and as such, all courses are free and Stripe is in test
             mode. To enroll in a course, enter dummy data in the Stripe form. Contact me from
             folio.kendev.co to obtain admin access`}
        />
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>

      {/* AI Insights Section */}
      {userAnalytics && userAnalytics.analytics && (
        <div className="border-t pt-6">
          <StudentInsights 
            analytics={{
              learningPatterns: userAnalytics.analytics.learningPatterns || undefined,
              strengths: (userAnalytics.analytics.strengths as string[]) || [],
              improvements: (userAnalytics.analytics.improvements as string[]) || [],
              recommendations: (userAnalytics.analytics.recommendations as string[]) || [],
              engagementLevel: (userAnalytics.analytics.engagementLevel as "high" | "medium" | "low") || "medium",
              studyHabits: userAnalytics.analytics.studyHabits || undefined,
              suggestions: (userAnalytics.analytics.suggestions as string[]) || [],
              completionProbability: (userAnalytics.analytics as any).completionProbability || undefined,
              riskLevel: ((userAnalytics.analytics as any).riskLevel as "low" | "medium" | "high") || undefined,
              riskFactors: ((userAnalytics.analytics as any).riskFactors as string[]) || [],
              successIndicators: ((userAnalytics.analytics as any).successIndicators as string[]) || [],
              interventions: ((userAnalytics.analytics as any).interventions as string[]) || [],
              motivationStrategies: ((userAnalytics.analytics as any).motivationStrategies as string[]) || [],
            }}
            coursesData={userAnalytics.coursesData}
          />
        </div>
      )}

      {/* Loading state for AI insights */}
      {!userAnalytics && !analyticsError && (
        <div className="border-t pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="h-6 w-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <h2 className="text-xl font-semibold">Generating Your Learning Insights...</h2>
          </div>
          <p className="text-muted-foreground">
            AI is analyzing your learning data to provide personalized insights. This may take a few moments.
          </p>
        </div>
      )}

      {/* Error state */}
      {analyticsError && (
        <div className="border-t pt-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800 mb-1">
              Insights Temporarily Unavailable
            </h3>
            <p className="text-sm text-yellow-700">
              We&apos;re working on generating your personalized learning insights. Please check back later.
            </p>
          </div>
        </div>
      )}

      {/* Courses List */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
        <CoursesList
          items={[...coursesInProgress, ...completedCourses]}
        />
      </div>
    </div>
  )
}