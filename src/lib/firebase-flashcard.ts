import { db } from "@/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  setDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

interface FlashcardData {
  question: string;
  answer: string;
  subject: string;
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  createdAt?: Date;
}

const flashcardsRef = collection(db, "flashcards");

export const createFlashcard = async (data: {
  question: string;
  answer: string;
  subject: string;
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
}) => {
  const docRef = await addDoc(collection(db, "flashcards"), {
    ...data,
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    createdAt: new Date(), // OR return serverTimestamp() if you prefer
  };
};

export const getFlashcards = async () => {
  const q = query(collection(db, "flashcards"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      question: data.question,
      answer: data.answer,
      subject: data.subject,
      tags: data.tags,
      difficulty: data.difficulty,
      createdAt: data.createdAt?.toDate?.() || new Date(),
    };
  });
};

export const updateFlashcard = async (
  id: string,
  updatedData: Omit<FlashcardData, "createdAt">
) => {
  try {
    const flashcardRef = doc(db, "flashcards", id);
    await updateDoc(flashcardRef, {
      ...updatedData,
      updatedAt: new Date(),
    });
    console.log(`Flashcard ${id} updated successfully`);
  } catch (error) {
    console.error("Error updating flashcard:", error);
    throw error;
  }
};

export const deleteFlashcard = async (id: string) => {
  try {
    const flashcardRef = doc(db, "flashcards", id);
    await deleteDoc(flashcardRef);
    console.log(`Flashcard ${id} deleted successfully`);
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    throw error;
  }
};
