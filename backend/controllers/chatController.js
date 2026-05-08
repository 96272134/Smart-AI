const axios = require("axios");
const Chat = require("../models/Chat");

exports.sendMessage = async (req, res) => {

  const { message, chatId } = req.body;

  try {

    let chat;

    // existing chat
    if (chatId) {

      chat = await Chat.findById(chatId);

      chat.messages.push({
        role: "user",
        content: message,
      });

    } else {

      // create new chat
      chat = await Chat.create({
        userId: req.user,
        title: message.substring(0, 30),
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      });
    }

    // AI API call
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",

        messages: chat.messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiReply =
      response.data.choices[0].message.content;

    // save AI reply
    chat.messages.push({
      role: "assistant",
      content: aiReply,
    });

    await chat.save();

    res.json(chat);

  } catch (error) {

    console.log(error.response?.data || error.message);

    res.status(500).json({
      message: "AI request failed",
    });
  }
};

// GET ALL CHATS
exports.getChats = async (req, res) => {

  try {

    const chats = await Chat.find({
      userId: req.user,
    }).sort({ updatedAt: -1 });

    res.json(chats);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE CHAT
exports.getSingleChat = async (req, res) => {

  try {

    const chat = await Chat.findById(
      req.params.id
    );

    res.json(chat);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete chat

exports.deleteChat = async (req, res) => {

  try {

    await Chat.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Chat deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};