
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Category } from "@/context/FlashcardContext";
import { getCategoryColor, getCategoryName } from "@/lib/helpers";

interface CategoryCardProps {
  category: Category;
  count: number;
  masteryPercentage: number;
}

const getCategoryImage = (category: Category): string => {
  switch (category) {
    case "fullstack":
      return "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
    case "appdev":
      return "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
    case "python":
      return "https://images.pexels.com/photos/1181359/pexels-photo-1181359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
    default:
      return "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
  }
};

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  count,
  masteryPercentage,
}) => {
  return (
    <Link to={`/flashcards/${category}`}>
      <Card className="category-card h-full group transition-all duration-300 hover:shadow-lg overflow-hidden border-0">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ backgroundImage: `url('${getCategoryImage(category)}')` }}
        />
        
        <CardHeader className="relative pb-2 z-20 text-white">
          <h3 className="text-xl font-medium drop-shadow-md">{getCategoryName(category)}</h3>
        </CardHeader>
        
        <CardContent className="relative pb-2 z-20 text-white">
          <div className="text-sm text-white/90">
            {count} {count === 1 ? "card" : "cards"}
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Mastery</span>
              <span className="font-medium">{masteryPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${masteryPercentage}%` }}
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="relative pt-2 z-20">
          <div className="flex items-center text-sm font-medium text-white gap-1 group-hover:gap-2 transition-all duration-300">
            <span>Study now</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CategoryCard;
