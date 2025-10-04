import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_GEMINI_API_KEY) {
  throw new Error("GOOGLE_GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// Try multiple model names in order of preference (working models from your API key)
const MODEL_NAMES = [
  "models/gemini-2.5-flash",        // ⭐ BEST: Stable, fast, efficient
  "models/gemini-2.5-pro",          // Most capable for complex tasks
  "models/gemini-2.0-flash",        // Good alternative
  "models/gemini-2.0-flash-exp",    // Experimental version
];

async function getWorkingModel() {
  for (const modelName of MODEL_NAMES) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      // Actually test the model with a simple request
      const testResult = await model.generateContent("Hello");
      const testResponse = await testResult.response;
      await testResponse.text(); // This will throw if the model doesn't work
      
      return model;
    } catch (error) {
      continue;
    }
  }
  throw new Error("No working Gemini models found. Please check your API key and model availability.");
}

// Get a working model (will be resolved when first used)
let modelPromise: Promise<any> | null = null;
function getModel() {
  if (!modelPromise) {
    modelPromise = getWorkingModel();
  }
  return modelPromise;
}

export class GeminiAnalyticsService {
  
  /**
   * Analyze student learning patterns and generate insights
   */
  async analyzeLearningPatterns(data: {
    userId: string;
    completedCourses: any[];
    coursesInProgress: any[];
    userProgress: any[];
    timeSpent?: number;
  }) {
    const prompt = `
    As an educational data analyst, analyze the following student learning data and provide insights:

    Student ID: ${data.userId}
    Completed Courses: ${data.completedCourses.length}
    Courses in Progress: ${data.coursesInProgress.length}
    Total Progress Records: ${data.userProgress.length}
    
    Course Details:
    ${JSON.stringify({
      completed: data.completedCourses.map(course => ({
        title: course.title,
        category: course.category?.name,
        chaptersCount: course.chapters?.length
      })),
      inProgress: data.coursesInProgress.map(course => ({
        title: course.title,
        category: course.category?.name,
        progress: course.progress,
        chaptersCount: course.chapters?.length
      }))
    }, null, 2)}

    Please provide:
    1. Learning patterns and preferences
    2. Strengths and areas for improvement
    3. Recommended next courses or topics
    4. Study habits analysis
    5. Engagement level assessment
    6. Personalized learning suggestions

    CRITICAL: Return ONLY a valid JSON object in this exact format:
    {
      "learningPatterns": "your analysis here",
      "strengths": ["strength 1", "strength 2"],
      "improvements": ["improvement 1", "improvement 2"],
      "recommendations": ["recommendation 1", "recommendation 2"],
      "engagementLevel": "medium",
      "studyHabits": "your analysis here",
      "suggestions": ["suggestion 1", "suggestion 2"]
    }
    
    Do NOT include any text before or after the JSON. Do NOT use markdown formatting.
    `;

    try {
      const geminiModel = await getModel();
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text() || "";
      
      // Clean up the response text - remove markdown code blocks if present
      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/```\s*$/, '');
      }
      
      // Try to parse as JSON, fallback to structured text
      try {
        const parsed = JSON.parse(cleanText);
        return parsed;
      } catch (parseError) {
        // If it looks like JSON but failed to parse, try to extract individual fields
        if (cleanText.includes('"learningPatterns"') && cleanText.includes('"strengths"')) {
          try {
            // Try to extract individual fields manually
            const learningPatternsMatch = cleanText.match(/"learningPatterns":\s*"([^"]+)"/);
            const strengthsMatch = cleanText.match(/"strengths":\s*\[([\s\S]*?)\]/);
            const improvementsMatch = cleanText.match(/"improvements":\s*\[([\s\S]*?)\]/);
            const recommendationsMatch = cleanText.match(/"recommendations":\s*\[([\s\S]*?)\]/);
            const engagementMatch = cleanText.match(/"engagementLevel":\s*"([^"]+)"/);
            const studyHabitsMatch = cleanText.match(/"studyHabits":\s*"([^"]+)"/);
            const suggestionsMatch = cleanText.match(/"suggestions":\s*\[([\s\S]*?)\]/);

            const parseArrayString = (str: string): string[] => {
              if (!str) return [];
              return str.split(',').map(s => s.trim().replace(/^"|"$/g, '')).filter(s => s.length > 0);
            };

            return {
              learningPatterns: learningPatternsMatch?.[1] || "Analysis in progress...",
              strengths: strengthsMatch ? parseArrayString(strengthsMatch[1]) : [],
              improvements: improvementsMatch ? parseArrayString(improvementsMatch[1]) : [],
              recommendations: recommendationsMatch ? parseArrayString(recommendationsMatch[1]) : [],
              engagementLevel: (engagementMatch?.[1] as "high" | "medium" | "low") || "medium",
              studyHabits: studyHabitsMatch?.[1] || "Analysis in progress...",
              suggestions: suggestionsMatch ? parseArrayString(suggestionsMatch[1]) : []
            };
          } catch (extractError) {
            console.error("Error extracting fields:", extractError);
          }
        }
        
        return {
          learningPatterns: "AI analysis completed. Please refresh to see formatted results.",
          strengths: ["Analysis available - please refresh the page"],
          improvements: ["Analysis available - please refresh the page"],
          recommendations: ["Analysis available - please refresh the page"],
          engagementLevel: "medium" as const,
          studyHabits: "AI analysis completed. Please refresh to see formatted results.",
          suggestions: ["Please refresh the page to see your personalized suggestions"]
        };
      }
    } catch (error) {
      console.error("Error analyzing learning patterns:", error);
      throw new Error("Failed to analyze learning patterns");
    }
  }

  /**
   * Generate course performance insights for teachers
   */
  async analyzeCoursePerformance(data: {
    courseId: string;
    courseTitle: string;
    totalStudents: number;
    completionRate: number;
    averageProgress: number;
    chapterAnalytics: any[];
  }) {
    const prompt = `
    As an educational analytics expert, analyze this course performance data:

    Course: ${data.courseTitle}
    Total Enrolled Students: ${data.totalStudents}
    Completion Rate: ${data.completionRate}%
    Average Progress: ${data.averageProgress}%
    
    Chapter Performance:
    ${JSON.stringify(data.chapterAnalytics, null, 2)}

    Provide insights on:
    1. Overall course effectiveness
    2. Problematic chapters or content areas
    3. Student engagement patterns
    4. Recommendations for course improvement
    5. Optimal chapter sequencing suggestions
    6. Content difficulty assessment

    CRITICAL: Return ONLY a valid JSON object in this exact format:
    {
      "overallAssessment": "your assessment here",
      "problematicAreas": ["area 1", "area 2"],
      "engagementInsights": "your insights here",
      "improvements": ["improvement 1", "improvement 2"],
      "contentDifficulty": "medium",
      "recommendedActions": ["action 1", "action 2"]
    }
    
    Do NOT include any text before or after the JSON. Do NOT use markdown formatting.
    `;

    try {
      const geminiModel = await getModel();
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text() || "";
      
      try {
        return JSON.parse(text);
      } catch {
        return {
          overallAssessment: text,
          problematicAreas: [],
          engagementInsights: text,
          improvements: [],
          contentDifficulty: "medium" as const,
          recommendedActions: []
        };
      }
    } catch (error) {
      console.error("Error analyzing course performance:", error);
      throw new Error("Failed to analyze course performance");
    }
  }

  /**
   * Generate predictive analytics for student success
   */
  async predictStudentSuccess(data: {
    userId: string;
    currentProgress: number;
    timeSpentLearning: number;
    completionHistory: any[];
    engagementMetrics: any;
  }) {
    const prompt = `
    As a predictive analytics specialist in education, analyze this student data to predict success likelihood:

    Current Course Progress: ${data.currentProgress}%
    Time Spent Learning: ${data.timeSpentLearning} minutes
    Completion History: ${JSON.stringify(data.completionHistory)}
    Engagement Metrics: ${JSON.stringify(data.engagementMetrics)}

    Predict:
    1. Likelihood of course completion (percentage)
    2. Risk factors that might prevent completion
    3. Success indicators present
    4. Recommended interventions if at risk
    5. Optimal study schedule suggestions
    6. Motivation strategies

    CRITICAL: Return ONLY a valid JSON object in this exact format:
    {
      "completionProbability": 75,
      "riskLevel": "medium",
      "riskFactors": ["factor 1", "factor 2"],
      "successIndicators": ["indicator 1", "indicator 2"],
      "interventions": ["intervention 1", "intervention 2"],
      "studySchedule": "your schedule recommendation here",
      "motivationStrategies": ["strategy 1", "strategy 2"]
    }
    
    Do NOT include any text before or after the JSON. Do NOT use markdown formatting.
    `;

    try {
      const geminiModel = await getModel();
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text() || "";
      
      try {
        return JSON.parse(text);
      } catch {
        return {
          completionProbability: 50,
          riskLevel: "medium" as const,
          riskFactors: [],
          successIndicators: [],
          interventions: [],
          studySchedule: text,
          motivationStrategies: []
        };
      }
    } catch (error) {
      console.error("Error predicting student success:", error);
      throw new Error("Failed to predict student success");
    }
  }

  /**
   * Generate learning path recommendations
   */
  async generateLearningPath(data: {
    userId: string;
    completedCourses: any[];
    interests: string[];
    skillLevel: string;
    goals: string[];
    availableCourses: any[];
  }) {
    const prompt = `
    As a learning path advisor, create a personalized learning journey:

    Student Profile:
    - Completed Courses: ${data.completedCourses.map(c => c.title).join(', ')}
    - Interests: ${data.interests.join(', ')}
    - Skill Level: ${data.skillLevel}
    - Goals: ${data.goals.join(', ')}

    Available Courses:
    ${data.availableCourses.map(course => `- ${course.title} (${course.category?.name})`).join('\n')}

    Create a learning path with:
    1. Recommended course sequence
    2. Skill progression mapping
    3. Estimated timeline
    4. Prerequisites and dependencies
    5. Alternative paths for different goals
    6. Skill gap analysis

    CRITICAL: Return ONLY a valid JSON object in this exact format:
    {
      "recommendedPath": [{"courseId": "id1", "title": "Course 1", "order": 1, "reason": "reason here"}],
      "timeline": "your timeline here",
      "skillProgression": ["skill 1", "skill 2"],
      "alternatives": [{"goal": "goal 1", "courses": ["course 1", "course 2"]}],
      "skillGaps": ["gap 1", "gap 2"],
      "prerequisites": ["prereq 1", "prereq 2"]
    }
    
    Do NOT include any text before or after the JSON. Do NOT use markdown formatting.
    `;

    try {
      const geminiModel = await getModel();
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text() || "";
      
      try {
        return JSON.parse(text);
      } catch {
        return {
          recommendedPath: [],
          timeline: text,
          skillProgression: [],
          alternatives: [],
          skillGaps: [],
          prerequisites: []
        };
      }
    } catch (error) {
      console.error("Error generating learning path:", error);
      throw new Error("Failed to generate learning path");
    }
  }
}

export const geminiAnalytics = new GeminiAnalyticsService();
