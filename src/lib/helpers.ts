
import { formatDistanceToNow } from "date-fns";
import { Category, Flashcard, QuizResult } from "@/context/FlashcardContext";

export const getCategoryName = (category: Category): string => {
  const names: Record<Category, string> = {
    fullstack: "Fullstack Web Development",
    appdev: "App Development",
    python: "Python Programming",
  };
  return names[category];
};

export const getCategoryIcon = (category: Category): string => {
  const icons: Record<Category, string> = {
    fullstack: "🌐",
    appdev: "📱",
    python: "🐍",
  };
  return icons[category];
};

export const getCategoryColor = (category: Category): string => {
  const colors: Record<Category, string> = {
    fullstack: "from-blue-500/10 to-indigo-500/10",
    appdev: "from-emerald-500/10 to-teal-500/10",
    python: "from-yellow-500/10 to-amber-500/10",
  };
  return colors[category];
};

export const getTimeAgo = (date: string): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const calculateMasteryPercentage = (
  flashcards: Flashcard[]
): { mastered: number; total: number; percentage: number } => {
  const total = flashcards.length;
  if (total === 0) return { mastered: 0, total: 0, percentage: 0 };

  const mastered = flashcards.filter(
    (card) => (card.times_correct || 0) / (card.times_reviewed || 1) >= 0.8
  ).length;

  return {
    mastered,
    total,
    percentage: Math.round((mastered / total) * 100),
  };
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const formatQuizDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}m ${remainingSeconds}s`;
};

export const getAverageScore = (results: QuizResult[]): number => {
  if (results.length === 0) return 0;
  
  const totalPercentage = results.reduce(
    (sum, result) => sum + (result.correctAnswers / result.totalQuestions) * 100,
    0
  );
  
  return Math.round(totalPercentage / results.length);
};

export const getProgressOverTime = (results: QuizResult[]): { date: string; score: number }[] => {
  return results
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((result) => ({
      date: new Date(result.date).toLocaleDateString(),
      score: Math.round((result.correctAnswers / result.totalQuestions) * 100),
    }));
};
