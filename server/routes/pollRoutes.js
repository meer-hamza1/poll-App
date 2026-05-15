const express = require("express");
const Poll = require("../models/Poll.js");
const Response = require("../models/Response.js");
const router = express.Router();
const { getIO } = require("../sockets/socket");
const authMiddleware = require("../middleware/authMiddleware.js");

// CREATE POLL ✅
router.post("/", authMiddleware, async (req, res) => {
  try {
    const poll = await Poll.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(200).json({ success: true, poll });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET ALL POLLS — only current user's polls ✅
router.get("/", authMiddleware, async (req, res) => {
  try {
    const polls = await Poll.find({ createdBy: req.user._id });

    res.status(200).json({ success: true, polls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET SINGLE POLL — no auth needed (for voting page)
router.get("/:id", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ success: false, message: "Poll not found" });
    }

    res.status(200).json({ success: true, poll });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// SUBMIT RESPONSE — no auth needed (anyone can vote)
router.post("/:id/response", async (req, res) => {
  try {
    const pollId = req.params.id;
    const { answers } = req.body;

    const poll = await Poll.findById(pollId);

    if (poll.expiresAt && new Date() > new Date(poll.expiresAt)) {
      return res.status(400).json({
        success: false,
        message: "Poll expired. You cannot vote now.",
      });
    }

    const response = await Response.create({ pollId, answers });

    answers.forEach((answer) => {
      const question = poll.questions.id(answer.questionId);
      if (question) {
        const option = question.options.find(
          (opt) => opt.text === answer.selectedOption
        );
        if (option) option.votes += 1;
      }
    });

    await poll.save();
    getIO().emit("pollUpdated");

    res.status(201).json({ success: true, response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET POLL ANALYTICS ✅
router.get("/:id/analytics", authMiddleware, async (req, res) => {
  try {
    const poll = await Poll.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!poll) {
      return res.status(404).json({ success: false, message: "Poll not found" });
    }

    const responses = await Response.find({ pollId: req.params.id });

    const questions = poll.questions.map((question) => {
      const options = question.options.map((option) => {
        let voteCount = 0;

        responses.forEach((response) => {
          const answer = response.answers.find(
            (a) => a.questionId === question._id.toString()
          );
          if (answer && answer.selectedOption === option) voteCount++;
        });

        return { text: option, votes: voteCount };
      });

      return { question: question.question, options };
    });

    res.status(200).json({
      success: true,
      analytics: {
        pollTitle: poll.title,
        totalResponse: responses.length,
        questions,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE POLL ✅
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const poll = await Poll.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found or not authorized",
      });
    }

    await Poll.findByIdAndDelete(req.params.id);
    await Response.deleteMany({ pollId: req.params.id });

    res.status(200).json({ success: true, message: "Poll deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// EDIT POLL ✅
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const poll = await Poll.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found or not authorized",
      });
    }

    const updatedPoll = await Poll.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({ success: true, poll: updatedPoll });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;