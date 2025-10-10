export const createEvaluation = async (req, res) => {
  const { course_id, student_id, marks } = req.body;
  if (!course_id || !student_id || !marks)
    return res.status(400).json({ message: "Missing required fields" });

  res.status(201).json({
    message: "Evaluation created successfully",
    data: { course_id, student_id, marks },
  });
};

export const getAllEvaluations = async (req, res) => {
  res.json({ message: "All evaluations retrieved successfully" });
};
