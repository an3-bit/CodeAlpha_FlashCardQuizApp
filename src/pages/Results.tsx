import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Header from "@/components/Header";
import ScoreChart from "@/components/ScoreChart";
import { useFlashcards, Category } from "@/context/FlashcardContext";
import { formatQuizDuration, getCategoryName, getAverageScore } from "@/lib/helpers";

const Results = () => {
  const navigate = useNavigate();
  const { quizResults, getResultsByCategory, flashcards } = useFlashcards();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [chartVariant, setChartVariant] = useState<"bar" | "line">("line");
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState<number>(0);
  
  const filteredResults = selectedCategory === "all"
    ? quizResults
    : getResultsByCategory(selectedCategory as Category);
  
  // Sort results by date (newest first)
  const sortedResults = [...filteredResults].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Recalculate the average score whenever filteredResults changes
  const averageScore = getAverageScore(sortedResults);

  // Calculate total questions answered across all quizzes
  useEffect(() => {
    const calculateTotalQuestionsAnswered = () => {
      const total = quizResults.reduce((sum, result) => sum + result.totalQuestions, 0);
      setTotalQuestionsAnswered(total);
    };

    calculateTotalQuestionsAnswered();
  }, [quizResults]);
  
  const handleStartQuiz = () => {
    if (selectedCategory === "all") {
      navigate("/quiz");
    } else {
      navigate(`/quiz/${selectedCategory}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Quiz Results" showBackButton={true} />
      
      <main className="container py-8 px-4 md:px-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Performance Over Time</CardTitle>
                <CardDescription>Your quiz scores from recent sessions</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="fullstack">{getCategoryName("fullstack")}</SelectItem>
                    <SelectItem value="appdev">{getCategoryName("appdev")}</SelectItem>
                    <SelectItem value="python">{getCategoryName("python")}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={chartVariant} onValueChange={(value) => setChartVariant(value as "bar" | "line")}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ScoreChart 
                results={sortedResults} 
                variant={chartVariant} 
                title="" 
                description="" 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>Your overall quiz performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-secondary rounded-xl p-4">
                  <div className="text-sm text-muted-foreground mb-1">Average Score</div>
                  <div className="text-3xl font-medium">{averageScore}%</div>
                </div>
                
                <div className="bg-secondary rounded-xl p-4">
                  <div className="text-sm text-muted-foreground mb-1">Quizzes Taken</div>
                  <div className="text-3xl font-medium">{quizResults.length}</div>
                </div>
                
                <div className="bg-secondary rounded-xl p-4">
                  <div className="text-sm text-muted-foreground mb-1">Questions Answered</div>
                  <div className="text-3xl font-medium">{totalQuestionsAnswered}</div>
                </div>
                
                <div className="bg-secondary rounded-xl p-4">
                  <div className="text-sm text-muted-foreground mb-1">Total Flashcards</div>
                  <div className="text-3xl font-medium">{flashcards.length}</div>
                </div>
                
                <Button className="w-full" onClick={handleStartQuiz}>
                  Start New Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Quiz History</CardTitle>
            <CardDescription>Detailed breakdown of your past quiz sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {sortedResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="bg-muted rounded-full p-4 mb-4">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No quiz history yet</h3>
                <p className="text-muted-foreground mb-4 text-center max-w-md">
                  Take your first quiz to start tracking your progress.
                </p>
                <Button onClick={handleStartQuiz}>Start Quiz</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Questions</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell>
                          {new Date(result.date).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          {getCategoryName(result.category)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="font-medium">
                              {Math.round((result.correctAnswers / result.totalQuestions) * 100)}%
                            </div>
                            <div 
                              className={`ml-2 w-16 h-2 rounded-full ${
                                (result.correctAnswers / result.totalQuestions) >= 0.8
                                  ? "bg-green-500"
                                  : (result.correctAnswers / result.totalQuestions) >= 0.6
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                            >
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{
                                  width: `${(result.correctAnswers / result.totalQuestions) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {result.correctAnswers} / {result.totalQuestions}
                        </TableCell>
                        <TableCell>
                          {formatQuizDuration(result.timeSpent)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Results;
