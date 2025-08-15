import { courseApi, enrollmentApi } from "./axios.js";

//Courses Api

/* ---------- PUBLIC (students) ---------- */
export const listPublicCourses = (params = {}) =>
  courseApi.get("/public/courses", { params });

export const getPublicCourseSummary = (id) =>
  courseApi.get(`/public/courses/${id}/summary`);
export const getPublicCourse = (id) => courseApi.get(`/public/courses/${id}`);
export const getPublicCourseFull = (id) =>
  courseApi.get(`/public/courses/${id}`);

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

/* ==========================
   ENROLLMENTS — STUDENT
   ========================== */

/**
 * POST /enroll { courseId }
 * Creates or re-activates an enrollment for the current user.
 */
export const enrollCourse = (courseId) =>
  enrollmentApi.post(`/enroll`, { courseId });

/**
 * DELETE /enroll/:courseId
 * Unenroll current user from a course.
 */
export const unenrollCourse = (courseId) =>
  enrollmentApi.delete(`/enroll/${courseId}`);

/**
 * GET /me/:courseId
 * Returns my enrollment state for the course: { status, progress, completedSectionIds, ... } or null.
 */
export const getMyEnrollment = (courseId) =>
  enrollmentApi.get(`/me/${courseId}`);

/**
 * GET /me
 * Returns my all enrollments [{ id, courseId, status, progress, ... }, ...]
 */
export const listMyEnrollments = () => enrollmentApi.get(`/me`);

/**
 * POST /me/:courseId/sections/:sectionId/toggle { done: boolean }
 * Mark/unmark a section as done → backend recalculates progress.
 */
export const toggleSectionDone = (courseId, sectionId, done) =>
  enrollmentApi.post(`/me/${courseId}/sections/${sectionId}/toggle`, { done });

/* ==========================
   CREATOR ANALYTICS (optional)
   ========================== */

/**
 * GET /creator/insights
 * Returns counts per creator course: { courseId, activeCount, completedCount, total }
 */
export const getCreatorInsights = () => enrollmentApi.get(`/creator/insights`);

/**
 * GET /creator/:courseId/learners
 * Returns per-learner progress for a specific course (creator owns it).
 */
export const getCreatorLearners = (courseId) =>
  enrollmentApi.get(`/creator/${courseId}/learners`);
