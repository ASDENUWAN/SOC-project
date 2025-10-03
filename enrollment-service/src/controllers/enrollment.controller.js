import axios from "axios";
import { Enrollment } from "../models/enrollment.model.js";
import { Completion } from "../models/completion.model.js";

const COURSE_SERVICE = "http://localhost:4030";

/* ─────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────── */

// Fetch full approved course (with sections) from Course Service
async function getApprovedCourseWithSections(courseId) {
  const { data } = await axios.get(
    `${COURSE_SERVICE}/api/courses/public/courses/${courseId}`
  );
  // If course is not approved, Course Service responds 404
  return data; // { id, ..., sections: [] }
}

async function getSectionsForApprovedCourse(courseId) {
  const course = await getApprovedCourseWithSections(courseId);
  return Array.isArray(course?.sections) ? course.sections : [];
}

async function getSectionCount(courseId) {
  const sections = await getSectionsForApprovedCourse(courseId);
  return sections.length;
}

function computeProgress(completedCount, total) {
  if (!total || total <= 0) return 0;
  return Math.round((completedCount / total) * 100);
}

// latest completed section by updated time
async function getLatestCompletedSectionId(enrollmentId) {
  const latest = await Completion.findOne({
    where: { enrollmentId, isCompleted: true },
    order: [["updatedAt", "DESC"]],
  });
  return latest ? latest.sectionId : null;
}

/* =======================
   STUDENT-facing endpoints
   ======================= */

// POST /api/enrollments/enroll  { courseId }
export const enroll = async (req, res) => {
  const { courseId } = req.body;
  if (!courseId) return res.status(400).json({ message: "courseId required" });

  // ensure course is approved & get sections count
  let totalSections = 0;
  try {
    totalSections = await getSectionCount(courseId);
    if (totalSections < 0) totalSections = 0;
  } catch {
    return res
      .status(400)
      .json({ message: "Course not available for enrollment" });
  }

  // create or return existing
  let enr = await Enrollment.findOne({
    where: { courseId, studentId: req.user.id },
  });

  if (!enr) {
    enr = await Enrollment.create({
      courseId,
      studentId: req.user.id,
      status: "active",
      totalSections,
      progress: 0,
      startedAt: new Date(),
    });
  } else if (enr.status === "cancelled") {
    enr.status = "active";
    enr.startedAt = new Date();
    await enr.save();
  }

  res.status(201).json(enr);
};

// DELETE /api/enrollments/enroll/:courseId
export const unenroll = async (req, res) => {
  const { courseId } = req.params;
  const enr = await Enrollment.findOne({
    where: { courseId, studentId: req.user.id },
  });
  if (!enr) return res.status(404).json({ message: "Not enrolled" });

  enr.status = "cancelled";
  await enr.save();
  await Completion.destroy({ where: { enrollmentId: enr.id } });
  res.json({ message: "Unenrolled" });
};

// GET /api/enrollments/me/:courseId  → status, progress, completed sections
export const getMyEnrollment = async (req, res) => {
  const { courseId } = req.params;
  const enr = await Enrollment.findOne({
    where: { courseId, studentId: req.user.id },
    include: [{ model: Completion, as: "completions" }],
  });
  if (!enr) return res.json(null);

  const completedSectionIds = (enr.completions || [])
    .filter((c) => c.isCompleted)
    .map((c) => c.sectionId);
  res.json({
    id: enr.id,
    status: enr.status,
    progress: enr.progress,
    totalSections: enr.totalSections,
    completedSectionIds,
    lastSectionId: enr.lastSectionId,
  });
};

// GET /api/enrollments/me → list my active enrollments (with progress)
export const listMyEnrollments = async (req, res) => {
  const rows = await Enrollment.findAll({
    where: { studentId: req.user.id, status: "active" },
    order: [["updatedAt", "DESC"]],
  });
  res.json(rows);
};

