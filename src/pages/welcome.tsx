import Navigation from "@/components/Navigation";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "@/context/QuizConext";
import { resetHasSentResults } from "@/pages/results";

const CATEGORY_NAMES: Record<string, string> = {
  "9": "General Knowledge", "10": "Books", "11": "Film", "12": "Music",
  "14": "Television", "15": "Video Games", "17": "Science & Nature",
  "18": "Computers", "19": "Mathematics", "20": "Mythology", "21": "Sports",
  "22": "Geography", "23": "History", "24": "Politics", "27": "Animals", "28": "Vehicles",
};

const difficulties = [
  { key: "easy", label: "Easy" },
  { key: "medium", label: "Medium" },
  { key: "hard", label: "Hard" },
];

const types = [
  { key: "multiple", label: "Multiple Choice" },
  { key: "boolean", label: "True / False" },
];

export default function Welcome() {
  const navigate = useNavigate();
  const { user, setQuizSettings } = useQuiz();

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="flex flex-col items-center justify-center px-4 py-2">

        <p className="text-black text-lg font-medium pt-5">
          Welcome, <span className="text-blue-700 font-bold">{user?.username || user?.firstname}!</span>
        </p>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-black mb-3">Start a <span className="text-blue-700">Quiz</span></h1>
          <p className="text-gray-600 text-lg">Customize your quiz and test your knowledge!</p>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 w-full max-w-lg border border-gray-100 shadow-sm">
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
              if (data.category && data.amount && data.difficulty && data.type && data.timelimit) {
                setQuizSettings({
                  category: data.category,
                  categoryName: CATEGORY_NAMES[data.category] ?? "General Knowledge",
                  amount: parseInt(data.amount),
                  difficulty: data.difficulty,
                  type: data.type,
                  timelimit: parseInt(data.timelimit),
                });
                resetHasSentResults();
                navigate("/quiz");
              }
            }}
          >
            <Select
              isRequired
              label="Select Category"
              labelPlacement="inside"
              placeholder="Choose a category"
              name="category"
              listboxProps={{ style: { maxHeight: "200px", overflowY: "auto" } }}
              scrollShadowProps={{ isEnabled: true }}
            >
              <SelectItem key="9">General Knowledge</SelectItem>
              <SelectItem key="10">Books</SelectItem>
              <SelectItem key="11">Film</SelectItem>
              <SelectItem key="12">Music</SelectItem>
              <SelectItem key="14">Television</SelectItem>
              <SelectItem key="15">Video Games</SelectItem>
              <SelectItem key="17">Science & Nature</SelectItem>
              <SelectItem key="18">Computers</SelectItem>
              <SelectItem key="19">Mathematics</SelectItem>
              <SelectItem key="20">Mythology</SelectItem>
              <SelectItem key="21">Sports</SelectItem>
              <SelectItem key="22">Geography</SelectItem>
              <SelectItem key="23">History</SelectItem>
              <SelectItem key="24">Politics</SelectItem>
              <SelectItem key="27">Animals</SelectItem>
              <SelectItem key="28">Vehicles</SelectItem>
            </Select>

            <Input
              isRequired
              label="Number of Questions"
              labelPlacement="inside"
              name="amount"
              placeholder="e.g 10"
              type="number"
              min="1"
              max="50"
              errorMessage="Please enter a number between 1 and 50"
            />

            <Select isRequired label="Select Difficulty" labelPlacement="inside" placeholder="Choose difficulty" name="difficulty">
              {difficulties.map((d) => <SelectItem key={d.key}>{d.label}</SelectItem>)}
            </Select>

            <Select isRequired label="Select Type" labelPlacement="inside" placeholder="Choose question type" name="type">
              {types.map((t) => <SelectItem key={t.key}>{t.label}</SelectItem>)}
            </Select>

            <Select isRequired label="Time Limit" labelPlacement="inside" placeholder="Choose a time limit" name="timelimit">
              <SelectItem key="5">5 minutes</SelectItem>
              <SelectItem key="10">10 minutes</SelectItem>
              <SelectItem key="15">15 minutes</SelectItem>
              <SelectItem key="45">45 minutes</SelectItem>
              <SelectItem key="90">1 hour 30 minutes</SelectItem>
              <SelectItem key="105">1 hour 45 minutes</SelectItem>
              <SelectItem key="120">2 hours</SelectItem>
              <SelectItem key="150">2 hours 30 minutes</SelectItem>
            </Select>

            <Button type="submit" className="bg-blue-700 text-white w-full mt-2" size="lg">
              Start Quiz
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}
