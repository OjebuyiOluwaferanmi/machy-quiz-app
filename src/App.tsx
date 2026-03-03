import { Route, Routes, Navigate } from "react-router-dom";
import { useQuiz } from "@/context/QuizConext";
import ProtectedRoute from "./components/ProtectedRoute";

import IndexPage from "@/pages/index";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Signup from "@/pages/signup";
import Welcome from "@/pages/welcome";
import Quiz from "@/pages/quiz";
import Results from "@/pages/results";
import Quizzes from "@/pages/quizzes";

function App() {
  const { isLoggedIn } = useQuiz();

  return (
    <Routes>
      {/* Public routes - redirect to /welcome if already logged in */}
      <Route path="/" element={isLoggedIn ? <Navigate to="/welcome" replace /> : <IndexPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/signup" element={isLoggedIn ? <Navigate to="/welcome" replace /> : <Signup />} />

      {/* Protected routes */}
      <Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
      <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
      <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
      <Route path="/quizzes" element={<ProtectedRoute><Quizzes /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
