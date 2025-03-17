
import React, { useState } from "react";
import { Check, Edit, RotateCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Flashcard } from "@/context/FlashcardContext";
import { getTimeAgo } from "@/lib/helpers";

interface FlashcardItemProps {
  flashcard: Flashcard;
  onEdit?: (flashcard: Flashcard) => void;
  onCorrect?: (flashcard: Flashcard) => void;
  onIncorrect?: (flashcard: Flashcard) => void;
  quizMode?: boolean;
}

const FlashcardItem: React.FC<FlashcardItemProps> = ({
  flashcard,
  onEdit,
  onCorrect,
  onIncorrect,
  quizMode = false,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(flashcard);
  };

  const handleCorrect = () => {
    if (onCorrect) onCorrect(flashcard);
  };

  const handleIncorrect = () => {
    if (onIncorrect) onIncorrect(flashcard);
  };

  return (
    <div className="h-[300px] w-full max-w-md mx-auto" onClick={handleFlip}>
      <div className={`flashcard ${isFlipped ? "flipped" : ""}`}>
        <Card className="flashcard-front flex flex-col justify-between p-6 cursor-pointer bg-gradient-to-b from-blue-100/70 to-purple-100/80 backdrop-blur-sm border-0 shadow-md">
          <div className="flex justify-between items-start">
            <div className="text-xs text-muted-foreground">
              {flashcard.last_reviewed && (
                <span>Last reviewed: {getTimeAgo(flashcard.last_reviewed)}</span>
              )}
            </div>
            {!quizMode && (
              <Button variant="ghost" size="icon" onClick={handleEdit}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex-1 flex items-center justify-center text-center py-6">
            <h3 className="text-xl font-medium">{flashcard.question}</h3>
          </div>
          
          <div className="flex justify-center w-full">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-white/50 hover:bg-white/80 border-slate-200"
              onClick={(e) => {
                e.stopPropagation();
                handleFlip();
              }}
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>Flip Card</span>
            </Button>
          </div>
        </Card>
        
        <Card className="flashcard-back flex flex-col justify-between p-6 cursor-pointer bg-gradient-to-b from-amber-50 to-orange-100/40 backdrop-blur-sm border-0 shadow-md">
          <div className="flex justify-between items-start">
            <div className="text-xs text-muted-foreground">
              {flashcard.times_reviewed !== undefined && (
                <span>
                  Success rate:{" "}
                  {flashcard.times_reviewed > 0
                    ? Math.round(
                        ((flashcard.times_correct || 0) / flashcard.times_reviewed) * 100
                      )
                    : 0}
                  %
                </span>
              )}
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center text-center py-6">
            <p>{flashcard.answer}</p>
          </div>
          
          {quizMode ? (
            <div className="flex justify-center items-center gap-3 w-full">
              <Button
                variant="outline"
                size="sm"
                className="border-red-500/20 hover:bg-red-500/10 hover:text-red-600 flex items-center gap-1 bg-white/50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleIncorrect();
                }}
              >
                <X className="h-3.5 w-3.5" />
                <span>Got it wrong</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-green-500/20 hover:bg-green-500/10 hover:text-green-600 flex items-center gap-1 bg-white/50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCorrect();
                }}
              >
                <Check className="h-3.5 w-3.5" />
                <span>Got it right</span>
              </Button>
            </div>
          ) : (
            <div className="flex justify-center w-full">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 bg-white/50 hover:bg-white/80 border-slate-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlip();
                }}
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>Flip Card</span>
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default FlashcardItem;
