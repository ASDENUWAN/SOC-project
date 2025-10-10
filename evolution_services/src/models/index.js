import { Quiz } from "./Quiz.js";
import { Question } from "./Question.js";
import { Attempt } from "./Attempt.js";

// Relationships
Quiz.hasMany(Question, { foreignKey: "quizId", onDelete: "CASCADE" });
Question.belongsTo(Quiz, { foreignKey: "quizId" });

Quiz.hasMany(Attempt, { foreignKey: "quizId", onDelete: "CASCADE" });
Attempt.belongsTo(Quiz, { foreignKey: "quizId" });

export { Quiz, Question, Attempt };
