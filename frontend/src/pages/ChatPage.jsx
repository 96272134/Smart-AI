import { useEffect, useState } from "react";
import API from "../services/api";
import ReactMarkdown from "react-markdown";

import { Prism as SyntaxHighlighter }
from "react-syntax-highlighter";

import { oneDark }
from "react-syntax-highlighter/dist/esm/styles/prism";

function ChatPage() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] =
    useState(null);

  const token = localStorage.getItem("token");

  // fetch all chats
  const fetchChats = async () => {

    try {

      const res = await API.get("/chat", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setChats(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  // load single chat
  const loadChat = async (chatId) => {

    try {

      const res = await API.get(
        `/chat/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedChat(res.data);

      setMessages(res.data.messages);

    } catch (error) {

      console.log(error);
    }
  };

  // Delete Chat 
  const deleteChat = async (chatId) => {

  try {

    await API.delete(
      `/chat/${chatId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // remove from UI
    setChats((prev) =>
      prev.filter(
        (chat) => chat._id !== chatId
      )
    );

    // clear current chat
    if (selectedChat?._id === chatId) {

      setSelectedChat(null);

      setMessages([]);
    }

  } catch (error) {

    console.log(error);
  }
};

  // send message
  const sendMessage = async () => {

    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setLoading(true);

    try {

      const res = await API.post(
        "/chat",
        {
          message,
          chatId: selectedChat?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedChat(res.data);

      setMessages(res.data.messages);

      fetchChats();

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

      setMessage("");
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div className="flex h-screen bg-black text-white">

      {/* SIDEBAR */}
      <div className="w-64 border-r border-gray-800 p-4">

        <h2 className="text-2xl font-bold mb-4">
          Smart AI
        </h2>

        <button
          onClick={() => {
            setSelectedChat(null);
            setMessages([]);
          }}
          className="w-full bg-gray-800 hover:bg-gray-700 p-3 rounded-lg mb-4"
        >
          + New Chat
        </button>

        <div className="space-y-2">

          {chats.map((chat) => (

  <div
    key={chat._id}
    className="p-3 bg-gray-900 hover:bg-gray-800 rounded-lg flex justify-between items-center"
  >

    <div
      onClick={() => loadChat(chat._id)}
      className="cursor-pointer flex-1"
    >
      {chat.title}
    </div>

    <button
      onClick={() => deleteChat(chat._id)}
      className="text-red-500 ml-3"
    >
      ✕
    </button>

  </div>
          ))}

        </div>

      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="border-b border-gray-800 p-4 text-xl font-bold">
          AI Assistant
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {messages.map((msg, index) => (

            <div
              key={index}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`max-w-[70%] p-4 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-blue-600"
                    : "bg-gray-800"
                }`}
              >
               <ReactMarkdown
  components={{
    code({
      inline,
      className,
      children,
      ...props
    }) {

      const match =
        /language-(\w+)/.exec(className || "");

      return !inline && match ? (

        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>

      ) : (

        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  }}
>
  {msg.content}
</ReactMarkdown>
              </div>

            </div>
          ))}

          {loading && (
            <p className="text-gray-400">
              AI is typing...
            </p>
          )}

        </div>

        {/* INPUT */}
        <div className="p-4 border-t border-gray-800 flex gap-3">

          <input
            type="text"
            placeholder="Ask anything..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            className="flex-1 p-4 rounded-xl bg-gray-900 border border-gray-700 outline-none"
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 px-6 rounded-xl"
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
}

export default ChatPage;