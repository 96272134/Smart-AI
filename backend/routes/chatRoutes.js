const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  sendMessage,
  getChats,
  getSingleChat,
  deleteChat,
} = require("../controllers/chatController");

const router = express.Router();

router.post("/", protect, sendMessage);

router.get("/", protect, getChats);

router.get("/:id", protect, getSingleChat);

router.delete("/:id", protect, deleteChat);

module.exports = router;