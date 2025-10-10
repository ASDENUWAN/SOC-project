// controllers/creator.controller.js

// Example createCourse function
export const createCourse = (req, res) => {
  // You can replace this with actual DB logic
  const { title, description } = req.body;
  res.status(201).json({
    message: "Course created successfully!",
    course: { title, description }
  });
};

// Add more exports if needed
