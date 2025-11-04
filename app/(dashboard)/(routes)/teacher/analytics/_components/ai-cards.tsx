import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/format";
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";

interface DataCardProps {
    value: number;
    label: string;
    shouldFormat?: boolean;
}

interface AIInsightCardProps {
    title: string;
    insight: string;
    type: "positive" | "negative" | "neutral" | "warning";
    icon?: React.ReactNode;
}

interface CourseAnalyticsCardProps {
    courseTitle: string;
    analytics: {
        totalStudents: number;
        completionRate: number;
        averageProgress: number;
        overallAssessment?: string;
        contentDifficulty?: string;
        engagementInsights?: string;
    };
}

export const DataCard = ({
    value,
    label,
    shouldFormat = true,
}: DataCardProps) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {label}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {shouldFormat ? formatPrice(value) : value}
                </div>
            </CardContent>
        </Card>
    )
}

export const AIInsightCard = ({
    title,
    insight,
    type,
    icon
}: AIInsightCardProps) => {
    const getTypeStyles = () => {
        switch (type) {
            case "positive":
                return "border-green-200 bg-green-50";
            case "negative":
                return "border-red-200 bg-red-50";
            case "warning":
                return "border-yellow-200 bg-yellow-50";
            default:
                return "border-blue-200 bg-blue-50";
        }
    };

    const getIconColor = () => {
        switch (type) {
            case "positive":
                return "text-green-600";
            case "negative":
                return "text-red-600";
            case "warning":
                return "text-yellow-600";
            default:
                return "text-blue-600";
        }
    };

    return (
        <Card className={`${getTypeStyles()} border-2`}>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className={`mr-2 ${getIconColor()}`}>
                    {icon || <Brain className="h-4 w-4" />}
                </div>
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {insight}
                </p>
            </CardContent>
        </Card>
    )
}

export const CourseAnalyticsCard = ({
    courseTitle,
    analytics
}: CourseAnalyticsCardProps) => {
    const getDifficultyColor = (difficulty?: string) => {
        switch (difficulty?.toLowerCase()) {
            case "easy":
                return "bg-green-100 text-green-800";
            case "hard":
                return "bg-red-100 text-red-800";
            default:
                return "bg-blue-100 text-blue-800";
        }
    };

    const getCompletionIcon = () => {
        if (analytics.completionRate >= 80) {
            return <CheckCircle className="h-4 w-4 text-green-600" />;
        } else if (analytics.completionRate >= 50) {
            return <TrendingUp className="h-4 w-4 text-yellow-600" />;
        } else {
            return <AlertTriangle className="h-4 w-4 text-red-600" />;
        }
    };

    return (
        <Card className="border-2">
            <CardHeader>
                <div className="flex flex-col items-start justify-between">
                    <CardTitle className="text-lg font-semibold truncate">
                        {courseTitle}
                    </CardTitle>
                    <div>
                    {analytics.contentDifficulty && (
                        <Badge className={getDifficultyColor(analytics.contentDifficulty)}>
                            {analytics.contentDifficulty}
                        </Badge>
                    )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-blue-600">
                            {analytics.totalStudents}
                        </div>
                        <div className="text-xs text-muted-foreground">Students</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center space-x-1">
                            {getCompletionIcon()}
                            <span className="text-2xl font-bold">
                                {Math.round(analytics.completionRate)}%
                            </span>
                        </div>
                        <div className="text-xs text-muted-foreground">Completion</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-green-600">
                            {Math.round(analytics.averageProgress)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Avg Progress</div>
                    </div>
                </div>

                {/* AI Assessment */}
                {analytics.overallAssessment && (
                    <div className="border-t pt-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <Brain className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-600">AI Assessment</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {analytics.overallAssessment}
                        </p>
                    </div>
                )}

                {/* Engagement Insights */}
                {analytics.engagementInsights && (
                    <div className="border-t pt-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-600">Engagement</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {analytics.engagementInsights}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
