import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./PollPage.css";

function PollPage() {
  const [poll, setPoll] = useState(null);
  const [answers, setAnswers] = useState({});
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [copied, setCopied] = useState(false); // ✅ new
  const { id } = useParams();

  useEffect(() => {
    const votedPolls = JSON.parse(localStorage.getItem("votedPolls") || "[]");
    if (votedPolls.includes(id)) {
      setAlreadyVoted(true);
    }

    const fetchPoll = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/polls/${id}`
        );
        setPoll(response.data.poll);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPoll();
  }, [id]);

  useEffect(() => {
    if (!poll?.expiresAt) return;

    const interval = setInterval(() => {
      const diff = new Date(poll.expiresAt) - new Date();

      if (diff <= 0) {
        setTimeLeft(null);
        setIsExpired(true);
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [poll]);

  // ✅ share handler
  const handleShareLink = () => {
    const url = `${window.location.origin}/poll/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSubmitVote = async () => {
    try {
      if (isExpired) {
        alert("Poll has expired");
        return;
      }

      if (Object.keys(answers).length === 0) {
        alert("Please select an option");
        return;
      }

      const formattedAnswers = Object.entries(answers).map(
        ([questionId, selectedOption]) => ({
          questionId,
          selectedOption,
        })
      );

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/polls/${id}/response`,
        { answers: formattedAnswers }
      );

      const votedPolls = JSON.parse(localStorage.getItem("votedPolls") || "[]");
      votedPolls.push(id);
      localStorage.setItem("votedPolls", JSON.stringify(votedPolls));

      setAlreadyVoted(true);
      alert("Vote submitted successfully");

    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  if (!poll) {
    return (
      <div id="poll-page">
        <p id="poll-not-found">No poll found.</p>
      </div>
    );
  }

  if (alreadyVoted) {
    return (
      <div id="poll-page">
        <div id="poll-header">
          <h1 id="poll-title">{poll?.title}</h1>
          {/* ✅ share button on already voted screen too */}
          <button id="share-btn" onClick={handleShareLink}>
            {copied ? "✓ Copied!" : "Share Poll"}
          </button>
        </div>
        <p id="already-voted-msg">You have already voted on this poll.</p>
      </div>
    );
  }

  return (
    <div id="poll-page">
      <div id="poll-header">
        <div id="poll-header-left">
          <h1 id="poll-title">{poll.title}</h1>
          <p id="poll-subtitle">
            Select one option per question, then submit your vote.
          </p>
        </div>

        {/* ✅ share button */}
        <button id="share-btn" onClick={handleShareLink}>
          {copied ? "✓ Copied!" : "Share Poll"}
        </button>
      </div>

      {poll.expiresAt && (
        <div id="countdown-container">
          {isExpired ? (
            <span id="poll-expired-badge">Poll Expired</span>
          ) : timeLeft ? (
            <div id="countdown-timer">
              <span className="countdown-label">Time Left</span>
              <div id="countdown-boxes">
                <div className="countdown-box">
                  <span className="countdown-value">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="countdown-unit">hrs</span>
                </div>
                <span className="countdown-colon">:</span>
                <div className="countdown-box">
                  <span className="countdown-value">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="countdown-unit">min</span>
                </div>
                <span className="countdown-colon">:</span>
                <div className="countdown-box">
                  <span className="countdown-value">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                  <span className="countdown-unit">sec</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      <div id="questions-list">
        {poll.questions.map((question, index) => (
          <div
            className="question-card"
            id={`question-${index + 1}`}
            key={question._id}
          >
            <h2 className="question-text">{question.question}</h2>

            <div className="options-list">
              {question.options?.map((option, optIndex) => (
                <label
                  className="option-label"
                  id={`option-${optIndex}`}
                  key={optIndex}
                >
                  <input
                    type="radio"
                    name={question._id}
                    disabled={isExpired}
                    onChange={() =>
                      setAnswers({ ...answers, [question._id]: option })
                    }
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        id="submit-btn"
        onClick={handleSubmitVote}
        disabled={isExpired}
      >
        {isExpired ? "Poll Ended" : "Submit vote"}
      </button>
    </div>
  );
}

export default PollPage;