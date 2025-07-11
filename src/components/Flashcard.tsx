import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";

interface FlashcardProps {
  id: string;
  question: string;
  answer: string;
  subject: string;
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isStudyMode?: boolean;
}

export const Flashcard = ({ 
  id, 
  question, 
  answer, 
  subject, 
  tags, 
  difficulty, 
  onEdit, 
  onDelete, 
  isStudyMode = false 
}: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy": return "bg-secondary/20 text-secondary border-secondary/30";
      case "medium": return "bg-accent/20 text-accent border-accent/30";
      case "hard": return "bg-destructive/20 text-destructive border-destructive/30";
      default: return "bg-muted/20 text-muted-foreground border-border";
    }
  };

  return (
    <Card className="flashcard group relative h-80 w-full max-w-md mx-auto cursor-pointer" onClick={handleFlip}>
      <div className={`flashcard-flip h-full ${isFlipped ? 'flipped' : ''}`}>
        {/* Front Side - Question */}
        <div className="flashcard-front p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <Badge className="subject-badge">{subject}</Badge>
            <Badge className={`${getDifficultyColor(difficulty)} text-xs`}>
              {difficulty}
            </Badge>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Question</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{question}</p>
            </div>
          </div>

          {!isStudyMode && (
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="ghost"
                size="sm"
                className="card-action-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(id);
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="card-action-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Back Side - Answer */}
        <div className="flashcard-back p-6 flex flex-col h-full bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="flex items-center justify-between mb-4">
            <Badge className="subject-badge">{subject}</Badge>
            {tags.length > 0 && (
              <div className="flex gap-1">
                {tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-secondary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Answer</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">Click to flip back</p>
          </div>
        </div>
      </div>
    </Card>
  );
};