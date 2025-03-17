
import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  LineChart,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProgressOverTime, getAverageScore } from "@/lib/helpers";
import { QuizResult } from "@/context/FlashcardContext";

interface ScoreChartProps {
  results: QuizResult[];
  variant?: "bar" | "line";
  title?: string;
  description?: string;
}

const ScoreChart: React.FC<ScoreChartProps> = ({
  results,
  variant = "bar",
  title = "Quiz Performance",
  description = "Your quiz scores over time",
}) => {
  const chartData = getProgressOverTime(results);
  const averageScore = getAverageScore(results);

  if (results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">No quiz data available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {variant === "bar" ? (
              <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Score"]}
                  labelFormatter={(value) => `Date: ${value}`}
                />
                <Bar
                  dataKey="score"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Score"]}
                  labelFormatter={(value) => `Date: ${value}`}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "hsl(var(--primary))" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex justify-center">
          <div className="flex flex-col items-center px-4 py-2 bg-secondary rounded-lg">
            <p className="text-sm text-muted-foreground">Average Score</p>
            <p className="text-2xl font-medium">{averageScore}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreChart;
