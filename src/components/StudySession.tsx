import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flashcard } from "./Flashcard";
import { CheckCircle, XCircle, RotateCcw, ArrowRight, Trophy } from "lucide-react";

interface StudySessionProps {
  flashcards: Array<{
    id: string;
    question: string;
    answer: string;
    subject: string;
    tags: string[];
    difficulty: "easy" | "medium" | "hard";
  }>;
  onComplete: (results: { correct: number; total: number; timeSpent: number }) => void;
  onExit: () => void;
}

export const StudySession = ({ flashcards, onComplete, onExit }: StudySessionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<("correct" | "incorrect" | null)[]>(
    new Array(flashcards.length).fill(null)
  );
  const [startTime] = useState(Date.now());
  const [sessionComplete, setSessionComplete] = useState(false);

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + (answers[currentIndex] !== null ? 1 : 0)) / flashcards.length) * 100;
  const correctAnswers = answers.filter(answer => answer === "correct").length;

  useEffect(() => {
    if (answers.every(answer => answer !== null)) {
      setSessionComplete(true);
    }
  }, [answers]);

  const handleAnswer = (isCorrect: boolean) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = isCorrect ? "correct" : "incorrect";
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleComplete = () => {
    const timeSpent = Math.round((Date.now() - startTime) / (1000 * 60)); // in minutes
    onComplete({
      correct: correctAnswers,
      total: flashcards.length,
      timeSpent
    });
  };

  const getScoreMessage = () => {
    const percentage = (correctAnswers / flashcards.length) * 100;
    if (percentage >= 90) return { message: "Excellent! 🏆", color: "text-secondary" };
    if (percentage >= 75) return { message: "Great job! 🎉", color: "text-primary" };
    if (percentage >= 60) return { message: "Good work! 👍", color: "text-accent" };
    return { message: "Keep practicing! 💪", color: "text-muted-foreground" };
  };

  if (sessionComplete) {
    const scoreMessage = getScoreMessage();
    const timeSpent = Math.round((Date.now() - startTime) / (1000 * 60));

    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <Card className="flashcard">
          <CardContent className="p-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-secondary" />
            </div>
            
            <h2 className="text-3xl font-bold text-gradient mb-2">
              Session Complete!
            </h2>
            
            <p className={`text-lg mb-6 ${scoreMessage.color}`}>
              {scoreMessage.message}
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {correctAnswers}
                </div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {flashcards.length}
                </div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {timeSpent}m
                </div>
                <div className="text-sm text-muted-foreground">Time</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="text-lg font-semibold">
                Score: {Math.round((correctAnswers / flashcards.length) * 100)}%
              </div>
              <Progress 
                value={(correctAnswers / flashcards.length) * 100} 
                className="h-3"
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex gap-4">
          <Button 
            onClick={handleComplete} 
            className="study-button flex-1"
          >
            Continue Learning
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Study Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="flashcard">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                Card {currentIndex + 1} of {flashcards.length}
              </Badge>
              <Badge className="subject-badge">
                {currentCard.subject}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={onExit}>
              Exit Session
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Progress: {Math.round(progress)}%</span>
            <span>Score: {correctAnswers}/{answers.filter(a => a !== null).length}</span>
          </div>
        </CardContent>
      </Card>

      {/* Current Flashcard */}
      <div className="flex justify-center">
        <Flashcard
          id={currentCard.id}
          question={currentCard.question}
          answer={currentCard.answer}
          subject={currentCard.subject}
          tags={currentCard.tags}
          difficulty={currentCard.difficulty}
          isStudyMode={true}
        />
      </div>

      {/* Answer Buttons */}
      <Card className="flashcard">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold mb-2">How well did you know this?</h3>
            <p className="text-sm text-muted-foreground">
              Click the card to see the answer, then rate your response
            </p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => handleAnswer(false)}
              variant="outline"
              className="flex-1 max-w-32 h-12 border-destructive/30 hover:bg-destructive/10"
              disabled={answers[currentIndex] !== null}
            >
              <XCircle className="w-4 h-4 mr-2 text-destructive" />
              Incorrect
            </Button>
            <Button
              onClick={() => handleAnswer(true)}
              variant="outline"
              className="flex-1 max-w-32 h-12 border-secondary/30 hover:bg-secondary/10"
              disabled={answers[currentIndex] !== null}
            >
              <CheckCircle className="w-4 h-4 mr-2 text-secondary" />
              Correct
            </Button>
          </div>
          
          {answers[currentIndex] !== null && (
            <div className="flex justify-between mt-6">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentIndex === flashcards.length - 1}
                className="study-button"
              >
                Next Card
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};