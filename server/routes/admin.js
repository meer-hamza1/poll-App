const express = require("express");
const Poll = require("../models/Poll.js");
const Response = require("../models/Response.js");
const router = express.Router();
const { getIO } = require("../sockets/socket");
const User = require("../models/User.js");

// GET ADMIN STATS
router.get("/stats", async (req, res) => {
  try {
    const totalPolls = await Poll.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalVotes = await Response.countDocuments();

    // most voted poll
    const responses = await Response.find();
    const voteCounts = {};
    responses.forEach((r) => {
      const key = r.pollId.toString();
      voteCounts[key] = (voteCounts[key] || 0) + 1;
    });

    let topPollId = null;
    let topCount = 0;
    Object.entries(voteCounts).forEach(([pollId, count]) => {
      if (count > topCount) {
        topCount = count;
        topPollId = pollId;
      }
    });

    let topPoll = null;
    if (topPollId) {
      const poll = await Poll.findById(topPollId);
      if (poll) topPoll = { title: poll.title, votes: topCount };
    }

    // recent polls (last 5)
    const recentPolls = await Poll.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title createdAt questions");

    // polls per day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentPollsAll = await Poll.find({
      createdAt: { $gte: sevenDaysAgo },
    }).select("createdAt");

    const pollsPerDay = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-US", { weekday: "short" });
      pollsPerDay[key] = 0;
    }

    recentPollsAll.forEach((poll) => {
      const key = new Date(poll.createdAt).toLocaleDateString("en-US", {
        weekday: "short",
      });
      if (pollsPerDay[key] !== undefined) pollsPerDay[key]++;
    });

    res.status(200).json({
      success: true,
      stats: {
        totalPolls,
        totalUsers,
        totalVotes,
        topPoll,
        recentPolls,
        pollsPerDay: Object.entries(pollsPerDay).map(([day, count]) => ({
          day,
          count,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;