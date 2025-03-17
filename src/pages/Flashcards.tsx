
import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Plus, Search, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import FlashcardItem from "@/components/FlashcardItem";
import FlashcardForm from "@/components/FlashcardForm";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useFlashcards, Category, Flashcard } from "@/context/FlashcardContext";
import { toast } from "sonner";
import { getCategoryName } from "@/lib/helpers";

const Flashcards = () => {
  const { category } = useParams<{ category?: Category }>();
  const navigate = useNavigate();
  const { 
    flashcards, 
    getFlashcardsByCategory, 
    addFlashcard, 
    updateFlashcard, 
    deleteFlashcard 
  } = useFlashcards();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>("newest");
  
  const filteredFlashcards = category
    ? getFlashcardsByCategory(category as Category)
    : flashcards;
  
  const searchedFlashcards = filteredFlashcards.filter(
    (card) =>
      card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const sortedFlashcards = [...searchedFlashcards].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.lastReviewed || "").getTime() - new Date(a.lastReviewed || "").getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.lastReviewed || "").getTime() - new Date(b.lastReviewed || "").getTime();
    } else if (sortBy === "mastery-high") {
      const aRate = a.timesReviewed 
        ? (a.timesCorrect || 0) / a.timesReviewed 
        : 0;
      const bRate = b.timesReviewed 
        ? (b.timesCorrect || 0) / b.timesReviewed 
        : 0;
      return bRate - aRate;
    } else if (sortBy === "mastery-low") {
      const aRate = a.timesReviewed 
        ? (a.timesCorrect || 0) / a.timesReviewed 
        : 0;
      const bRate = b.timesReviewed 
        ? (b.timesCorrect || 0) / b.timesReviewed 
        : 0;
      return aRate - bRate;
    }
    return 0;
  });

  const handleCreateFlashcard = (data: Omit<Flashcard, "id">) => {
    addFlashcard(data);
    setIsFormOpen(false);
    toast.success("Flashcard created successfully");
  };

  const handleUpdateFlashcard = (data: Omit<Flashcard, "id">) => {
    if (editingFlashcard) {
      updateFlashcard({
        ...editingFlashcard,
        ...data,
      });
      setEditingFlashcard(undefined);
      toast.success("Flashcard updated successfully");
    }
  };

  const handleEditFlashcard = (flashcard: Flashcard) => {
    setEditingFlashcard(flashcard);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingFlashcard(undefined);
  };

  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      navigate("/flashcards");
    } else {
      navigate(`/flashcards/${value}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title={category ? getCategoryName(category as Category) : "All Flashcards"} 
        showBackButton={true} 
      />
      
      <main className="container py-8 px-4 md:px-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Select
              value={category || "all"}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="fullstack">{getCategoryName("fullstack")}</SelectItem>
                <SelectItem value="appdev">{getCategoryName("appdev")}</SelectItem>
                <SelectItem value="python">{getCategoryName("python")}</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="mastery-high">Highest Mastery</SelectItem>
                <SelectItem value="mastery-low">Lowest Mastery</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search flashcards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full sm:w-[300px]"
              />
            </div>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
        
        {sortedFlashcards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-muted rounded-full p-6 mb-4">
              <Sliders className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No flashcards found</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              {searchQuery
                ? "No flashcards match your search criteria. Try a different search term."
                : "You don't have any flashcards in this category yet. Create your first one!"}
            </p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Flashcard
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFlashcards.map((flashcard) => (
              <FlashcardItem
                key={flashcard.id}
                flashcard={flashcard}
                onEdit={handleEditFlashcard}
              />
            ))}
          </div>
        )}
      </main>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogTitle>
            {editingFlashcard ? "Edit Flashcard" : "Create New Flashcard"}
          </DialogTitle>
          <FlashcardForm
            initialData={editingFlashcard}
            onSubmit={editingFlashcard ? handleUpdateFlashcard : handleCreateFlashcard}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingFlashcard} onOpenChange={(open) => !open && setEditingFlashcard(undefined)}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogTitle>Edit Flashcard</DialogTitle>
          {editingFlashcard && (
            <FlashcardForm
              initialData={editingFlashcard}
              onSubmit={handleUpdateFlashcard}
              onCancel={() => setEditingFlashcard(undefined)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Flashcards;
