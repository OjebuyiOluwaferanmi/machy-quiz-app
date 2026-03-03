import React from "react";
import { Navigate } from "react-router-dom";
import { useQuiz } from "@/context/QuizConext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn } = useQuiz();

  // if the user is not authenticated, send them back to the home/landing page
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // otherwise render whatever was passed in
  return <>{children}</>;
}
