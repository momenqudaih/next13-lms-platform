import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
    Brain, 
    TrendingUp, 
    Target, 
    BookOpen, 
    Clock, 
    Award,
    AlertTriangle,
    CheckCircle,
    Lightbulb
} from "lucide-react";

interface StudentInsightsProps {
    analytics: {
        learningPatterns?: string;
        strengths?: string[];
        improvements?: string[];
        recommendations?: string[];
        engagementLevel?: "high" | "medium" | "low";
        studyHabits?: string;
        suggestions?: string[];
        completionProbability?: number;
        riskLevel?: "low" | "medium" | "high";
        riskFactors?: string[];
        successIndicators?: string[];
        interventions?: string[];
        motivationStrategies?: string[];
    };
    coursesData: {
        completed: any[];
        inProgress: any[];
        totalProgress: number;
    };
}

interface LearningPathCardProps {
    recommendations: string[];
    engagementLevel: "high" | "medium" | "low";
}

interface ProgressPredictionCardProps {
    completionProbability?: number;
    riskLevel?: "low" | "medium" | "high";
    riskFactors?: string[];
    interventions?: string[];
}

const getEngagementColor = (level: "high" | "medium" | "low") => {
    switch (level) {
        case "high":
            return "bg-green-100 text-green-800";
        case "low":
            return "bg-red-100 text-red-800";
        default:
            return "bg-yellow-100 text-yellow-800";
    }
};

const getRiskColor = (level: "low" | "medium" | "high") => {
    switch (level) {
        case "low":
            return "text-green-600";
        case "high":
            return "text-red-600";
        default:
            return "text-yellow-600";
    }
};

const getRiskIcon = (level: "low" | "medium" | "high") => {
    switch (level) {
        case "low":
            return <CheckCircle className="h-4 w-4" />;
        case "high":
            return <AlertTriangle className="h-4 w-4" />;
        default:
            return <Clock className="h-4 w-4" />;
    }
};

export const LearningPatternCard = ({ 
    learningPatterns, 
    engagementLevel 
}: { 
    learningPatterns?: string; 
    engagementLevel?: "high" | "medium" | "low";
}) => {
    // Check if learningPatterns contains JSON and extract the actual content
    let displayText = learningPatterns || "AI is analyzing your learning patterns...";
    
    // If the text looks like JSON, try to parse it and extract the learningPatterns field
    if (displayText.trim().startsWith('{') && displayText.includes('"learningPatterns"')) {
        try {
            const parsed = JSON.parse(displayText);
            displayText = parsed.learningPatterns || displayText;
        } catch (error) {
            // Keep the original text if parsing fails
        }
    }

    return (
        <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Brain className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Your Learning Pattern</CardTitle>
                    </div>
                    {engagementLevel && (
                        <Badge className={getEngagementColor(engagementLevel)}>
                            {engagementLevel} engagement
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {displayText}
                </p>
            </CardContent>
        </Card>
    );
};

export const StrengthsCard = ({ strengths }: { strengths?: string[] }) => {
    if (!strengths || strengths.length === 0) return null;

    return (
        <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
                <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-lg">Your Strengths</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {strengths.slice(0, 4).map((strength, index) => (
                        <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{strength}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};

export const ImprovementCard = ({ 
    improvements, 
    suggestions 
}: { 
    improvements?: string[];
    suggestions?: string[];
}) => {
    const allSuggestions = [...(improvements || []), ...(suggestions || [])];
    
    if (allSuggestions.length === 0) return null;

    return (
        <Card className="border-2 border-yellow-200 bg-yellow-50">
            <CardHeader>
                <div className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    <CardTitle className="text-lg">Growth Opportunities</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {allSuggestions.slice(0, 4).map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                            <Target className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{item}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};

export const LearningPathCard = ({ 
    recommendations, 
    engagementLevel 
}: LearningPathCardProps) => {
    if (!recommendations || recommendations.length === 0) return null;

    return (
        <Card className="border-2 border-purple-200 bg-purple-50">
            <CardHeader>
                <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-lg">Recommended Learning Path</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {recommendations.slice(0, 3).map((recommendation, index) => (
                        <li key={index} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                {index + 1}
                            </div>
                            <span className="text-sm text-muted-foreground">{recommendation}</span>
                        </li>
                    ))}
                </ul>
                {recommendations.length > 3 && (
                    <p className="text-xs text-muted-foreground mt-3">
                        And {recommendations.length - 3} more recommendations...
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

export const ProgressPredictionCard = ({ 
    completionProbability, 
    riskLevel, 
    riskFactors, 
    interventions 
}: ProgressPredictionCardProps) => {
    if (completionProbability === undefined) return null;

    return (
        <Card className="border-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Success Prediction</CardTitle>
                    </div>
                    {riskLevel && (
                        <div className={`flex items-center space-x-1 ${getRiskColor(riskLevel)}`}>
                            {getRiskIcon(riskLevel)}
                            <span className="text-sm font-medium capitalize">{riskLevel} risk</span>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Completion Probability</span>
                        <span className="text-2xl font-bold text-blue-600">
                            {Math.round(completionProbability)}%
                        </span>
                    </div>
                    <Progress value={completionProbability} className="h-2" />
                </div>

                {riskFactors && riskFactors.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium mb-2 text-red-600">Areas to Watch:</h4>
                        <ul className="space-y-1">
                            {riskFactors.slice(0, 2).map((factor, index) => (
                                <li key={index} className="text-xs text-muted-foreground flex items-start space-x-2">
                                    <AlertTriangle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                                    <span>{factor}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {interventions && interventions.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium mb-2 text-blue-600">Recommendations:</h4>
                        <ul className="space-y-1">
                            {interventions.slice(0, 2).map((intervention, index) => (
                                <li key={index} className="text-xs text-muted-foreground flex items-start space-x-2">
                                    <Lightbulb className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <span>{intervention}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export const StudentInsights = ({ analytics, coursesData }: StudentInsightsProps) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-purple-600" />
                <h2 className="text-2xl font-bold">Your Learning Insights</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Learning Pattern */}
                <LearningPatternCard 
                    learningPatterns={analytics.learningPatterns}
                    engagementLevel={analytics.engagementLevel}
                />

                {/* Progress Prediction */}
                <ProgressPredictionCard 
                    completionProbability={analytics.completionProbability}
                    riskLevel={analytics.riskLevel}
                    riskFactors={analytics.riskFactors}
                    interventions={analytics.interventions}
                />

                {/* Strengths */}
                <StrengthsCard strengths={analytics.strengths} />

                {/* Improvements */}
                <ImprovementCard 
                    improvements={analytics.improvements}
                    suggestions={analytics.suggestions}
                />
            </div>

            {/* Learning Path - Full Width */}
            <LearningPathCard 
                recommendations={analytics.recommendations || []}
                engagementLevel={analytics.engagementLevel || "medium"}
            />

            {/* Study Habits */}
            {analytics.studyHabits && (
                <Card className="border-2 border-indigo-200 bg-indigo-50">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-indigo-600" />
                            <CardTitle className="text-lg">Study Habits Analysis</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {analytics.studyHabits}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