async function recalcProgress(enr) {
  const sections = await getSectionsForApprovedCourse(enr.courseId);
  const total = sections.length || 1; // avoid divide by 0

  const completedCount = await Completion.count({
    where: { enrollmentId: enr.id, isCompleted: true },
  });

  enr.totalSections = total;
  enr.progress = Math.round((completedCount / total) * 100);

  // status transitions
  if (enr.progress === 100 && enr.status !== "completed") {
    enr.status = "completed";
    enr.completedAt = new Date();
  } else if (enr.progress < 100 && enr.status === "completed") {
    enr.status = "active";
    enr.completedAt = null;
  }

  return enr.save();
}
// POST /me/:courseId/sections/:sectionId/toggle
export const toggleSectionDone = async (req, res) => {
  const { courseId, sectionId } = req.params;
  const { done } = req.body;

  const enr = await Enrollment.findOne({
    where: { courseId, studentId: req.user.id },
  });
  if (!enr || enr.status === "cancelled") {
    return res.status(404).json({ message: "Not enrolled" });
  }

  // verify section belongs to this approved course
  let sections = [];
  try {
    sections = await getSectionsForApprovedCourse(courseId);
  } catch {
    return res
      .status(400)
      .json({ message: "Course is not available for progress tracking" });
  }
  if (!sections.some((s) => String(s.id) === String(sectionId))) {
    return res.status(400).json({ message: "Invalid section for this course" });
  }

  // update completion
  let rec = await Completion.findOne({
    where: { enrollmentId: enr.id, sectionId },
  });
  if (done) {
    if (!rec) {
      rec = await Completion.create({
        enrollmentId: enr.id,
        sectionId,
        isCompleted: true,
        completedAt: new Date(),
      });
    } else if (!rec.isCompleted) {
      rec.isCompleted = true;
      rec.completedAt = new Date();
      await rec.save();
    }
  } else if (rec && rec.isCompleted) {
    rec.isCompleted = false;
    rec.completedAt = null;
    await rec.save();
  }

  // 🔥 Always recalc with latest section count
  await recalcProgress(enr);

  res.json({
    status: enr.status,
    progress: enr.progress,
    totalSections: enr.totalSections,
    lastSectionId: enr.lastSectionId,
  });
};

/* =======================
   CREATOR analytics
   ======================= */

// GET /api/enrollments/creator/:courseId/learners
export const creatorLearners = async (req, res) => {
  const { courseId } = req.params;

  // NOTE: Ideally verify req.user is the owner of courseId (via Course Service).
  // Skipped here to keep cross-service calls minimal.

  const rows = await Enrollment.findAll({
    where: { courseId },
    include: [{ model: Completion, as: "completions" }],
    order: [["updatedAt", "DESC"]],
  });

  const data = rows.map((e) => ({
    enrollmentId: e.id,
    studentId: e.studentId,
    status: e.status,
    progress: e.progress,
    totalSections: e.totalSections,
    completedCount: (e.completions || []).filter((c) => c.isCompleted).length,
    startedAt: e.startedAt,
    completedAt: e.completedAt,
  }));

  res.json({
    courseId: Number(courseId),
    count: rows.length,
    learners: data,
  });
};

// GET /api/enrollments/creator/insights
export const creatorInsights = async (req, res) => {
  // Minimal rollup; for perfect accuracy, filter enrollments by courses owned by req.user.
  const raw = await Enrollment.findAll({ attributes: ["courseId", "status"] });

  const statMap = {};
  for (const e of raw) {
    const key = e.courseId;
    if (!statMap[key]) statMap[key] = { active: 0, completed: 0, total: 0 };
    statMap[key].total++;
    if (e.status === "completed") statMap[key].completed++;
    if (e.status === "active") statMap[key].active++;
  }

  const result = Object.entries(statMap).map(([courseId, s]) => ({
    courseId: Number(courseId),
    activeCount: s.active,
    completedCount: s.completed,
    total: s.total,
  }));

  res.json(result);
};
