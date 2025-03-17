
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, Brain, Share2, Users } from "lucide-react";
import CategoryCard from "@/components/CategoryCard";
import { useAuth } from "@/context/AuthContext";
import { useFlashcards } from "@/context/FlashcardContext";
import { calculateMasteryPercentage } from "@/lib/helpers";

const Index = () => {
  const { user, signOut } = useAuth();
  const { flashcards } = useFlashcards();

  // Calculate mastery percentages for each category
  const fullstackFlashcards = flashcards.filter(card => card.category === "fullstack");
  const appdevFlashcards = flashcards.filter(card => card.category === "appdev");
  const pythonFlashcards = flashcards.filter(card => card.category === "python");

  const fullstackMastery = calculateMasteryPercentage(fullstackFlashcards).percentage;
  const appdevMastery = calculateMasteryPercentage(appdevFlashcards).percentage;
  const pythonMastery = calculateMasteryPercentage(pythonFlashcards).percentage;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <header className="mb-12 md:mb-20 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to FlashWise
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
            Master any subject with smart flashcards and spaced repetition
          </p>
          <div className="flex gap-4 mt-8">
            {user ? (
              <>
                <Button asChild size="lg">
                  <Link to="/flashcards">My Flashcards</Link>
                </Button>
                <Button variant="outline" size="lg" onClick={signOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link to="/auth">Get Started</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </header>

        <section className="mb-16 md:mb-24">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Choose a Category to Start Learning
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CategoryCard
              category="fullstack"
              count={fullstackFlashcards.length}
              masteryPercentage={fullstackMastery}
            />
            <CategoryCard
              category="appdev"
              count={appdevFlashcards.length}
              masteryPercentage={appdevMastery}
            />
            <CategoryCard
              category="python"
              count={pythonFlashcards.length}
              masteryPercentage={pythonMastery}
            />
          </div>
        </section>

        <section className="mb-16 md:mb-24 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Learn Faster, Remember Longer
            </h2>
            <p className="text-lg mb-6 text-muted-foreground">
              FlashWise combines smart flashcards with proven learning techniques 
              like spaced repetition and active recall to help you remember what you learn.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="rounded-full p-1 bg-primary/10 mt-1">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <span>Create custom flashcards for any subject</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="rounded-full p-1 bg-primary/10 mt-1">
                  <Brain className="w-4 h-4 text-primary" />
                </div>
                <span>Track your progress with detailed analytics</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="rounded-full p-1 bg-primary/10 mt-1">
                  <Share2 className="w-4 h-4 text-primary" />
                </div>
                <span>Share decks and study collaboratively</span>
              </li>
            </ul>
            <Button asChild size="lg">
              <Link to={user ? "/flashcards" : "/auth"}>
                Start Learning <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1546&q=80" 
              alt="Student studying with flashcards" 
              className="rounded-lg shadow-lg w-full max-w-md object-cover"
            />
          </div>
        </section>

        <section className="mb-16 md:mb-24">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Why FlashWise Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full p-3 bg-primary/10 w-fit mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Active Recall</h3>
                <p className="text-muted-foreground">
                  Actively retrieving information strengthens memory connections,
                  making it easier to recall later.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full p-3 bg-primary/10 w-fit mb-4">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Spaced Repetition</h3>
                <p className="text-muted-foreground">
                  Review cards at optimal intervals to move information from
                  short-term to long-term memory.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full p-3 bg-primary/10 w-fit mb-4">
                  <Share2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Shared Learning</h3>
                <p className="text-muted-foreground">
                  Create and share flashcard decks with friends or colleagues to
                  enhance collaborative learning.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Ready to Boost Your Learning?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students and professionals who use FlashWise to
            learn faster and remember longer.
          </p>
          {user ? (
            <Button asChild size="lg">
              <Link to="/flashcards">
                Go to My Flashcards <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link to="/auth">
                Create Your Account <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </section>
      </div>
    </div>
  );
};

export default Index;
