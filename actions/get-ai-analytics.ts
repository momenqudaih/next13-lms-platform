import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { geminiAnalytics } from "@/lib/gemini";

/**
 * Get user analytics and generate AI insights
 */
export const getUserAnalytics = async (userId?: string) => {
  try {
    const { userId: currentUserId } = await auth();
    const targetUserId = userId || currentUserId;

    if (!targetUserId) {
      throw new Error("Unauthorized");
    }

    // Get user's learning data
    const purchases = await db.purchase.findMany({
      where: { userId: targetUserId },
      include: {
        course: {
          include: {
            category: true,
            chapters: {
              include: {
                userProgress: {
                  where: { userId: targetUserId }
                }
              }
            }
          }
        }
      }
    });

    const userProgress = await db.userProgress.findMany({
      where: { userId: targetUserId },
      include: {
        chapter: {
          include: {
            course: {
              include: { category: true }
            }
          }
        }
      }
    });

    // Separate completed and in-progress courses
    const completedCourses = purchases.filter(purchase => {
      const course = purchase.course;
      const totalChapters = course.chapters.length;
      const completedChapters = course.chapters.filter(chapter => 
        chapter.userProgress.some(progress => progress.isCompleted)
      ).length;
      return totalChapters > 0 && completedChapters === totalChapters;
    }).map(p => p.course);

    const coursesInProgress = purchases.filter(purchase => {
      const course = purchase.course;
      const totalChapters = course.chapters.length;
      const completedChapters = course.chapters.filter(chapter => 
        chapter.userProgress.some(progress => progress.isCompleted)
      ).length;
      return completedChapters > 0 && completedChapters < totalChapters;
    }).map(p => ({
      ...p.course,
      progress: Math.round((p.course.chapters.filter(chapter => 
        chapter.userProgress.some(progress => progress.isCompleted)
      ).length / p.course.chapters.length) * 100)
    }));

    // Check if we have recent analytics (within 24 hours)
    const existingAnalytics = await db.userAnalytics.findUnique({
      where: { userId: targetUserId }
    });

    const shouldRegenerate = !existingAnalytics || 
      (new Date().getTime() - existingAnalytics.lastAnalyzed.getTime()) > 24 * 60 * 60 * 1000 ||
      // Force regeneration if the stored data looks like raw JSON
      (typeof existingAnalytics.learningPatterns === 'string' && 
       existingAnalytics.learningPatterns.includes('"learningPatterns"'));

    if (shouldRegenerate) {
      // Generate new AI insights
      const startTime = Date.now();
      
      try {
        const aiInsights = await geminiAnalytics.analyzeLearningPatterns({
          userId: targetUserId,
          completedCourses,
          coursesInProgress,
          userProgress
        });

        const processingTime = Date.now() - startTime;

        // Save analytics session
        await db.analyticsSession.create({
          data: {
            userId: targetUserId,
            sessionType: "learning_patterns",
            inputData: {
              completedCoursesCount: completedCourses.length,
              coursesInProgressCount: coursesInProgress.length,
              totalProgressRecords: userProgress.length
            },
            outputData: aiInsights,
            processingTime,
            success: true
          }
        });

        // Update or create user analytics
        const analyticsData = {
          learningPatterns: aiInsights.learningPatterns,
          strengths: aiInsights.strengths,
          improvements: aiInsights.improvements,
          recommendations: aiInsights.recommendations,
          engagementLevel: aiInsights.engagementLevel,
          studyHabits: aiInsights.studyHabits,
          suggestions: aiInsights.suggestions,
          lastAnalyzed: new Date()
        };

        await db.userAnalytics.upsert({
          where: { userId: targetUserId },
          update: analyticsData,
          create: {
            userId: targetUserId,
            ...analyticsData
          }
        });

        return {
          analytics: analyticsData,
          coursesData: {
            completed: completedCourses,
            inProgress: coursesInProgress,
            totalProgress: userProgress.length
          }
        };

      } catch (error) {
        // Log failed session
        await db.analyticsSession.create({
          data: {
            userId: targetUserId,
            sessionType: "learning_patterns",
            inputData: {
              completedCoursesCount: completedCourses.length,
              coursesInProgressCount: coursesInProgress.length
            },
            outputData: {},
            processingTime: Date.now() - startTime,
            success: false,
            errorMessage: error instanceof Error ? error.message : "Unknown error"
          }
        });

        // Return existing analytics or basic data
        return {
          analytics: existingAnalytics || {
            learningPatterns: "Unable to generate insights at this time.",
            strengths: [],
            improvements: [],
            recommendations: [],
            engagementLevel: "medium",
            studyHabits: "Analysis pending.",
            suggestions: []
          },
          coursesData: {
            completed: completedCourses,
            inProgress: coursesInProgress,
            totalProgress: userProgress.length
          },
          error: "Failed to generate AI insights"
        };
      }
    }

    return {
      analytics: existingAnalytics,
      coursesData: {
        completed: completedCourses,
        inProgress: coursesInProgress,
        totalProgress: userProgress.length
      }
    };

  } catch (error) {
    throw new Error("Failed to get user analytics");
  }
};

