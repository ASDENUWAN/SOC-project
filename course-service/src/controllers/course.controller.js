// src/controllers/course.controller.js
import { Course } from "../models/course.model.js";
import { Section } from "../models/section.model.js";
import { deleteByKeyOrUrl } from "../utils/s3.js";

const isOwnerOrAdmin = (req, course) =>
  course.creatorId === req.user.id || req.user.role === "admin";

/* =========================================================
   PUBLIC (students can browse approved courses + details)
   ========================================================= */

// GET /api/courses/public/courses
export const publicList = async (req, res) => {
  const { subject, grade, language } = req.query;
  const where = { status: "approved" };
  if (subject) where.subject = subject;
  if (grade) where.gradeLevel = grade;
  if (language) where.language = language;

  const items = await Course.findAll({
    where,
    order: [["createdAt", "DESC"]],
    attributes: { exclude: ["rejectReason"] },
  });

  res.json(items);
};

// GET /api/courses/public/courses/:id  (includes sections)
export const publicGet = async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    include: [{ model: Section, as: "sections", order: [["order", "ASC"]] }],
  });
  if (!course || course.status !== "approved") {
    return res.status(404).json({ message: "Course not found" });
  }
  res.json(course);
};

/* =========================================================
   CREATOR / ADMIN (protected)
   ========================================================= */

// GET /api/courses/me/courses  → only my courses (any status)
export const myCourses = async (req, res) => {
  const rows = await Course.findAll({
    where: { creatorId: req.user.id },
    order: [["createdAt", "DESC"]],
  });
  res.json(rows);
};

// GET /api/courses/courses/:id → full course (owner/admin can access non-approved)
export const getCourse = async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    include: [{ model: Section, as: "sections", order: [["order", "ASC"]] }],
  });
  if (!course) return res.status(404).json({ message: "Course not found" });

  if (course.status !== "approved" && !isOwnerOrAdmin(req, course)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  res.json(course);
};

// POST /api/courses/courses
export const createCourse = async (req, res) => {
  if (req.user.role !== "creator" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { title, description, subject, gradeLevel, language } = req.body;
  if (!title || !subject) {
    return res.status(400).json({ message: "title and subject are required" });
  }

  const course = await Course.create({
    creatorId: req.user.id,
    title,
    description,
    subject, // ENUM: 'maths' | 'english' | 'it'
    gradeLevel, // e.g., 'Grade 10', 'AL'
    language, // e.g., 'en', 'si', 'ta'
    status: "draft",
  });

  res.status(201).json(course);
};

// PUT /api/courses/courses/:id
export const updateCourse = async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  // Creator can edit only own courses if status is draft/rejected
  const creatorEditingAllowed =
    course.creatorId === req.user.id &&
    (course.status === "draft" || course.status === "rejected");

  if (!(req.user.role === "admin" || creatorEditingAllowed)) {
    return res.status(403).json({ message: "Not allowed to edit" });
  }

  const fields = [
    "title",
    "description",
    "subject",
    "gradeLevel",
    "language",
    "thumbnailUrl",
  ];
  fields.forEach((k) => {
    if (req.body[k] !== undefined) course[k] = req.body[k];
  });

  // If it was rejected and user updated, send it back to draft (clear reason)
  if (course.status === "rejected") {
    course.status = "draft";
    course.rejectReason = null;
  }

  await course.save();
  res.json(course);
};

// DELETE /api/courses/courses/:id
export const deleteCourse = async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    include: [{ model: Section, as: "sections" }],
  });
  if (!course) return res.status(404).json({ message: "Course not found" });

  // Owner can delete only if not approved; admin can always
  const canDel =
    req.user.role === "admin" ||
    (course.creatorId === req.user.id && course.status !== "approved");
  if (!canDel)
    return res.status(403).json({ message: "Not allowed to delete" });

  // Best-effort S3 cleanup for every section
  for (const s of course.sections || []) {
    await deleteByKeyOrUrl({
      key: s.contentKey,
      url: s.contentUrl,
    });
  }

  await course.destroy();
  res.json({ message: "Course deleted" });
};

// PUT /api/courses/courses/:id/submit
export const submitCourse = async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });
  if (course.creatorId !== req.user.id)
    return res.status(403).json({ message: "Forbidden" });
  if (course.status === "approved")
    return res.status(400).json({ message: "Already approved" });

  course.status = "submitted";
  await course.save();
  res.json(course);
};

