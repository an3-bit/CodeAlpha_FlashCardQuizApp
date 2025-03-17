
import React from "react";
import { Link } from "react-router-dom";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import CategoryCard from "@/components/CategoryCard";
import { useFlashcards } from "@/context/FlashcardContext";
import { calculateMasteryPercentage, getAverageScore } from "@/lib/helpers";

const Index = () => {
  const { flashcards, getFlashcardsByCategory, quizResults } = useFlashcards();
  
  const categories = ["fullstack", "appdev", "python"] as const;
  const fullstackCards = getFlashcardsByCategory("fullstack");
  const appdevCards = getFlashcardsByCategory("appdev");
  const pythonCards = getFlashcardsByCategory("python");
  
  const fullstackMastery = calculateMasteryPercentage(fullstackCards);
  const appdevMastery = calculateMasteryPercentage(appdevCards);
  const pythonMastery = calculateMasteryPercentage(pythonCards);
  
  const averageScore = getAverageScore(quizResults);
  const totalCards = flashcards.length;
  const recentQuiz = quizResults.length > 0
    ? quizResults.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 px-4 md:px-6 animate-fade-in">
        <section className="mb-12">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-3">
              Master Development Skills with FlashWise
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Create, study, and quiz yourself on flashcards for Fullstack Web Development, 
              App Development, and Python Programming.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CategoryCard 
              category="fullstack" 
              count={fullstackCards.length} 
              masteryPercentage={fullstackMastery.percentage} 
            />
            <CategoryCard 
              category="appdev" 
              count={appdevCards.length} 
              masteryPercentage={appdevMastery.percentage} 
            />
            <CategoryCard 
              category="python" 
              count={pythonCards.length} 
              masteryPercentage={pythonMastery.percentage} 
            />
          </div>
        </section>
        
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Your Study Stats</CardTitle>
                <CardDescription>A quick overview of your learning progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary rounded-xl p-4 flex flex-col items-center justify-center text-center aspect-square">
                    <span className="text-muted-foreground text-sm">Total Flashcards</span>
                    <span className="text-3xl font-medium mt-1">{totalCards}</span>
                  </div>
                  <div className="bg-secondary rounded-xl p-4 flex flex-col items-center justify-center text-center aspect-square">
                    <span className="text-muted-foreground text-sm">Average Score</span>
                    <span className="text-3xl font-medium mt-1">{averageScore}%</span>
                  </div>
                  <div className="bg-secondary rounded-xl p-4 flex flex-col items-center justify-center text-center aspect-square">
                    <span className="text-muted-foreground text-sm">Quizzes Taken</span>
                    <span className="text-3xl font-medium mt-1">{quizResults.length}</span>
                  </div>
                  <div className="bg-secondary rounded-xl p-4 flex flex-col items-center justify-center text-center aspect-square">
                    <span className="text-muted-foreground text-sm">Recent Score</span>
                    <span className="text-3xl font-medium mt-1">
                      {recentQuiz 
                        ? `${Math.round((recentQuiz.correctAnswers / recentQuiz.totalQuestions) * 100)}%` 
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Start learning or create new content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <Button asChild size="lg" className="w-full py-8 h-auto">
                    <Link to="/flashcards/create" className="flex items-center justify-center gap-2">
                      <Plus className="h-5 w-5" />
                      <span>Create New Flashcard</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full py-8 h-auto">
                    <Link to="/quiz" className="flex items-center justify-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      <span>Start a Quick Quiz</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
