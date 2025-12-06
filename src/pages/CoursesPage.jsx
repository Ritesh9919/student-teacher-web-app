import React, { useEffect, useState } from "react";
import api from "../api";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: "" });
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/courses");
      setCourses(res.data.data.courses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const addCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.title.trim()) return;
    await api.post("/courses", newCourse);
    setNewCourse({ title: "" });
    fetchCourses();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Courses</h2>
        {loading && <span className="text-sm text-gray-500">Loading…</span>}
      </div>

      {/* Add Course */}
      <form
        onSubmit={addCourse}
        className="bg-white shadow-sm border rounded-lg p-4 space-y-3"
      >
        <h3 className="font-semibold text-lg mb-1">Add New Course</h3>
        <input
          className="border rounded px-3 py-2 text-sm w-full md:w-1/2"
          placeholder="Course title"
          value={newCourse.title}
          onChange={(e) =>
            setNewCourse((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Course
        </button>
      </form>

      {/* List */}
      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        <div className="px-4 py-2 border-b font-semibold text-sm bg-gray-50">
          Courses List
        </div>
        {courses.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No courses yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border-b px-3 py-2 text-left">Title</th>
                  <th className="border-b px-3 py-2 text-left">Teacher</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="border-b px-3 py-2">{c.title}</td>
                    <td className="border-b px-3 py-2">
                      {c.teacher ? c.teacher.name : "Not assigned"}
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
