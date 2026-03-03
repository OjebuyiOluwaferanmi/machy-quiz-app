import React, { createContext, useContext, useState, useEffect } from "react";

// --- TYPES ---
export interface User {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
}

export interface QuizSettings {
  category: string;
  categoryName: string;
  amount: number;
  difficulty: string;
  type: string;
  timelimit: number;
}

export interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: string[];
  userAnswer?: string;
  isFlagged?: boolean;
}

export interface QuizSession {
  id: string;
  date: string;
  category: string;
  difficulty: string;
  type: string;
  timeLimit: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  unattempted: number;
  score: string;
  grade: string;
  percentage: number;
}

interface QuizContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  quizSettings: QuizSettings | null;
  setQuizSettings: (settings: QuizSettings) => void;
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  isQuizActive: boolean;
  setIsQuizActive: (active: boolean) => void;
  updateAnswer: (index: number, answer: string) => void;
  toggleFlag: (index: number) => void;
  sessions: QuizSession[];
  addSession: (session: QuizSession) => void;
  deleteSession: (id: string) => void;
  streak: number;
  logout: () => void;
}

const QuizContext = createContext<QuizContextType | null>(null);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("mickqz_user");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const [quizSettings, setQuizSettingsState] = useState<QuizSettings | null>(null);
  const [questions, setQuestionsState] = useState<Question[]>([]);
  const [isQuizActive, setIsQuizActive] = useState(false);

  const [sessions, setSessions] = useState<QuizSession[]>(() => {
    try {
      const stored = localStorage.getItem("mickqz_sessions");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const [streak, setStreak] = useState<number>(0);

  // Compute streak from sessions
  useEffect(() => {
    if (sessions.length === 0) { setStreak(0); return; }
    const dates = sessions.map((s) => s.date.split("T")[0]);
    const unique = [...new Set(dates)].sort((a, b) => (a > b ? -1 : 1));
    let count = 0;
    const today = new Date();
    for (let i = 0; i < unique.length; i++) {
      const expected = new Date(today);
      expected.setDate(today.getDate() - i);
      const expectedStr = expected.toISOString().split("T")[0];
      if (unique[i] === expectedStr) count++;
      else break;
    }
    setStreak(count);
  }, [sessions]);

  const setUser = React.useCallback((u: User | null) => {
    setUserState(u);
    if (u) localStorage.setItem("mickqz_user", JSON.stringify(u));
    else localStorage.removeItem("mickqz_user");
  }, []);

  const setQuizSettings = React.useCallback((settings: QuizSettings) => {
    setQuizSettingsState(settings);
  }, []);

  const setQuestions = React.useCallback((qs: Question[]) => {
    setQuestionsState(qs);
  }, []);

  const updateAnswer = React.useCallback((index: number, answer: string) => {
    setQuestionsState((prev) =>
      prev.map((q, i) => (i === index ? { ...q, userAnswer: answer } : q))
    );
  }, []);

  const toggleFlag = React.useCallback((index: number) => {
    setQuestionsState((prev) =>
      prev.map((q, i) => (i === index ? { ...q, isFlagged: !q.isFlagged } : q))
    );
  }, []);

  const addSession = (session: QuizSession) => {
    setSessions((prev) => {
      const updated = [session, ...prev];
      localStorage.setItem("mickqz_sessions", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      localStorage.setItem("mickqz_sessions", JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setUserState(null);
    setQuizSettingsState(null);
    setQuestionsState([]);
    setIsQuizActive(false);
    localStorage.removeItem("mickqz_user");
  };

  return (
    <QuizContext.Provider
      value={{
        user, setUser, isLoggedIn: !!user,
        quizSettings, setQuizSettings,
        questions, setQuestions,
        isQuizActive, setIsQuizActive,
        updateAnswer, toggleFlag,
        sessions, addSession, deleteSession,
        streak,
        logout,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used inside QuizProvider");
  return ctx;
}
