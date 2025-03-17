
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, Brain, Share2, Users } from "lucide-react";
import CategoryCard from "@/components/CategoryCard";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user, signOut } = useAuth();

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
              title="Fullstack Development"
              description="Master React, Node.js, databases, and modern web development"
              icon={<BookOpen className="w-10 h-10" />}
              href={user ? "/flashcards/fullstack" : "/auth"}
            />
            <CategoryCard
              title="App Development"
              description="Learn iOS, Android, and cross-platform mobile development"
              icon={<Brain className="w-10 h-10" />}
              href={user ? "/flashcards/appdev" : "/auth"}
            />
            <CategoryCard
              title="Python Programming"
              description="Explore Python fundamentals, data science, and automation"
              icon={<Users className="w-10 h-10" />}
              href={user ? "/flashcards/python" : "/auth"}
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
