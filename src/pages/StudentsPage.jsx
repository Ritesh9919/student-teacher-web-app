import React, { useEffect, useState } from "react";
import api from "../api";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: "", email: "" });
  const [selectCourse, setSelectCourse] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, cRes] = await Promise.all([
        api.get("/students"),
        api.get("/courses"),
      ]);
      console.log(sRes.data.data)
      setStudents(sRes.data.data.students);
      setCourses(cRes.data.data.courses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.name.trim() || !newStudent.email.trim()) return;
    await api.post("/students", newStudent);
    setNewStudent({ name: "", email: "" });
    fetchData();
  };

  const enrollStudent = async (studentId) => {
    const courseId = selectCourse[studentId];
    if (!courseId) return;
    await api.post(`/students/${studentId}/enroll/${courseId}`);
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Students</h2>
        {loading && <span className="text-sm text-gray-500">Loading…</span>}
      </div>

      {/* Add Student */}
      <form
        onSubmit={addStudent}
        className="bg-white shadow-sm border rounded-lg p-4 space-y-3"
      >
        <h3 className="font-semibold text-lg mb-1">Add New Student</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="border rounded px-3 py-2 text-sm"
            placeholder="Student name"
            value={newStudent.name}
            onChange={(e) =>
              setNewStudent((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <input
            className="border rounded px-3 py-2 text-sm"
            placeholder="Student email"
            value={newStudent.email}
            onChange={(e) =>
              setNewStudent((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Student
        </button>
      </form>

      {/* List */}
      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        <div className="px-4 py-2 border-b font-semibold text-sm bg-gray-50">
          Students List
        </div>
        {students.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No students yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border-b px-3 py-2 text-left">Name</th>
                  <th className="border-b px-3 py-2 text-left">Email</th>
                  <th className="border-b px-3 py-2 text-left">
                    Enrolled Courses
                  </th>
                  <th className="border-b px-3 py-2 text-left">
                    Enroll in Course
                  </th>
                </tr>
              </thead>
              <tbody>
                {students?.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="border-b px-3 py-2">{s.name}</td>
                    <td className="border-b px-3 py-2">{s.email}</td>
                    <td className="border-b px-3 py-2">
                      {s.courses && s.courses.length > 0
                        ? s.courses.map((c) => c.title).join(", ")
                        : "None"}
                    </td>
                    <td className="border-b px-3 py-2">
                      <div className="flex items-center gap-2">
                        <select
                          className="border rounded px-2 py-1 text-sm"
                          value={selectCourse[s._id] || ""}
                          onChange={(e) =>
                            setSelectCourse((prev) => ({
                              ...prev,
                              [s._id]: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select course</option>
                          {courses.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => enrollStudent(s._id)}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Enroll
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
