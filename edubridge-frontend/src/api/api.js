import { courseApi } from "./axios.js";

//Courses Api

/* ---------- PUBLIC (students) ---------- */
export const listPublicCourses = (params = {}) =>
  courseApi.get("/public/courses", { params });

export const getPublicCourse = (id) => courseApi.get(`/public/courses/${id}`);

/* ---------- CREATOR/ADMIN ---------- */
// mine
export const getMyCourses = () => courseApi.get("/me/courses");

// metadata
export const createCourse = (payload) => courseApi.post("/courses", payload);
export const updateCourse = (id, payload) =>
  courseApi.put(`/courses/${id}`, payload);
export const deleteCourse = (id) => courseApi.delete(`/courses/${id}`);

// sections
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

/* ---------- Admin ---------- */
export const adminListPendingCourses = () =>
  courseApi.get(`/admin/courses/pending`);
export const adminListAllCourses = () => courseApi.get(`/admin/courses`);
export const adminSetCourseStatus = (id, status, reason) =>
  courseApi.put(`/admin/courses/${id}/status`, { status, reason });
