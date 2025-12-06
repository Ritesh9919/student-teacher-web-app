import React, { useEffect, useState } from "react";
import api from "../api";

export default function EnrollmentsPage() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, cRes] = await Promise.all([
        api.get("/students"),
        api.get("/courses"),
      ]);
      setStudents(sRes.data.data.students);
      setCourses(cRes.data.data.courses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper: map courseId -> courseTitle
  const courseMap = courses.reduce((acc, c) => {
    acc[c._id] = c.title;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Enrollments</h2>
        {loading && <span className="text-sm text-gray-500">Loading…</span>}
      </div>

      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        <div className="px-4 py-2 border-b font-semibold text-sm bg-gray-50">
          Students and Their Courses
        </div>
        {students.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No students yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border-b px-3 py-2 text-left">Student</th>
                  <th className="border-b px-3 py-2 text-left">Email</th>
                  <th className="border-b px-3 py-2 text-left">Courses</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="border-b px-3 py-2">{s.name}</td>
                    <td className="border-b px-3 py-2">{s.email}</td>
                    <td className="border-b px-3 py-2">
                      {s.courses && s.courses.length > 0
                        ? s.courses
                            .map((c) => c.title || courseMap[c._id] || "Unknown")
                            .join(", ")
                        : "Not enrolled in any course"}
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
