
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Category } from "@/context/FlashcardContext";
import { getCategoryColor, getCategoryIcon, getCategoryName } from "@/lib/helpers";

interface CategoryCardProps {
  category: Category;
  count: number;
  masteryPercentage: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  count,
  masteryPercentage,
}) => {
  return (
    <Link to={`/flashcards/${category}`}>
      <Card className="category-card h-full group transition-all duration-300 hover:shadow-lg">
        <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(category)} opacity-30`} />
        
        <CardHeader className="relative pb-2">
          <div className="text-4xl mb-2">{getCategoryIcon(category)}</div>
          <h3 className="text-xl font-medium">{getCategoryName(category)}</h3>
        </CardHeader>
        
        <CardContent className="relative pb-2">
          <div className="text-sm text-muted-foreground">
            {count} {count === 1 ? "card" : "cards"}
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Mastery</span>
              <span className="font-medium">{masteryPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${masteryPercentage}%` }}
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="relative pt-2">
          <div className="flex items-center text-sm font-medium text-primary gap-1 group-hover:gap-2 transition-all duration-300">
            <span>Study now</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CategoryCard;
