
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export type Category = "fullstack" | "appdev" | "python";

export interface Flashcard {
  id: string;
  user_id?: string;
  question: string;
  answer: string;
  category: Category;
  last_reviewed?: string;
  times_reviewed?: number;
  times_correct?: number;
  created_at?: string;
  updated_at?: string;
}

export interface QuizResult {
  id: string;
  user_id?: string;
  date: string;
  category: Category;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
}

export interface SharedDeck {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  category: Category;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
  flashcards?: Flashcard[];
}

interface FlashcardContextType {
  flashcards: Flashcard[];
  isLoading: boolean;
  addFlashcard: (flashcard: Omit<Flashcard, "id" | "user_id">) => Promise<void>;
  updateFlashcard: (flashcard: Flashcard) => Promise<void>;
  deleteFlashcard: (id: string) => Promise<void>;
  getFlashcardsByCategory: (category: Category) => Flashcard[];
  quizResults: QuizResult[];
  addQuizResult: (result: Omit<QuizResult, "id" | "date" | "user_id">) => Promise<void>;
  getResultsByCategory: (category: Category) => QuizResult[];
  sharedDecks: SharedDeck[];
  createSharedDeck: (deck: Omit<SharedDeck, "id" | "owner_id">) => Promise<void>;
  addFlashcardToDeck: (deckId: string, flashcardId: string) => Promise<void>;
  removeFlashcardFromDeck: (deckId: string, flashcardId: string) => Promise<void>;
  getSharedDecksByCategory: (category: Category) => SharedDeck[];
  getSharedDeckById: (id: string) => Promise<SharedDeck | null>;
  updateSharedDeck: (deck: SharedDeck) => Promise<void>;
  deleteSharedDeck: (id: string) => Promise<void>;
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

export const useFlashcards = () => {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error("useFlashcards must be used within a FlashcardProvider");
  }
  return context;
};

