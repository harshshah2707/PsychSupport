import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAssessments, useActivityLog } from "../hooks/useLocalStorage";
import "./Assessment.css";

const Assessment = () => {
  const navigate = useNavigate();
  const { saveAssessment } = useAssessments();
  const { logActivity } = useActivityLog();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);

  // PHQ-9 Questions
  const questions = [
    { id: 1, text: "Little interest or pleasure in doing things?" },
    { id: 2, text: "Feeling down, depressed, or hopeless?" },
    { id: 3, text: "Trouble falling or staying asleep, or sleeping too much?" },
    { id: 4, text: "Feeling tired or having little energy?" },
    { id: 5, text: "Poor appetite or overeating?" },
    { id: 6, text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down?" },
    { id: 7, text: "Trouble concentrating on things, such as reading the newspaper or watching television?" },
    { id: 8, text: "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual?" },
    { id: 9, text: "Thoughts that you would be better off dead, or of hurting yourself in some way?" }
  ];

  const options = [
    { label: "Not at all", value: 0 },
    { label: "Several days", value: 1 },
    { label: "More than half the days", value: 2 },
    { label: "Nearly every day", value: 3 }
  ];

  const handleResponse = (questionId, response) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: response,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate PHQ-9 score
      const totalScore = Object.values(responses).reduce(
        (sum, val) => sum + val,
        0
      );

      const result = {
        score: totalScore,
        interpretation: getScoreInterpretation(totalScore),
      };

      saveAssessment(result, "PHQ-9");
      logActivity("assessment", "Completed PHQ-9 test", {
        score: totalScore,
        questionsAnswered: Object.keys(responses).length,
      });

      setAssessmentResult(result);
      setIsCompleted(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getScoreInterpretation = (score) => {
    if (score <= 4) return { level: "Minimal or none", color: "green", message: "No significant depressive symptoms." };
    if (score <= 9) return { level: "Mild", color: "blue", message: "Mild symptoms of depression." };
    if (score <= 14) return { level: "Moderate", color: "orange", message: "Moderate depression, consider monitoring or intervention." };
    if (score <= 19) return { level: "Moderately Severe", color: "darkorange", message: "Moderately severe depression. Clinical evaluation recommended." };
    return { level: "Severe", color: "red", message: "Severe depression. Strongly consider professional help." };
  };

  if (isCompleted) {
    const interpretation = assessmentResult.interpretation;

    return (
      <div className="assessment-completed">
        <h2>PHQ-9 Test Complete 🎉</h2>
        <p>Your responses have been recorded.</p>

        <div className="assessment-results">
          <h3>Your Results:</h3>
          <div className="score-display">
            <div
              className="score-circle"
              style={{ borderColor: interpretation.color }}
            >
              <span className="score-number">{assessmentResult.score}</span>
              <span className="score-label">/ 27</span>
            </div>
            <div className="score-interpretation">
              <h4 style={{ color: interpretation.color }}>
                {interpretation.level}
              </h4>
              <p>{interpretation.message}</p>
            </div>
          </div>

          <div className="assessment-summary">
            <p>
              <strong>Questions Answered:</strong>{" "}
              {Object.keys(responses).length}
            </p>
            <p>
              <strong>Completed:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>

          <h4>Next Steps:</h4>
          <ul>
            <li>Track your mood regularly to monitor changes</li>
            <li>Explore healthy coping activities (exercise, meditation, etc.)</li>
            {assessmentResult.score >= 10 && (
              <li>
                <strong>Important:</strong> Please consider seeking professional
                mental health support
              </li>
            )}
          </ul>
        </div>

        <div className="action-buttons-row">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/resources")}
          >
            View Resources
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/")}
          >
            Back to Dashboard
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setCurrentQuestion(0);
              setResponses({});
              setIsCompleted(false);
              setAssessmentResult(null);
            }}
          >
            Retake PHQ-9
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="assessment">
      <div className="assessment-progress">
        <div
          className="progress-bar"
          style={{
            width: `${((currentQuestion + 1) / questions.length) * 100}%`,
          }}
        ></div>
      </div>

      <div className="assessment-content">
        <h2>PHQ-9 Depression Test</h2>
        <p className="question-counter">
          Question {currentQuestion + 1} of {questions.length}
        </p>

        <div className="question-card">
          <h3>{question.text}</h3>

          <div className="multiple-choice">
            {options.map((option, index) => (
              <label key={index} className="option-label">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.value}
                  checked={responses[question.id] === option.value}
                  onChange={(e) =>
                    handleResponse(question.id, parseInt(e.target.value))
                  }
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div className="assessment-navigation">
          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            className="nav-btn secondary"
          >
            Previous
          </button>
          <button
            onClick={nextQuestion}
            disabled={responses[question.id] === undefined}
            className="nav-btn primary"
          >
            {currentQuestion === questions.length - 1 ? "Complete" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
