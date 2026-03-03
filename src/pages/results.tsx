import Navigation from "@/components/Navigation";
import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useQuiz } from "@/context/QuizConext";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY } from "@/lib/emailjs";
import Confetti from "react-confetti";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

// module-level flag to survive StrictMode mount/unmount cycles
export let hasSentResults = false;
export const resetHasSentResults = () => { hasSentResults = false; };

export default function Results() {
  const navigate = useNavigate();
  const { user, quizSettings, questions, addSession, setIsQuizActive } = useQuiz();
  const [saved, setSaved] = React.useState(false);
  const [showReview, setShowReview] = React.useState(false);

  // Compute results
  const totalQuestions = questions.length;
  const correct = questions.filter((q) => q.userAnswer === q.correct_answer).length;
  const attempted = questions.filter((q) => q.userAnswer).length;
  const unattempted = totalQuestions - attempted;
  const percentage = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;

  const getGrade = () => {
    if (percentage >= 80) return { grade: "A", color: "text-green-600", message: "Excellent!" };
    if (percentage >= 60) return { grade: "B", color: "text-blue-600", message: "Good Job!" };
    if (percentage >= 40) return { grade: "C", color: "text-yellow-600", message: "Not Bad!" };
    return { grade: "F", color: "text-red-600", message: "Keep Trying!" };
  };

  const { grade, color, message } = getGrade();

  const timeLimitLabel = () => {
    const t = quizSettings?.timelimit ?? 0;
    if (t < 60) return `${t} minutes`;
    const h = Math.floor(t / 60);
    const m = t % 60;
    return m > 0 ? `${h}h ${m}m` : `${h} hour${h > 1 ? "s" : ""}`;
  };

  const typeLabel = quizSettings?.type === "multiple" ? "Multiple Choice" : "True / False";
  const difficultyLabel = quizSettings?.difficulty
    ? quizSettings.difficulty.charAt(0).toUpperCase() + quizSettings.difficulty.slice(1)
    : "";

  // Save result once
  React.useEffect(() => {
    if (saved || hasSentResults || !quizSettings || totalQuestions === 0) return;
    setSaved(true);
    hasSentResults = true;
    setIsQuizActive(false);

    const session = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      category: quizSettings.categoryName,
      difficulty: difficultyLabel,
      type: typeLabel,
      timeLimit: timeLimitLabel(),
      totalQuestions,
      attempted,
      correct,
      unattempted,
      score: `${correct}/${totalQuestions}`,
      grade,
      percentage,
    };

    // Save to localStorage
    addSession(session);

    // Save to Firebase
    addDoc(collection(db, "quiz_results"), {
      sessionId: session.id,
      date: session.date,
      category: quizSettings?.categoryName ?? null,
      difficulty: difficultyLabel,
      type: typeLabel,
      timeLimit: timeLimitLabel(),
      totalQuestions,
      attempted,
      correct,
      unattempted,
      score: `${correct}/${totalQuestions}`,
      grade,
      percentage,
      firstname: user?.firstname ?? null,
      lastname: user?.lastname ?? null,
      username: user?.username ?? null,
      email: user?.email ?? null,
    }).catch(console.error);

    // Send email via EmailJS
    emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        name: user?.username ?? `${user?.firstname} ${user?.lastname}`,
        email: user?.email,
        category: quizSettings.categoryName,
        difficulty: difficultyLabel,
        score: `${correct}/${totalQuestions}`,
        grade,
        correct,
        unattempted,
        total: totalQuestions,
        date: new Date().toLocaleDateString(),
      },
      EMAILJS_PUBLIC_KEY
    ).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      {grade === "A" && <Confetti recycle={false} numberOfPieces={400} />}
      <div className="flex flex-col items-center justify-center px-4 py-10">

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-black mb-2">Quiz <span className="text-blue-700">Results</span></h1>
          <p className="text-gray-600 text-lg">Here&apos;s how you did, {user?.username || user?.firstname}!</p>
        </div>

        <div className="w-full max-w-2xl flex flex-col gap-6">

          {/* Score Card */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center gap-2">
            <p className="text-gray-600 font-medium">Your Score</p>
            <p className={`text-8xl font-bold ${color}`}>{grade}</p>
            <p className={`text-2xl font-bold ${color}`}>{message}</p>
            <p className="text-black text-lg font-semibold mt-2">
              {correct} / {totalQuestions} correct ({percentage}%)
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 backdrop-blur-sm border border-gray-100 shadow-sm rounded-2xl p-5">
              <p className="text-gray-500 text-sm font-medium">Category</p>
              <p className="text-black font-bold text-lg mt-1">{quizSettings?.categoryName}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-gray-100 shadow-sm rounded-2xl p-5">
              <p className="text-gray-500 text-sm font-medium">Total Questions</p>
              <p className="text-black font-bold text-lg mt-1">{totalQuestions}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-gray-100 shadow-sm rounded-2xl p-5">
              <p className="text-gray-500 text-sm font-medium">Difficulty</p>
              <p className="text-black font-bold text-lg mt-1">{difficultyLabel}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-gray-100 shadow-sm rounded-2xl p-5">
              <p className="text-gray-500 text-sm font-medium">Question Type</p>
              <p className="text-black font-bold text-lg mt-1">{typeLabel}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-gray-100 shadow-sm rounded-2xl p-5">
              <p className="text-gray-500 text-sm font-medium">Time Limit</p>
              <p className="text-black font-bold text-lg mt-1">{timeLimitLabel()}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-gray-100 shadow-sm rounded-2xl p-5">
              <p className="text-gray-500 text-sm font-medium">Attempted</p>
              <p className="text-black font-bold text-lg mt-1">{attempted}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-gray-100 shadow-sm rounded-2xl p-5">
              <p className="text-gray-500 text-sm font-medium">Correct Answers</p>
              <p className="text-green-900 font-bold text-lg mt-1">{correct} / {totalQuestions}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-gray-100 shadow-sm rounded-2xl p-5">
              <p className="text-gray-500 text-sm font-medium">Unattempted</p>
              <p className="text-red-500 font-bold text-lg mt-1">{unattempted}</p>
            </div>
          </div>

          {/* Answer Review Toggle */}
          <Button
            className="bg-blue-700 text-white border border-blue-700 font-semibold w-full hover:bg-blue-800"
            size="lg"
            onPress={() => setShowReview((v) => !v)}
          >
            {showReview ? "Hide Answer Review" : "Review Answers"}
          </Button>

          {/* Answer Review Section */}
          {showReview && (
            <div className="flex flex-col gap-4">
              {questions.map((q, i) => {
                const isCorrect = q.userAnswer === q.correct_answer;
                const isSkipped = !q.userAnswer;
                return (
                  <div key={i} className={`bg-white/20 backdrop-blur-sm rounded-2xl p-5 shadow-md border-l-4 ${isSkipped ? "border-gray-400" : isCorrect ? "border-green-500" : "border-red-500"}`}>
                    <p className="text-black font-semibold mb-3">{i + 1}. {q.question}</p>
                    <div className="flex flex-col gap-1 text-sm">
                      {q.all_answers.map((ans, j) => {
                        const isThisCorrect = ans === q.correct_answer;
                        const isUserPick = ans === q.userAnswer;
                        return (
                          <div
                            key={j}
                            className={`px-3 py-1.5 rounded-lg font-medium ${
                              isThisCorrect
                                ? "bg-green-100 text-green-800"
                                : isUserPick && !isCorrect
                                ? "bg-red-100 text-red-800"
                                : "text-gray-600"
                            }`}
                          >
                            {ans}
                            {isThisCorrect && (
                              <FontAwesomeIcon icon={faCheck} className="text-green-500 ml-2" />
                            )}
                            {isUserPick && !isCorrect && (
                              <FontAwesomeIcon icon={faXmark} className="text-red-500 ml-2" />
                            )}
                          </div>
                        );
                      })}
                      {isSkipped && <p className="text-gray-500 italic mt-1">You skipped this question</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button className="bg-white text-blue-700 border border-blue-700 font-semibold w-full hover:bg-blue-700 hover:text-white" size="lg" onPress={() => navigate("/quizzes")}>
              My Quizzes
            </Button>
            <Button className="bg-white text-blue-700 border border-blue-700 font-semibold w-full hover:bg-blue-700 hover:text-white" size="lg" onPress={() => navigate("/welcome")}>
              New Quiz
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