/* =========================================================
   ADMIN moderation
   ========================================================= */

// GET /api/courses/admin/courses  → all courses (any status)
export const listAllForAdmin = async (req, res) => {
  const items = await Course.findAll({
    order: [["updatedAt", "DESC"]],
  });
  res.json(items);
};

// GET /api/courses/admin/courses/pending  → only submitted (pending review)
export const listPending = async (req, res) => {
  const items = await Course.findAll({
    where: { status: "draft" }, // ← pending == submitted
    order: [["updatedAt", "DESC"]],
  });
  res.json(items);
};

// PUT /api/courses/admin/courses/:id/status  body: { status: 'approved'|'rejected', reason? }
export const setStatus = async (req, res) => {
  const { status, reason } = req.body;
  if (!["approved", "rejected"].includes(status))
    return res.status(400).json({ message: "Invalid status" });

  const course = await Course.findByPk(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  course.status = status;
  course.rejectReason = status === "rejected" ? reason || null : null;
  await course.save();
  res.json(course);
};

/* =========================================================
   SECTIONS (creator/admin)
   ========================================================= */

// GET /api/courses/courses/:id/sections
export const listCourseSections = async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  // Owner/admin can see any course; students use the public endpoints.
  if (course.status !== "approved" && !isOwnerOrAdmin(req, course)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const sections = await Section.findAll({
    where: { courseId: course.id },
    order: [
      ["order", "ASC"],
      ["createdAt", "ASC"],
    ],
  });
  res.json(sections);
};

// POST /api/courses/courses/:id/sections
export const addSection = async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });
  if (!isOwnerOrAdmin(req, course))
    return res.status(403).json({ message: "Forbidden" });

  // Creator can add content only AFTER approval (admin can always)
  if (req.user.role !== "admin" && course.status !== "approved") {
    return res
      .status(400)
      .json({ message: "Content can be added only after approval" });
  }

  const { title, order, contentType, textContent } = req.body;
  if (!title || !contentType)
    return res
      .status(400)
      .json({ message: "title and contentType are required" });

  const section = await Section.create({
    courseId: course.id,
    title,
    order: order ? Number(order) : 1,
    contentType, // "video" | "pdf" | "text"
    contentUrl: req.file ? req.file.location : null, // set by s3Push
    contentKey: req.file ? req.file.s3Key : null, // set by s3Push
    textContent: contentType === "text" ? textContent || "" : null,
  });

  res.status(201).json(section);
};

// PUT /api/courses/sections/:id
export const updateSection = async (req, res) => {
  const section = await Section.findByPk(req.params.id, {
    include: [{ model: Course, as: "course" }],
  });
  if (!section) return res.status(404).json({ message: "Section not found" });
  if (!isOwnerOrAdmin(req, section.course))
    return res.status(403).json({ message: "Forbidden" });

  const { title, order, contentType, textContent } = req.body;

  if (title !== undefined) section.title = title;
  if (order !== undefined) section.order = Number(order);

  // If replacing with a new file (video/pdf)
  if (req.file) {
    // Delete the previous object if it existed
    await deleteByKeyOrUrl({
      key: section.contentKey,
      url: section.contentUrl,
    });

    section.contentUrl = req.file.location;
    section.contentKey = req.file.s3Key;
    section.textContent = null;
    section.contentType = contentType || section.contentType;
  } else if (contentType === "text") {
    // Switching to text — remove previous object if existed
    await deleteByKeyOrUrl({
      key: section.contentKey,
      url: section.contentUrl,
    });

    section.contentType = "text";
    section.textContent = textContent || "";
    section.contentUrl = null;
    section.contentKey = null;
  }

  await section.save();
  res.json(section);
};

// DELETE /api/courses/sections/:id
export const deleteSection = async (req, res) => {
  const section = await Section.findByPk(req.params.id, {
    include: [{ model: Course, as: "course" }],
  });
  if (!section) return res.status(404).json({ message: "Section not found" });
  if (!isOwnerOrAdmin(req, section.course))
    return res.status(403).json({ message: "Forbidden" });

  // Delete file if it exists
  await deleteByKeyOrUrl({
    key: section.contentKey,
    url: section.contentUrl,
  });

  await section.destroy();
  res.json({ message: "Section deleted" });
};