/**
 * Get course analytics for teachers
 */
export const getCourseAnalytics = async (courseId: string) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Verify course ownership
    const course = await db.course.findUnique({
      where: { id: courseId, userId },
      include: {
        chapters: {
          include: {
            userProgress: true
          }
        },
        purchases: true,
        analytics: true
      }
    });

    if (!course) {
      throw new Error("Course not found");
    }

    // Calculate course metrics
    const totalStudents = course.purchases.length;
    const totalChapters = course.chapters.length;
    
    let completionRate = 0;
    let averageProgress = 0;

    if (totalStudents > 0 && totalChapters > 0) {
      const studentProgress = course.purchases.map(purchase => {
        const completedChapters = course.chapters.filter(chapter =>
          chapter.userProgress.some(progress => 
            progress.userId === purchase.userId && progress.isCompleted
          )
        ).length;
        return completedChapters / totalChapters;
      });

      completionRate = studentProgress.filter(progress => progress === 1).length / totalStudents * 100;
      averageProgress = studentProgress.reduce((sum, progress) => sum + progress, 0) / totalStudents * 100;
    }

    // Chapter analytics
    const chapterAnalytics = course.chapters.map(chapter => {
      const totalUsers = totalStudents;
      const completedUsers = chapter.userProgress.filter(p => p.isCompleted).length;
      const completionRate = totalUsers > 0 ? (completedUsers / totalUsers) * 100 : 0;

      return {
        chapterId: chapter.id,
        title: chapter.title,
        position: chapter.position,
        completionRate,
        totalUsers,
        completedUsers
      };
    });

    // Check if we need to regenerate analytics
    const shouldRegenerate = !course.analytics || 
      (new Date().getTime() - course.analytics.lastAnalyzed.getTime()) > 24 * 60 * 60 * 1000 ||
      // Force regeneration if the stored data looks like raw JSON
      (typeof course.analytics.overallAssessment === 'string' && 
       course.analytics.overallAssessment.includes('"overallAssessment"'));

    if (shouldRegenerate) {
      const startTime = Date.now();

      try {
        const aiInsights = await geminiAnalytics.analyzeCoursePerformance({
          courseId,
          courseTitle: course.title,
          totalStudents,
          completionRate,
          averageProgress,
          chapterAnalytics
        });

        const processingTime = Date.now() - startTime;

        // Log analytics session
        await db.analyticsSession.create({
          data: {
            userId,
            sessionType: "course_performance",
            inputData: {
              courseId,
              totalStudents,
              completionRate,
              averageProgress
            },
            outputData: aiInsights,
            processingTime,
            success: true
          }
        });

        // Update course analytics
        const analyticsData = {
          overallAssessment: aiInsights.overallAssessment,
          problematicAreas: aiInsights.problematicAreas,
          engagementInsights: aiInsights.engagementInsights,
          improvements: aiInsights.improvements,
          contentDifficulty: aiInsights.contentDifficulty,
          recommendedActions: aiInsights.recommendedActions,
          totalStudents,
          completionRate,
          averageProgress,
          chapterAnalytics,
          lastAnalyzed: new Date()
        };

        await db.courseAnalytics.upsert({
          where: { courseId },
          update: analyticsData,
          create: {
            courseId,
            ...analyticsData
          }
        });

        return {
          course: {
            id: course.id,
            title: course.title,
            totalStudents,
            completionRate,
            averageProgress
          },
          analytics: analyticsData,
          chapterAnalytics
        };

      } catch (error) {
        // Log failed session
        await db.analyticsSession.create({
          data: {
            userId,
            sessionType: "course_performance",
            inputData: { courseId, totalStudents },
            outputData: {},
            processingTime: Date.now() - startTime,
            success: false,
            errorMessage: error instanceof Error ? error.message : "Unknown error"
          }
        });

        // Return basic analytics
        return {
          course: {
            id: course.id,
            title: course.title,
            totalStudents,
            completionRate,
            averageProgress
          },
          analytics: course.analytics || {
            overallAssessment: "Analysis pending...",
            problematicAreas: [],
            engagementInsights: "Unable to generate insights at this time.",
            improvements: [],
            contentDifficulty: "medium",
            recommendedActions: [],
            totalStudents,
            completionRate,
            averageProgress,
            chapterAnalytics
          },
          chapterAnalytics,
          error: "Failed to generate AI insights"
        };
      }
    }

    return {
      course: {
        id: course.id,
        title: course.title,
        totalStudents,
        completionRate,
        averageProgress
      },
      analytics: course.analytics,
      chapterAnalytics
    };

  } catch (error) {
    throw new Error("Failed to get course analytics");
  }
};