export const FlashcardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [sharedDecks, setSharedDecks] = useState<SharedDeck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch flashcards from Supabase when user changes
  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!user) {
        setFlashcards([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('flashcards')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Map the data to ensure category is of type Category
        const typedFlashcards = data?.map(card => ({
          ...card,
          category: card.category as Category
        })) || [];
        
        setFlashcards(typedFlashcards);
      } catch (error: any) {
        console.error('Error fetching flashcards:', error);
        toast.error('Failed to load flashcards');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashcards();
  }, [user]);

  // Fetch quiz results from Supabase when user changes
  useEffect(() => {
    const fetchQuizResults = async () => {
      if (!user) {
        setQuizResults([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('quiz_results')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;
        
        // Map to match our expected format
        const formattedResults = data?.map(result => ({
          id: result.id,
          user_id: result.user_id,
          date: result.date,
          category: result.category as Category,
          totalQuestions: result.total_questions,
          correctAnswers: result.correct_answers,
          timeSpent: result.time_spent
        })) || [];
        
        setQuizResults(formattedResults);
      } catch (error: any) {
        console.error('Error fetching quiz results:', error);
        toast.error('Failed to load quiz results');
      }
    };

    fetchQuizResults();
  }, [user]);

  // Fetch shared decks from Supabase when user changes
  useEffect(() => {
    const fetchSharedDecks = async () => {
      if (!user) {
        setSharedDecks([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('shared_decks')
          .select('*')
          .or(`is_public.eq.true,owner_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Map the data to ensure category is of type Category
        const typedDecks = data?.map(deck => ({
          ...deck,
          category: deck.category as Category
        })) || [];
        
        setSharedDecks(typedDecks);
      } catch (error: any) {
        console.error('Error fetching shared decks:', error);
        toast.error('Failed to load shared decks');
      }
    };

    fetchSharedDecks();
  }, [user]);

  const addFlashcard = async (flashcard: Omit<Flashcard, "id" | "user_id">) => {
    if (!user) {
      toast.error('You must be logged in to add flashcards');
      return;
    }

    try {
      const newFlashcard = {
        ...flashcard,
        user_id: user.id,
        last_reviewed: new Date().toISOString(),
        times_reviewed: 0,
        times_correct: 0
      };

      const { data, error } = await supabase
        .from('flashcards')
        .insert([newFlashcard])
        .select();

      if (error) throw error;
      
      if (data && data[0]) {
        const typedFlashcard = {
          ...data[0],
          category: data[0].category as Category
        };
        setFlashcards([typedFlashcard, ...flashcards]);
        toast.success('Flashcard created successfully');
      }
    } catch (error: any) {
      console.error('Error adding flashcard:', error);
      toast.error('Failed to create flashcard');
    }
  };

  const updateFlashcard = async (flashcard: Flashcard) => {
    if (!user) {
      toast.error('You must be logged in to update flashcards');
      return;
    }

    try {
      const { error } = await supabase
        .from('flashcards')
        .update({
          question: flashcard.question,
          answer: flashcard.answer,
          category: flashcard.category,
          last_reviewed: flashcard.last_reviewed || new Date().toISOString(),
          times_reviewed: flashcard.times_reviewed,
          times_correct: flashcard.times_correct,
          updated_at: new Date().toISOString()
        })
        .eq('id', flashcard.id);

      if (error) throw error;
      
      setFlashcards(
        flashcards.map((card) => (card.id === flashcard.id ? flashcard : card))
      );
      
      toast.success('Flashcard updated successfully');
    } catch (error: any) {
      console.error('Error updating flashcard:', error);
      toast.error('Failed to update flashcard');
    }
  };

  const deleteFlashcard = async (id: string) => {
    if (!user) {
      toast.error('You must be logged in to delete flashcards');
      return;
    }

    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setFlashcards(flashcards.filter((card) => card.id !== id));
      toast.success('Flashcard deleted successfully');
    } catch (error: any) {
      console.error('Error deleting flashcard:', error);
      toast.error('Failed to delete flashcard');
    }
  };

  const getFlashcardsByCategory = (category: Category): Flashcard[] => {
    return flashcards.filter((card) => card.category === category);
  };

  const addQuizResult = async (result: Omit<QuizResult, "id" | "date" | "user_id">) => {
    if (!user) {
      toast.error('You must be logged in to save quiz results');
      return;
    }

    try {
      const newResult = {
        user_id: user.id,
        category: result.category,
        total_questions: result.totalQuestions,
        correct_answers: result.correctAnswers,
        time_spent: result.timeSpent,
        date: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('quiz_results')
        .insert([newResult])
        .select();

      if (error) throw error;
      
      if (data && data[0]) {
        const formattedResult: QuizResult = {
          id: data[0].id,
          user_id: data[0].user_id,
          date: data[0].date,
          category: data[0].category as Category,
          totalQuestions: data[0].total_questions,
          correctAnswers: data[0].correct_answers,
          timeSpent: data[0].time_spent
        };
        
        setQuizResults([formattedResult, ...quizResults]);
        
        // Update study metrics
        await updateStudyMetrics(result.category, result.timeSpent, result.totalQuestions, result.correctAnswers);
      }
    } catch (error: any) {
      console.error('Error adding quiz result:', error);
      toast.error('Failed to save quiz result');
    }
  };

  const updateStudyMetrics = async (
    category: Category, 
    timeSpent: number, 
    cardsReviewed: number, 
    correctAnswers: number
  ) => {
    if (!user) return;

    try {
      // Check if metrics for this category exist
      const { data, error } = await supabase
        .from('study_metrics')
        .select('*')
        .eq('user_id', user.id)
        .eq('category', category)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw error;
      }

      const newAccuracy = correctAnswers / cardsReviewed;

      if (data) {
        // Update existing metrics
        const totalCards = data.cards_reviewed + cardsReviewed;
        const weightedAccuracy = (
          (data.average_accuracy * data.cards_reviewed) + 
          (newAccuracy * cardsReviewed)
        ) / totalCards;

        await supabase
          .from('study_metrics')
          .update({
            total_study_time: data.total_study_time + timeSpent,
            cards_reviewed: totalCards,
            average_accuracy: weightedAccuracy,
            last_study_date: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id);
      } else {
        // Create new metrics
        await supabase
          .from('study_metrics')
          .insert([{
            user_id: user.id,
            category,
            total_study_time: timeSpent,
            cards_reviewed: cardsReviewed,
            average_accuracy: newAccuracy,
            last_study_date: new Date().toISOString()
          }]);
      }
    } catch (error: any) {
      console.error('Error updating study metrics:', error);
    }
  };

  const getResultsByCategory = (category: Category): QuizResult[] => {
    return quizResults.filter((result) => result.category === category);
  };

  const createSharedDeck = async (deck: Omit<SharedDeck, "id" | "owner_id">) => {
    if (!user) {
      toast.error('You must be logged in to create shared decks');
      return;
    }

    try {
      const newDeck = {
        ...deck,
        owner_id: user.id
      };

      const { data, error } = await supabase
        .from('shared_decks')
        .insert([newDeck])
        .select();

      if (error) throw error;
      
      if (data && data[0]) {
        const typedDeck = {
          ...data[0],
          category: data[0].category as Category
        };
        setSharedDecks([typedDeck, ...sharedDecks]);
        toast.success('Deck created successfully');
      }
    } catch (error: any) {
      console.error('Error creating shared deck:', error);
      toast.error('Failed to create shared deck');
    }
  };

  const addFlashcardToDeck = async (deckId: string, flashcardId: string) => {
    if (!user) {
      toast.error('You must be logged in to add flashcards to a deck');
      return;
    }

    try {
      const { error } = await supabase
        .from('shared_deck_flashcards')
        .insert([{
          deck_id: deckId,
          flashcard_id: flashcardId
        }]);

      if (error) throw error;
      
      toast.success('Flashcard added to deck');
    } catch (error: any) {
      console.error('Error adding flashcard to deck:', error);
      toast.error('Failed to add flashcard to deck');
    }
  };

  const removeFlashcardFromDeck = async (deckId: string, flashcardId: string) => {
    if (!user) {
      toast.error('You must be logged in to remove flashcards from a deck');
      return;
    }

    try {
      const { error } = await supabase
        .from('shared_deck_flashcards')
        .delete()
        .eq('deck_id', deckId)
        .eq('flashcard_id', flashcardId);

      if (error) throw error;
      
      toast.success('Flashcard removed from deck');
    } catch (error: any) {
      console.error('Error removing flashcard from deck:', error);
      toast.error('Failed to remove flashcard from deck');
    }
  };

  const getSharedDecksByCategory = (category: Category): SharedDeck[] => {
    return sharedDecks.filter((deck) => deck.category === category);
  };

  const getSharedDeckById = async (id: string): Promise<SharedDeck | null> => {
    try {
      // Get the deck
      const { data: deckData, error: deckError } = await supabase
        .from('shared_decks')
        .select('*')
        .eq('id', id)
        .single();

      if (deckError) throw deckError;
      if (!deckData) return null;

      // Get flashcards associated with the deck
      const { data: flashcardLinks, error: linksError } = await supabase
        .from('shared_deck_flashcards')
        .select('flashcard_id')
        .eq('deck_id', id);

      if (linksError) throw linksError;

      if (flashcardLinks && flashcardLinks.length > 0) {
        const flashcardIds = flashcardLinks.map(link => link.flashcard_id);
        
        const { data: flashcardsData, error: flashcardsError } = await supabase
          .from('flashcards')
          .select('*')
          .in('id', flashcardIds);

        if (flashcardsError) throw flashcardsError;
        
        // Map the flashcards to ensure category is of type Category
        const typedFlashcards = flashcardsData?.map(card => ({
          ...card,
          category: card.category as Category
        })) || [];
        
        return {
          ...deckData,
          category: deckData.category as Category,
          flashcards: typedFlashcards
        };
      }

      return {
        ...deckData,
        category: deckData.category as Category,
        flashcards: []
      };
    } catch (error: any) {
      console.error('Error fetching shared deck:', error);
      toast.error('Failed to load shared deck');
      return null;
    }
  };

  const updateSharedDeck = async (deck: SharedDeck) => {
    if (!user) {
      toast.error('You must be logged in to update decks');
      return;
    }

    try {
      const { error } = await supabase
        .from('shared_decks')
        .update({
          name: deck.name,
          description: deck.description,
          category: deck.category,
          is_public: deck.is_public,
          updated_at: new Date().toISOString()
        })
        .eq('id', deck.id);

      if (error) throw error;
      
      setSharedDecks(
        sharedDecks.map((d) => (d.id === deck.id ? deck : d))
      );
      
      toast.success('Deck updated successfully');
    } catch (error: any) {
      console.error('Error updating deck:', error);
      toast.error('Failed to update deck');
    }
  };

  const deleteSharedDeck = async (id: string) => {
    if (!user) {
      toast.error('You must be logged in to delete decks');
      return;
    }

    try {
      const { error } = await supabase
        .from('shared_decks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSharedDecks(sharedDecks.filter((deck) => deck.id !== id));
      toast.success('Deck deleted successfully');
    } catch (error: any) {
      console.error('Error deleting deck:', error);
      toast.error('Failed to delete deck');
    }
  };

  const value = {
    flashcards,
    isLoading,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    getFlashcardsByCategory,
    quizResults,
    addQuizResult,
    getResultsByCategory,
    sharedDecks,
    createSharedDeck,
    addFlashcardToDeck,
    removeFlashcardFromDeck,
    getSharedDecksByCategory,
    getSharedDeckById,
    updateSharedDeck,
    deleteSharedDeck
  };

  return <FlashcardContext.Provider value={value}>{children}</FlashcardContext.Provider>;
};
