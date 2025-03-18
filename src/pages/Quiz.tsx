
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, Flame, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import FlashcardItem from "@/components/FlashcardItem";
import { useFlashcards, Flashcard, Category } from "@/context/FlashcardContext";
import { shuffleArray, getCategoryName, formatQuizDuration } from "@/lib/helpers";

const Quiz = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category?: Category }>();
  const { getFlashcardsByCategory, updateFlashcard, addQuizResult } = useFlashcards();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [quizCards, setQuizCards] = useState<Flashcard[]>([]);
  const [answeredCards, setAnsweredCards] = useState<Record<string, boolean>>({});
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  
  useEffect(() => {
    let cards: Flashcard[] = [];
    
    if (category) {
      cards = getFlashcardsByCategory(category as Category);
    } else {
      const categories = ["fullstack", "appdev", "python"] as const;
      categories.forEach((cat) => {
        const categoryCards = getFlashcardsByCategory(cat);
        cards = [...cards, ...categoryCards];
      });
    }
    
    const limitedCards = shuffleArray(cards).slice(0, 10);
    setQuizCards(limitedCards);
    
    setCurrentStep(0);
    setAnsweredCards({});
    setStartTime(Date.now());
    setIsQuizComplete(false);
    
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [category, getFlashcardsByCategory]);
  
  useEffect(() => {
    if (quizCards.length > 0 && Object.keys(answeredCards).length === quizCards.length) {
      const totalTime = Math.floor((Date.now() - startTime) / 1000);
      
      const correctAnswers = Object.values(answeredCards).filter(value => value).length;
      
      const quizCategory = category || "fullstack";
      addQuizResult({
        category: quizCategory as Category,
        totalQuestions: quizCards.length,
        correctAnswers,
        timeSpent: totalTime,
      });
      
      setIsQuizComplete(true);
    }
  }, [answeredCards, quizCards, startTime, addQuizResult, category]);
  
  const handleCorrectAnswer = (flashcard: Flashcard) => {
    const newAnsweredCards = {
      ...answeredCards,
      [flashcard.id]: true,
    };
    
    setAnsweredCards(newAnsweredCards);
    
    updateFlashcard({
      ...flashcard,
      last_reviewed: new Date().toISOString(),
      times_reviewed: (flashcard.times_reviewed || 0) + 1,
      times_correct: (flashcard.times_correct || 0) + 1,
    });
    
    if (currentStep < quizCards.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleIncorrectAnswer = (flashcard: Flashcard) => {
    const newAnsweredCards = {
      ...answeredCards,
      [flashcard.id]: false,
    };
    
    setAnsweredCards(newAnsweredCards);
    
    updateFlashcard({
      ...flashcard,
      last_reviewed: new Date().toISOString(),
      times_reviewed: (flashcard.times_reviewed || 0) + 1,
    });
    
    if (currentStep < quizCards.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleNextCard = () => {
    if (currentStep < quizCards.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevCard = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleViewResults = () => {
    navigate("/results");
  };
  
  // Calculate progress based on number of answered cards
  const progress = quizCards.length > 0
    ? Math.round((Object.keys(answeredCards).length / quizCards.length) * 100)
    : 0;
  
  const correctAnswers = Object.values(answeredCards).filter(value => value).length;
  const currentScore = quizCards.length > 0 && Object.keys(answeredCards).length > 0
    ? Math.round((correctAnswers / Object.keys(answeredCards).length) * 100) || 0
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title={category ? `Quiz: ${getCategoryName(category as Category)}` : "Quick Quiz"} 
        showBackButton={true} 
      />
      
      <main className="container py-8 px-4 md:px-6 animate-fade-in">
        {quizCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-muted rounded-full p-6 mb-4">
              <HelpCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No flashcards available</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              You need to create some flashcards before taking a quiz.
            </p>
            <Button asChild>
              <a href="/flashcards/create">Create Flashcards</a>
            </Button>
          </div>
        ) : isQuizComplete ? (
          <div className="max-w-md mx-auto">
            <Card className="p-8 text-center">
              <div className="mb-6">
                <div className="bg-primary/10 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <Flame className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-medium mb-2">Quiz Complete!</h2>
                <p className="text-muted-foreground">
                  You've completed the quiz. Here's how you did:
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-secondary rounded-xl p-4">
                  <div className="text-sm text-muted-foreground">Score</div>
                  <div className="text-2xl font-medium">{currentScore}%</div>
                </div>
                <div className="bg-secondary rounded-xl p-4">
                  <div className="text-sm text-muted-foreground">Time</div>
                  <div className="text-2xl font-medium">{formatQuizDuration(elapsedTime)}</div>
                </div>
                <div className="bg-secondary rounded-xl p-4">
                  <div className="text-sm text-muted-foreground">Correct</div>
                  <div className="text-2xl font-medium">{correctAnswers}/{quizCards.length}</div>
                </div>
                <div className="bg-secondary rounded-xl p-4">
                  <div className="text-sm text-muted-foreground">Completion</div>
                  <div className="text-2xl font-medium">100%</div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" asChild className="flex-1">
                  <a href={category ? `/quiz/${category}` : "/quiz"}>Retry Quiz</a>
                </Button>
                <Button className="flex-1" onClick={handleViewResults}>
                  View Results
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="max-w-xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2 h-8 w-8 flex items-center justify-center">
                  <HelpCircle className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">
                  Question {currentStep + 1} of {quizCards.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{formatQuizDuration(elapsedTime)}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            {quizCards.length > 0 && (
              <div className="mb-6">
                <FlashcardItem
                  flashcard={quizCards[currentStep]}
                  quizMode={true}
                  onCorrect={handleCorrectAnswer}
                  onIncorrect={handleIncorrectAnswer}
                />
              </div>
            )}
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevCard}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                onClick={handleNextCard}
                disabled={currentStep === quizCards.length - 1}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Quiz;
