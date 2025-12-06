import React, { useEffect, useState } from "react";
import api from "../api";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newTeacher, setNewTeacher] = useState({ name: "", email: "" });
  const [selectCourse, setSelectCourse] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tRes, cRes] = await Promise.all([
        api.get("/teachers"),
        api.get("/courses"),
      ]);
      setTeachers(tRes.data.data.teachers);
      setCourses(cRes.data.data.courses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addTeacher = async (e) => {
    e.preventDefault();
    if (!newTeacher.name.trim() || !newTeacher.email.trim()) return;
    await api.post("/teachers", newTeacher);
    setNewTeacher({ name: "", email: "" });
    fetchData();
  };

  const assignCourse = async (teacherId) => {
    const courseId = selectCourse[teacherId];
    if (!courseId) return;
    await api.post(`/teachers/${teacherId}/assign/${courseId}`);
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Teachers</h2>
        {loading && <span className="text-sm text-gray-500">Loading…</span>}
      </div>

      {/* Add Teacher */}
      <form
        onSubmit={addTeacher}
        className="bg-white shadow-sm border rounded-lg p-4 space-y-3"
      >
        <h3 className="font-semibold text-lg mb-1">Add New Teacher</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="border rounded px-3 py-2 text-sm"
            placeholder="Teacher name"
            value={newTeacher.name}
            onChange={(e) =>
              setNewTeacher((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <input
            className="border rounded px-3 py-2 text-sm"
            placeholder="Teacher email"
            value={newTeacher.email}
            onChange={(e) =>
              setNewTeacher((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Teacher
        </button>
      </form>

      {/* List */}
      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        <div className="px-4 py-2 border-b font-semibold text-sm bg-gray-50">
          Teachers List
        </div>
        {teachers.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No teachers yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border-b px-3 py-2 text-left">Name</th>
                  <th className="border-b px-3 py-2 text-left">Email</th>
                  <th className="border-b px-3 py-2 text-left">
                    Assigned Courses
                  </th>
                  <th className="border-b px-3 py-2 text-left">
                    Assign Course
                  </th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50">
                    <td className="border-b px-3 py-2">{t.name}</td>
                    <td className="border-b px-3 py-2">{t.email}</td>
                    <td className="border-b px-3 py-2">
                      {t.courses && t.courses.length > 0
                        ? t.courses.map((c) => c.title).join(", ")
                        : "None"}
                    </td>
                    <td className="border-b px-3 py-2">
                      <div className="flex items-center gap-2">
                        <select
                          className="border rounded px-2 py-1 text-sm"
                          value={selectCourse[t._id] || ""}
                          onChange={(e) =>
                            setSelectCourse((prev) => ({
                              ...prev,
                              [t._id]: e.target.value,
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
                          onClick={() => assignCourse(t._id)}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                          Assign
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
