
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FlashcardProvider } from "@/context/FlashcardContext";

import Index from "./pages/Index";
import Flashcards from "./pages/Flashcards";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <FlashcardProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/flashcards/:category" element={<Flashcards />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz/:category" element={<Quiz />} />
            <Route path="/results" element={<Results />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FlashcardProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
