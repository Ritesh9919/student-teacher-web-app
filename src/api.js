import axios from "axios";

const api = axios.create({
  baseURL: "https://student-teacher-api-a1no.onrender.com//api",
});

export default api;
