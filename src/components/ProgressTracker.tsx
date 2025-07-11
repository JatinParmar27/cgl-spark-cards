import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Award, Clock } from "lucide-react";

interface ProgressStats {
  totalCards: number;
  studiedToday: number;
  correctAnswers: number;
  totalAttempts: number;
  streakDays: number;
  timeSpent: number; // in minutes
}

interface ProgressTrackerProps {
  stats: ProgressStats;
}

export const ProgressTracker = ({ stats }: ProgressTrackerProps) => {
  const accuracy = stats.totalAttempts > 0 ? (stats.correctAnswers / stats.totalAttempts) * 100 : 0;
  const dailyGoal = 20; // cards per day
  const dailyProgress = Math.min((stats.studiedToday / dailyGoal) * 100, 100);
  
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Daily Progress */}
      <Card className="flashcard">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Daily Goal
            </CardTitle>
            <Target className="w-4 h-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-foreground">
                {stats.studiedToday}
              </span>
              <span className="text-sm text-muted-foreground mb-1">
                / {dailyGoal}
              </span>
            </div>
            <Progress value={dailyProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {dailyProgress >= 100 ? "Goal achieved! 🎉" : `${Math.round(dailyProgress)}% complete`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Accuracy */}
      <Card className="flashcard">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Accuracy
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-secondary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-foreground">
                {Math.round(accuracy)}%
              </span>
            </div>
            <Progress value={accuracy} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {stats.correctAnswers} correct out of {stats.totalAttempts}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Streak */}
      <Card className="flashcard">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Study Streak
            </CardTitle>
            <Award className="w-4 h-4 text-accent" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-foreground">
                {stats.streakDays}
              </span>
              <span className="text-sm text-muted-foreground mb-1">
                days
              </span>
            </div>
            <Badge 
              variant={stats.streakDays >= 7 ? "default" : "secondary"} 
              className="text-xs"
            >
              {stats.streakDays >= 7 ? "On fire! 🔥" : "Keep going!"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Time Spent */}
      <Card className="flashcard">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Time Today
            </CardTitle>
            <Clock className="w-4 h-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-foreground">
                {formatTime(stats.timeSpent)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Total study time
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};