/**
 * Generate predictive analytics for a student
 */
export const getPredictiveAnalytics = async (userId: string, courseId: string) => {
  try {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      throw new Error("Unauthorized");
    }

    // Get current progress and engagement data
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      include: {
        course: {
          include: {
            chapters: {
              include: {
                userProgress: {
                  where: { userId }
                }
              }
            }
          }
        }
      }
    });

    if (!purchase) {
      throw new Error("Student not enrolled in course");
    }

    const course = purchase.course;
    const totalChapters = course.chapters.length;
    const completedChapters = course.chapters.filter(chapter =>
      chapter.userProgress.some(progress => progress.isCompleted)
    ).length;

    const currentProgress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

    // Get user's completion history
    const completionHistory = await db.purchase.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            chapters: {
              include: {
                userProgress: {
                  where: { userId }
                }
              }
            }
          }
        }
      }
    });

    const completionStats = completionHistory.map(p => {
      const total = p.course.chapters.length;
      const completed = p.course.chapters.filter(c =>
        c.userProgress.some(up => up.isCompleted)
      ).length;
      return total > 0 ? completed / total : 0;
    });

    // Calculate engagement metrics
    const engagementMetrics = {
      coursesStarted: completionHistory.length,
      coursesCompleted: completionStats.filter(stat => stat === 1).length,
      averageCompletion: completionStats.reduce((sum, stat) => sum + stat, 0) / completionStats.length || 0,
      currentCourseProgress: currentProgress
    };

    const startTime = Date.now();

    try {
      const predictiveInsights = await geminiAnalytics.predictStudentSuccess({
        userId,
        currentProgress,
        timeSpentLearning: 0, // Could be calculated from video watch time if available
        completionHistory: completionStats,
        engagementMetrics
      });

      const processingTime = Date.now() - startTime;

      // Log analytics session
      await db.analyticsSession.create({
        data: {
          userId: currentUserId,
          sessionType: "predictive",
          inputData: {
            targetUserId: userId,
            courseId,
            currentProgress,
            engagementMetrics
          },
          outputData: predictiveInsights,
          processingTime,
          success: true
        }
      });

      // Update user analytics with predictive data
      await db.userAnalytics.upsert({
        where: { userId },
        update: {
          completionProbability: predictiveInsights.completionProbability,
          riskLevel: predictiveInsights.riskLevel,
          riskFactors: predictiveInsights.riskFactors,
          successIndicators: predictiveInsights.successIndicators,
          interventions: predictiveInsights.interventions,
          studySchedule: predictiveInsights.studySchedule,
          motivationStrategies: predictiveInsights.motivationStrategies,
          lastAnalyzed: new Date()
        },
        create: {
          userId,
          completionProbability: predictiveInsights.completionProbability,
          riskLevel: predictiveInsights.riskLevel,
          riskFactors: predictiveInsights.riskFactors,
          successIndicators: predictiveInsights.successIndicators,
          interventions: predictiveInsights.interventions,
          studySchedule: predictiveInsights.studySchedule,
          motivationStrategies: predictiveInsights.motivationStrategies,
          lastAnalyzed: new Date()
        }
      });

      return {
        currentProgress,
        engagementMetrics,
        predictions: predictiveInsights
      };

    } catch (error) {
      await db.analyticsSession.create({
        data: {
          userId: currentUserId,
          sessionType: "predictive",
          inputData: { userId, courseId },
          outputData: {},
          processingTime: Date.now() - startTime,
          success: false,
          errorMessage: error instanceof Error ? error.message : "Unknown error"
        }
      });

      throw new Error("Failed to generate predictive analytics");
    }

  } catch (error) {
    throw new Error("Failed to get predictive analytics");
  }
};
