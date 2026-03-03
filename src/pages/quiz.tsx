import Navigation from "@/components/Navigation";
import { Button, RadioGroup, Radio, Progress, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Spinner } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useQuiz } from "@/context/QuizConext";

function decodeHTML(str: string) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function QuizPage() {
  const navigate = useNavigate();
  const { quizSettings, questions, setQuestions, setIsQuizActive, updateAnswer, toggleFlag } = useQuiz();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const totalQuestions = questions.length;

  // Timer
  const totalTime = (quizSettings?.timelimit ?? 10) * 60;
  const [timeLeft, setTimeLeft] = React.useState(totalTime);

  // Fetch questions from OpenTDB
  // we only ever want to request questions once per quizSettings change.
  // React StrictMode may mount/unmount twice in development, which would
  // trigger the effect a second time; we guard with a ref so the network
  // call is only made once.
  const didFetchRef = React.useRef(false);

  // reset the flag whenever settings change (so starting a new quiz works)
  React.useEffect(() => {
    didFetchRef.current = false;
  }, [quizSettings]);

  React.useEffect(() => {
    if (!quizSettings) {
      navigate("/welcome");
      return;
    }

    setIsQuizActive(true);

    if (didFetchRef.current) {
      // already fetched questions for these settings
      return;
    }
    didFetchRef.current = true;

    let cancelled = false;
    const controller = new AbortController();

    const fetchQuestions = async () => {
      try {
        setError("");
        setLoading(true);
        const { category, amount, difficulty, type } = quizSettings;
        const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`;
        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json();

        if (cancelled) return;

        if (data.response_code !== 0 || !data.results.length) {
          // if we've already managed to fetch a valid set of questions, keep
          // showing them; don't overwrite them with an error from a duplicate
          // or rate‑limited request.
          if (questions.length === 0) {
            setError(
              "Not enough questions available for your selection. Please go back and try different settings."
            );
            setLoading(false);
          }
          return;
        }

        const formatted = data.results.map((q: any) => {
          const allAnswers = shuffleArray([q.correct_answer, ...q.incorrect_answers]);
          return {
            question: decodeHTML(q.question),
            correct_answer: decodeHTML(q.correct_answer),
            incorrect_answers: q.incorrect_answers.map(decodeHTML),
            all_answers: allAnswers.map(decodeHTML),
            userAnswer: undefined,
            isFlagged: false,
          };
        });

        if (cancelled) return;
        setQuestions(formatted);
      } catch (err: any) {
        if (!cancelled) {
          if (err.name === "AbortError") {
            // aborted, ignore
          } else {
            setError(
              "Failed to fetch questions. Please check your internet connection and try again."
            );
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchQuestions();

    return () => {
      cancelled = true;
      controller.abort();
      // make sure loader doesn't hang if we abort before request finishes
      setLoading(false);
      // also allow a retry when StrictMode unmounts + remounts
      didFetchRef.current = false;
    };
  // only refetch when the quiz settings object changes or navigation
  // function changes (which is effectively never). the setter functions
  // we previously included were unstable and caused re-fetches when the
  // question array was updated, which in turn reset state and triggered
  // the loading screen on every answer select.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizSettings, navigate]);

  // Timer countdown
  React.useEffect(() => {
    if (loading || error) return;
    if (timeLeft <= 0) {
      setIsQuizActive(false);
      navigate("/results");
      return;
    }
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, loading, error]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const progressValue = Math.round((timeLeft / totalTime) * 100);
  const timerColor = () => {
    if (progressValue > 50) return "success";
    if (progressValue > 25) return "warning";
    return "danger";
  };

  const handleEndQuiz = () => {
    setIsQuizActive(false);
    navigate("/results");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex flex-col items-center justify-center" style={{ height: "calc(100vh - 64px)" }}>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-12 shadow-md flex flex-col items-center gap-4">
            <Spinner size="lg" color="primary" />
            <p className="text-black font-semibold text-lg">Loading questions...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex flex-col items-center justify-center" style={{ height: "calc(100vh - 64px)" }}>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-12 shadow-md flex flex-col items-center gap-4 max-w-md text-center">
            <p className="text-black font-bold text-lg">{error}</p>
            <Button className="bg-blue-700 text-white" onPress={() => { setIsQuizActive(false); navigate("/welcome"); }}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="flex flex-col items-center justify-center px-4 py-5 md:py-25">
        <div className="w-full max-w-2xl bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col gap-6">

          {/* Top Row - Question Count & Timer */}
          <div className="flex justify-between items-center">
            <div className="text-black px-4 py-2 rounded-xl font-semibold text-sm">
              Question {currentQuestion + 1} of {totalQuestions}
            </div>
            <div className="flex flex-col items-end gap-1 w-48">
              <span className={`text-sm font-bold ${progressValue <= 25 ? "text-red-600" : progressValue <= 50 ? "text-yellow-600" : "text-green-600"}`}>
                {formatTime(timeLeft)}
              </span>
              <Progress aria-label="Timer" value={progressValue} color={timerColor()} size="sm" className="w-full" />
            </div>
          </div>

          {/* Question + Flag Button */}
          <div className="flex justify-between items-start gap-2">
            <p className="text-black font-bold text-lg flex-1">
              {currentQuestion + 1}. {question.question}
            </p>
          </div>

          

          {/* Options */}
          <RadioGroup
            color="primary"
            value={question.userAnswer ?? ""}
            onValueChange={(val) => updateAnswer(currentQuestion, val)}
            className="flex flex-col gap-3"
          >
            {question.all_answers.map((answer, i) => (
              <Radio
                key={i}
                value={answer}
                classNames={{
                  control: "bg-blue-700",
                  wrapper: "border-blue-700/40 border-2",
                }}
              >
                {answer}
              </Radio>
            ))}
          </RadioGroup>
 
         
          {/* Previous & Next */}
          <div className="flex justify-between items-center">
            <Button
              className="bg-blue-700 text-white font-semibold"
              onPress={() => setCurrentQuestion((q) => Math.max(0, q - 1))}
              isDisabled={currentQuestion === 0}
            >
              ← Previous
            </Button>
            <Button
              className="bg-blue-700 text-white font-semibold"
              onPress={() => setCurrentQuestion((q) => Math.min(totalQuestions - 1, q + 1))}
              isDisabled={currentQuestion === totalQuestions - 1}
            >
              Next →
            </Button>
          </div>
          

           {/* Question dots navigation */}
          <div className="flex flex-wrap gap-2">
            {questions.map((q, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuestion(i)}
                className={`w-8 h-8 rounded-full text-xs font-bold transition-all border-2 ${
                  i === currentQuestion
                    ? "bg-blue-700 hover:cursor-pointer hover:bg-blue-800 text-white border-blue-700"
                    : q.userAnswer
                    ? "bg-green-500 hover:cursor-pointer text-white border-green-500"
                    : q.isFlagged
                    ? "bg-yellow-400 hover:cursor-pointer text-white border-yellow-400"
                    : "bg-white/50 hover:cursor-pointer text-black border-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div> 


          {/* End Quiz */}
          <Button className="bg-red-600 text-white font-semibold w-full" size="lg" onPress={onOpen}>
            End Quiz
          </Button>

        </div>
      </div>

      {/* Confirm End Quiz Modal */}
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>End Quiz? ⚠️</ModalHeader>
              <ModalBody>
                <p className="text-gray-600">
                  Are you sure you want to end the quiz? You have answered{" "}
                  <span className="font-bold text-blue-700">{questions.filter((q) => q.userAnswer).length}</span>{" "}
                  out of <span className="font-bold">{totalQuestions}</span> questions.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Continue Quiz</Button>
                <Button className="bg-red-600 text-white" onPress={handleEndQuiz}>End Quiz</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
