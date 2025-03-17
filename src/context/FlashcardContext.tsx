
import React, { createContext, useContext, useState, useEffect } from "react";

export type Category = "fullstack" | "appdev" | "python";

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: Category;
  lastReviewed?: string;
  timesReviewed?: number;
  timesCorrect?: number;
}

export interface QuizResult {
  id: string;
  date: string;
  category: Category;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
}

interface FlashcardContextType {
  flashcards: Flashcard[];
  addFlashcard: (flashcard: Omit<Flashcard, "id">) => void;
  updateFlashcard: (flashcard: Flashcard) => void;
  deleteFlashcard: (id: string) => void;
  getFlashcardsByCategory: (category: Category) => Flashcard[];
  quizResults: QuizResult[];
  addQuizResult: (result: Omit<QuizResult, "id" | "date">) => void;
  getResultsByCategory: (category: Category) => QuizResult[];
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

export const useFlashcards = () => {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error("useFlashcards must be used within a FlashcardProvider");
  }
  return context;
};

// Sample flashcards for initial state
const sampleFlashcards: Flashcard[] = [
  {
    id: "1",
    question: "What is React?",
    answer: "React is a JavaScript library for building user interfaces, particularly single-page applications.",
    category: "fullstack",
    lastReviewed: new Date().toISOString(),
    timesReviewed: 2,
    timesCorrect: 1,
  },
  {
    id: "2",
    question: "What is the Virtual DOM in React?",
    answer: "The Virtual DOM is a lightweight copy of the actual DOM that React uses to improve performance by minimizing direct manipulations of the DOM.",
    category: "fullstack",
    lastReviewed: new Date().toISOString(),
    timesReviewed: 1,
    timesCorrect: 1,
  },
  {
    id: "3",
    question: "What is Swift?",
    answer: "Swift is Apple's programming language for iOS, macOS, watchOS, and tvOS app development.",
    category: "appdev",
    lastReviewed: new Date().toISOString(),
    timesReviewed: 3,
    timesCorrect: 2,
  },
  {
    id: "4",
    question: "What is Kotlin?",
    answer: "Kotlin is a cross-platform, statically typed, general-purpose programming language developed by JetBrains. It's officially supported by Google for Android development.",
    category: "appdev",
    lastReviewed: new Date().toISOString(),
    timesReviewed: 1,
    timesCorrect: 0,
  },
  {
    id: "5",
    question: "What is a Python decorator?",
    answer: "A decorator is a design pattern in Python that allows a user to add new functionality to an existing object without modifying its structure.",
    category: "python",
    lastReviewed: new Date().toISOString(),
    timesReviewed: 2,
    timesCorrect: 2,
  },
  {
    id: "6",
    question: "What are Python list comprehensions?",
    answer: "List comprehensions provide a concise way to create lists based on existing lists. They are a syntactic construct that enables you to create a list from another list or iterator.",
    category: "python",
    lastReviewed: new Date().toISOString(),
    timesReviewed: 1,
    timesCorrect: 1,
  },
];

// Sample quiz results
const sampleQuizResults: QuizResult[] = [
  {
    id: "r1",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    category: "fullstack",
    totalQuestions: 5,
    correctAnswers: 4,
    timeSpent: 120,
  },
  {
    id: "r2",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    category: "fullstack",
    totalQuestions: 5,
    correctAnswers: 5,
    timeSpent: 110,
  },
  {
    id: "r3",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    category: "python",
    totalQuestions: 4,
    correctAnswers: 3,
    timeSpent: 90,
  },
];

export const FlashcardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const savedFlashcards = localStorage.getItem("flashcards");
    return savedFlashcards ? JSON.parse(savedFlashcards) : sampleFlashcards;
  });

  const [quizResults, setQuizResults] = useState<QuizResult[]>(() => {
    const savedResults = localStorage.getItem("quizResults");
    return savedResults ? JSON.parse(savedResults) : sampleQuizResults;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
  }, [flashcards]);

  useEffect(() => {
    localStorage.setItem("quizResults", JSON.stringify(quizResults));
  }, [quizResults]);

  const addFlashcard = (flashcard: Omit<Flashcard, "id">) => {
    const newFlashcard: Flashcard = {
      ...flashcard,
      id: Date.now().toString(),
      lastReviewed: new Date().toISOString(),
      timesReviewed: 0,
      timesCorrect: 0,
    };
    setFlashcards([...flashcards, newFlashcard]);
  };

  const updateFlashcard = (updatedFlashcard: Flashcard) => {
    setFlashcards(
      flashcards.map((card) => (card.id === updatedFlashcard.id ? updatedFlashcard : card))
    );
  };

  const deleteFlashcard = (id: string) => {
    setFlashcards(flashcards.filter((card) => card.id !== id));
  };

  const getFlashcardsByCategory = (category: Category): Flashcard[] => {
    return flashcards.filter((card) => card.category === category);
  };

  const addQuizResult = (result: Omit<QuizResult, "id" | "date">) => {
    const newResult: QuizResult = {
      ...result,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setQuizResults([...quizResults, newResult]);
  };

  const getResultsByCategory = (category: Category): QuizResult[] => {
    return quizResults.filter((result) => result.category === category);
  };

  const value = {
    flashcards,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    getFlashcardsByCategory,
    quizResults,
    addQuizResult,
    getResultsByCategory,
  };

  return <FlashcardContext.Provider value={value}>{children}</FlashcardContext.Provider>;
};
