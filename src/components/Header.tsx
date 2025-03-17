
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, BarChart3, BookOpen, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false }) => {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border/40 px-4 py-3">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Button variant="ghost" size="icon" asChild>
              <Link to="/" aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
          )}
          <h1 className="text-xl font-medium">
            {title || "FlashWise"}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className={location.pathname === "/" ? "text-primary" : ""}>
                Home
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/flashcards" className={location.pathname.includes("/flashcards") ? "text-primary" : ""}>
                My Flashcards
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/results" className={location.pathname === "/results" ? "text-primary" : ""}>
                Progress
              </Link>
            </Button>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                <Link 
                  to="/" 
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-secondary"
                >
                  <BookOpen className="h-5 w-5" />
                  <span>Home</span>
                </Link>
                <Link 
                  to="/flashcards" 
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-secondary"
                >
                  <BookOpen className="h-5 w-5" />
                  <span>My Flashcards</span>
                </Link>
                <Link 
                  to="/results" 
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-secondary"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>Progress</span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
