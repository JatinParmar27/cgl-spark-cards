import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import { FlashcardForm } from "./pages/FlashcardForm";
import { StudySession } from "./pages/StudySession";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/FlashcardForm"
              element={
                <FlashcardForm
                  onSubmit={function (data: {
                    question: string;
                    answer: string;
                    subject: string;
                    tags: string[];
                    difficulty: "easy" | "medium" | "hard";
                  }): void | Promise<void> {
                    throw new Error("Function not implemented.");
                  }}
                  onCancel={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              }
            />
            <Route
              path="/StudySession"
              element={
                <StudySession
                  flashcards={[]}
                  onComplete={function (results: {
                    correct: number;
                    total: number;
                    timeSpent: number;
                  }): void {
                    throw new Error("Function not implemented.");
                  }}
                  onExit={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
