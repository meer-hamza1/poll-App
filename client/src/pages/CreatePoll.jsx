import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./CreatePoll.css";
const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

function CreatePoll() {
  const [title, setTitle] = useState("");
  const [expiry, setExpiry] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
      required: true,
      options: [{ text: "" }, { text: "" }],
    },
  ]);
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/polls/${id}`,
        );

        setTitle(response.data.poll.title);

        const formattedQuestions = response.data.poll.questions.map(
          (question) => ({
            ...question,
            options: question.options.map((option) => ({
              text: option.text || option,
            })),
          }),
        );

        setQuestions(formattedQuestions);
      } catch (error) {
        console.log(error);
      }
    };

    if (id) fetchPoll();
  }, [id]);

  //  validation
  const validate = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Poll title is required";
    }

    if (!questions[0].question.trim()) {
      newErrors.question = "Question is required";
    }

    const emptyOption = questions[0].options.some((opt) => !opt.text.trim());
    if (emptyOption) {
      newErrors.options = "All options must be filled in";
    }

    const hasAtLeastTwoOptions = questions[0].options.length >= 2;
    if (!hasAtLeastTwoOptions) {
      newErrors.options = "At least 2 options are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreatePoll = async () => {
    if (!validate()) return;

    try {
      const formattedQuestions = questions.map((question) => ({
        question: question.question,
        required: true,
        options: question.options.map((option) => option.text),
      }));

      if (id) {
        // edit mode
        await axios.put(
          `http://localhost:8000/api/polls/${id}`,
          { title, questions: formattedQuestions },
          authHeader(),
        );
        alert("Poll updated successfully");
      } else {
        // create mode
        await axios.post(
          "http://localhost:8000/api/polls",
          { title, questions: formattedQuestions, expiresAt: expiry },
          authHeader(),
        );
        alert("Poll created successfully");
        navigate("/dashboard")

      }

      setTitle("");
      setExpiry("");
      setErrors({});
      setQuestions([
        {
          question: "",
          required: true,
          options: [{ text: "" }, { text: "" }],
        },
      ]);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleQuestionChange = (e) => {
    const updated = [...questions];
    updated[0].question = e.target.value;
    setQuestions(updated);
  };

  const handleOptionChange = (e, index) => {
    const updated = [...questions];
    updated[0].options[index].text = e.target.value;
    setQuestions(updated);
  };

  const handleAddOption = () => {
    const updated = [...questions];
    updated[0].options.push({ text: "" });
    setQuestions(updated);
  };

  // remove option — minimum 2 options enforced
  const handleRemoveOption = (index) => {
    if (questions[0].options.length <= 2) {
      alert("Minimum 2 options required");
      return;
    }
    const updated = [...questions];
    updated[0].options.splice(index, 1);
    setQuestions(updated);
  };

  return (
    <div id="create-page">
      <div id="poll-form-card">
        <h1 id="create-poll-title">Create poll</h1>
        <hr id="form-divider" />

        <p className="form-section-label">Poll title</p>
        <input
          id="poll-title-input"
          className={`main-input ${errors.title ? "input-error" : ""}`}
          type="text"
          placeholder="Enter poll title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {/* error messages */}
        {errors.title && <p className="error-msg">{errors.title}</p>}

        <p className="form-section-label">Question</p>
        <input
          id="question-input"
          className={`main-input ${errors.question ? "input-error" : ""}`}
          type="text"
          placeholder="Enter your question"
          value={questions[0].question}
          onChange={handleQuestionChange}
        />
        {errors.question && <p className="error-msg">{errors.question}</p>}

        <p className="form-section-label">Expiry (optional)</p>
        <input
          id="expiry-input"
          className="main-input"
          type="datetime-local"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
        />

        <p className="form-section-label">Options</p>
        <div id="options-list">
          {questions[0].options.map((option, index) => (
            <div className="option-row" id={`option-row-${index}`} key={index}>
              <span className="option-dot" aria-hidden="true" />
              <input
                className={`main-input ${errors.options ? "input-error" : ""}`}
                id={`option-input-${index}`}
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option.text}
                onChange={(e) => handleOptionChange(e, index)}
              />
              {/* ✅ remove button — hidden when only 2 options */}
              {questions[0].options.length > 2 && (
                <button
                  className="remove-option-btn"
                  onClick={() => handleRemoveOption(index)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.options && <p className="error-msg">{errors.options}</p>}

        <button id="add-option-btn" onClick={handleAddOption}>
          + Add option
        </button>

        <button id="create-poll-btn" onClick={handleCreatePoll}>
          {id ? "Update poll" : "Create poll"}
        </button>
      </div>
    </div>
  );
}

export default CreatePoll;
