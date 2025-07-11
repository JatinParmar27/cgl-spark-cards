import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Filter } from "lucide-react";

interface SubjectFilterProps {
  subjects: string[];
  selectedSubjects: string[];
  onSubjectToggle: (subject: string) => void;
  onClearFilters: () => void;
}

export const SubjectFilter = ({ 
  subjects, 
  selectedSubjects, 
  onSubjectToggle, 
  onClearFilters 
}: SubjectFilterProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Filter by Subject</h3>
        </div>
        {selectedSubjects.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {subjects.map((subject) => {
          const isSelected = selectedSubjects.includes(subject);
          return (
            <Badge
              key={subject}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                isSelected 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-primary/10 hover:border-primary/30"
              }`}
              onClick={() => onSubjectToggle(subject)}
            >
              <BookOpen className="w-3 h-3 mr-1" />
              {subject}
            </Badge>
          );
        })}
      </div>
      
      {selectedSubjects.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};