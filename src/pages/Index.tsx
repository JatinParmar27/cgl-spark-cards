import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import {
  Plus,
  BookOpen,
  Search,
  Moon,
  Sun,
  Play,
  BarChart3,
  Filter,
  GraduationCap,
} from "lucide-react";

import { Flashcard } from "@/components/Flashcard";
import { FlashcardForm } from "@/components/FlashcardForm";
import { SubjectFilter } from "@/components/SubjectFilter";
import { ProgressTracker } from "@/components/ProgressTracker";
import { StudySession } from "@/components/StudySession";
// import Router, { useRouter } from "next/router";

import {
  createFlashcard,
  deleteFlashcard,
  getFlashcards,
  updateFlashcard,
} from "@/lib/firebase-flashcard";
import { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

interface FlashcardData {
  id: string;
  question: string;
  answer: string;
  subject: string;
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  createdAt: Timestamp | Date;
}

const Index = () => {
  const { theme, setTheme } = useTheme();
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [filteredCards, setFilteredCards] = useState<FlashcardData[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showStudySession, setShowStudySession] = useState(false);
  const [editingCard, setEditingCard] = useState<FlashcardData | null>(null);
  const [currentView, setCurrentView] = useState<
    "library" | "study" | "progress"
  >("library");

  const navigate = useNavigate();

  // Sample data for demonstration
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const data = await getFlashcards();
        setFlashcards(data);
      } catch (error) {
        console.error("Failed to load flashcards:", error);
      }
    };

    fetchCards();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = flashcards;

    if (selectedSubjects.length > 0) {
      filtered = filtered.filter((card) =>
        selectedSubjects.includes(card.subject)
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (card) =>
          card.question.toLowerCase().includes(query) ||
          card.answer.toLowerCase().includes(query) ||
          card.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    setFilteredCards(filtered);
  }, [flashcards, selectedSubjects, searchQuery]);

  const subjects = Array.from(new Set(flashcards.map((card) => card.subject)));

  const handleCreateCard = async (
    cardData: Omit<FlashcardData, "id" | "createdAt">
  ) => {
    try {
      const saved = await createFlashcard(cardData);

      const newCard: FlashcardData = {
        ...cardData,
        id: saved.id,
        createdAt: saved.createdAt, // already a Date
      };

      setFlashcards((prev) => [newCard, ...prev]);
      setShowForm(false);
    } catch (err) {
      console.error("Error creating card:", err);
    }
  };

  const handleEditCard = async (
    cardData: Omit<FlashcardData, "id" | "createdAt">
  ) => {
    if (editingCard) {
      try {
        const updatedCard: FlashcardData = {
          ...editingCard,
          ...cardData,
        };

        // Assuming you have an `updateFlashcard` method in firebase-flashcard.ts
        await updateFlashcard(updatedCard.id, cardData);

        setFlashcards((prev) =>
          prev.map((card) => (card.id === updatedCard.id ? updatedCard : card))
        );

        setEditingCard(null);
        setShowForm(false);
      } catch (err) {
        console.error("Error updating flashcard:", err);
      }
    }
  };

  const handleDeleteCard = async (id: string) => {
    try {
      await deleteFlashcard(id);
      setFlashcards((prev) => prev.filter((card) => card.id !== id));
    } catch (error) {
      console.error("Failed to delete card:", error);
    }
  };

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleStudyComplete = (results: {
    correct: number;
    total: number;
    timeSpent: number;
  }) => {
    setShowStudySession(false);
    setCurrentView("progress");
    // Here you would typically save the study session results
  };

  const progressStats = {
    totalCards: flashcards.length,
    studiedToday: 12,
    correctAnswers: 8,
    totalAttempts: 12,
    streakDays: 5,
    timeSpent: 45,
  };

  if (showStudySession) {
    return (
      <div className="min-h-screen bg-background p-4">
        <StudySession
          flashcards={filteredCards.length > 0 ? filteredCards : flashcards}
          onComplete={handleStudyComplete}
          onExit={() => setShowStudySession(false)}
        />
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto py-8">
          <FlashcardForm
            onSubmit={editingCard ? handleEditCard : handleCreateCard}
            onCancel={() => {
              setShowForm(false);
              setEditingCard(null);
            }}
            initialData={
              editingCard
                ? {
                    question: editingCard.question,
                    answer: editingCard.answer,
                    subject: editingCard.subject,
                    tags: editingCard.tags,
                    difficulty: editingCard.difficulty,
                  }
                : undefined
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="hero-gradient border-b border-border/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">
                  SSC CGL Flashcards
                </h1>
                <p className="text-sm text-muted-foreground">
                  Smart study for government exams
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-2">
                <Button
                  variant={currentView === "library" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("library")}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Library
                </Button>
                <Button
                  variant={currentView === "progress" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("progress")}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Progress
                </Button>
              </nav>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {currentView === "progress" ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gradient mb-2">
                Your Progress
              </h2>
              <p className="text-muted-foreground">
                Track your learning journey
              </p>
            </div>
            <ProgressTracker stats={progressStats} />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search flashcards..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => navigate("/StudySession")}
                  className="study-button"
                  disabled={
                    filteredCards.length === 0 && flashcards.length === 0
                  }
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Study Session
                </Button>
                <Button
                  onClick={() => navigate("FlashcardForm")}
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Card
                </Button>
              </div>
            </div>

            {/* Filters */}
            {subjects.length > 0 && (
              <Card className="flashcard">
                <CardContent className="p-6">
                  <SubjectFilter
                    subjects={subjects}
                    selectedSubjects={selectedSubjects}
                    onSubjectToggle={handleSubjectToggle}
                    onClearFilters={() => setSelectedSubjects([])}
                  />
                </CardContent>
              </Card>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="flashcard">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {flashcards.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Cards
                  </div>
                </CardContent>
              </Card>
              <Card className="flashcard">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-secondary">
                    {subjects.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Subjects</div>
                </CardContent>
              </Card>
              <Card className="flashcard">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-accent">
                    {filteredCards.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Filtered Results
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Flashcards Grid */}
            {filteredCards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCards.map((card) => (
                  <Flashcard
                    key={card.id}
                    id={card.id}
                    question={card.question}
                    answer={card.answer}
                    subject={card.subject}
                    tags={card.tags}
                    difficulty={card.difficulty}
                    onEdit={(id) => {
                      const cardToEdit = flashcards.find((c) => c.id === id);
                      if (cardToEdit) {
                        setEditingCard(cardToEdit);
                        setShowForm(true);
                      }
                    }}
                    onDelete={handleDeleteCard}
                  />
                ))}
              </div>
            ) : (
              <Card className="flashcard">
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-xl font-semibold mb-2">
                    No flashcards found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {flashcards.length === 0
                      ? "Create your first flashcard to get started!"
                      : "Try adjusting your search or filter criteria."}
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="study-button"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Flashcard
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
