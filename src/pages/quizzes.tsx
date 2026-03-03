import Navigation from "@/components/Navigation";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Input, Button, Select, SelectItem,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useQuiz } from "@/context/QuizConext";

const gradeColor = (grade: string) => {
  if (grade === "A") return "text-green-600 font-bold";
  if (grade === "B") return "text-blue-600 font-bold";
  if (grade === "C") return "text-yellow-600 font-bold";
  return "text-red-600 font-bold";
};

export default function Quizzes() {
  const navigate = useNavigate();
  const { sessions, deleteSession, streak } = useQuiz();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const [search, setSearch] = React.useState("");
  const [sortBy, setSortBy] = React.useState("date");
  const [filterGrade, setFilterGrade] = React.useState("all");

  const confirmDelete = (id: string) => { setDeleteId(id); onOpen(); };
  const handleDelete = () => { if (deleteId) deleteSession(deleteId); onClose(); };

  // Best score per category
  const bestScores: Record<string, number> = {};
  sessions.forEach((s) => {
    if (!bestScores[s.category] || s.percentage > bestScores[s.category]) {
      bestScores[s.category] = s.percentage;
    }
  });
  const topCategory = Object.entries(bestScores).sort((a, b) => b[1] - a[1])[0];

  // Filter + search + sort
  const filtered = sessions
    .filter((q) => filterGrade === "all" || q.grade === filterGrade)
    .filter((q) =>
      q.category.toLowerCase().includes(search.toLowerCase()) ||
      q.grade.toLowerCase().includes(search.toLowerCase()) ||
      q.date.includes(search) ||
      q.score.includes(search)
    )
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "grade") return a.grade.localeCompare(b.grade);
      if (sortBy === "score") return b.percentage - a.percentage;
      return 0;
    });

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="flex flex-col items-center px-4 py-10">

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-black mb-2">My <span className="text-blue-700">Quizzes</span></h1>
          <p className="text-gray-600 text-lg">View all your past quiz attempts and results.</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mb-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-sm text-center border border-gray-100">
            <p className="text-gray-500 text-sm">Total Quizzes</p>
            <p className="text-black font-bold text-2xl">{sessions.length}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-sm text-center border border-gray-100">
            <p className="text-gray-500 text-sm">A Grades</p>
            <p className="text-green-600 font-bold text-2xl">{sessions.filter((q) => q.grade === "A").length}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-sm text-center border border-gray-100">
            <p className="text-gray-500 text-sm">Streak</p>
            <p className="text-orange-500 font-bold text-2xl">{streak} day{streak !== 1 ? "s" : ""}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-sm text-center border border-gray-100">
            <p className="text-gray-500 text-sm">Failed</p>
            <p className="text-red-600 font-bold text-2xl">{sessions.filter((q) => q.grade === "F").length}</p>
          </div>
        </div>

        {/* Best Score */}
        {topCategory && (
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-sm w-full max-w-3xl mb-4 text-center">
            <p className="text-gray-500 text-sm">Best Category</p>
            <p className="text-black font-bold text-lg">{topCategory[0]} — <span className="text-green-600">{topCategory[1]}%</span></p>
          </div>
        )}

        <div className="w-full max-w-3xl flex flex-col gap-4">

          {/* Search + Filter + Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Search by category, date, grade or score..."
              value={search}
              onValueChange={setSearch}
              className="flex-1"
            />
            <div className="flex flex-row sm:flex-row gap-3">
              <Select
              placeholder="Filter by grade"
              selectedKeys={[filterGrade]}
              onSelectionChange={(keys) => setFilterGrade([...keys][0] as string)}
              className="w-40"
            >
              <SelectItem key="all">All Grades</SelectItem>
              <SelectItem key="A">A</SelectItem>
              <SelectItem key="B">B</SelectItem>
              <SelectItem key="C">C</SelectItem>
              <SelectItem key="F">F</SelectItem>
            </Select>
            <Select
              placeholder="Sort by"
              selectedKeys={[sortBy]}
              onSelectionChange={(keys) => setSortBy([...keys][0] as string)}
              className="w-40"
            >
              <SelectItem key="date">Date</SelectItem>
              <SelectItem key="grade">Grade</SelectItem>
              <SelectItem key="score">Score</SelectItem>
            </Select>
            </div>
          </div>

          {search && (
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold text-blue-700">{filtered.length}</span> result{filtered.length !== 1 ? "s" : ""} for <span className="font-bold text-blue-700">"{search}"</span>
            </p>
          )}

          {/* Table */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <Table
              isHeaderSticky
              aria-label="My Quizzes Table"
              classNames={{
                base: "max-h-[420px] overflow-scroll",
                table: "min-h-[200px]",
                th: "bg-blue-700 text-white font-bold",
              }}
            >
              <TableHeader>
                <TableColumn key="category">Category</TableColumn>
                <TableColumn key="date">Date</TableColumn>
                <TableColumn key="grade">Grade</TableColumn>
                <TableColumn key="score">Score</TableColumn>
                <TableColumn key="actions"> </TableColumn>
              </TableHeader>
              <TableBody
                items={filtered}
                emptyContent={
                  <p className="text-gray-500 py-4">
                    {sessions.length === 0 ? "No quizzes yet. Start your first quiz!" : `No results found for "${search}"`}
                  </p>
                }
              >
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-black">{item.category}</TableCell>
                    <TableCell className="text-gray-600">{new Date(item.date).toLocaleDateString()}</TableCell>
                    <TableCell className={gradeColor(item.grade)}>{item.grade}</TableCell>
                    <TableCell className="font-semibold text-black">{item.score}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => confirmDelete(item.id)}
                        className="text-red-500 hover:text-red-700 hover:cursor-pointer text-xs font-semibold transition-colors"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <Button className="bg-blue-700 text-white font-semibold w-full" size="lg" onPress={() => navigate("/welcome")}>
            + New Quiz
          </Button>

        </div>
      </div>

      {/* Confirm Delete Modal */}
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Delete Quiz?</ModalHeader>
              <ModalBody>
                <p className="text-gray-600">Are you sure you want to delete this quiz session? This cannot be undone.</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button className="bg-red-600 text-white" onPress={handleDelete}>Delete</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
