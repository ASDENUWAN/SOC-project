import axios from "axios";

export const authApi = axios.create({
  baseURL: "http://localhost:4010/api/auth",
  withCredentials: true,
});

export const userApi = axios.create({
  baseURL: "http://localhost:4020/api/users",
  withCredentials: true,
});

/* ===== Course Service (4030) ===== */
export const courseApi = axios.create({
  baseURL: "http://localhost:4030/api/courses",
  withCredentials: true,
});

/* Creator – courses */
export const getMyCourses = () => courseApi.get("/courses");
export const createCourse = (payload) => courseApi.post("/courses", payload);
export const updateCourse = (id, payload) =>
  courseApi.put(`/courses/${id}`, payload);
export const deleteCourse = (id) => courseApi.delete(`/courses/${id}`);

/* Sections */
export const getSections = (courseId) =>
  courseApi.get(`/courses/${courseId}/sections`);
export const createSection = (courseId, payload, isForm = false) =>
  isForm
    ? courseApi.post(`/courses/${courseId}/sections`, payload)
    : courseApi.post(`/courses/${courseId}/sections`, payload);
export const updateSection = (sectionId, payload, isForm = false) =>
  isForm
    ? courseApi.put(`/sections/${sectionId}`, payload)
    : courseApi.put(`/sections/${sectionId}`, payload);
export const deleteSection = (sectionId) =>
  courseApi.delete(`/sections/${sectionId}`);

/* Admin – approvals */
export const adminListCourses = (status) =>
  courseApi.get(`/admin/courses${status ? `?status=${status}` : ""}`);
export const adminSetCourseStatus = (id, status) =>
  courseApi.put(`/admin/courses/${id}/status`, { status });
