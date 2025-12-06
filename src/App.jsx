
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import StudentsPage from "./pages/StudentsPage";
import TeachersPage from "./pages/TeachersPage";
import CoursesPage from "./pages/CoursesPage";
import EnrollmentsPage from "./pages/EnrollmentsPage";

export default function App() {
  return (
    <BrowserRouter>
      {/* Navbar */}
      <header className="bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-semibold text-lg">Student–Teacher Portal</h1>
          <nav className="flex gap-3 text-sm font-medium">
            <Link className="hover:underline" to="/students">
              Students
            </Link>
            <Link className="hover:underline" to="/teachers">
              Teachers
            </Link>
            <Link className="hover:underline" to="/courses">
              Courses
            </Link>
            <Link className="hover:underline" to="/enrollments">
              Enrollments
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/students" replace />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/enrollments" element={<EnrollmentsPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
