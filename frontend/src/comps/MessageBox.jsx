import { useEffect, useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa6";
import { socket } from "../socket.js";
import MessageBubble from "./MessageBubble.jsx";

const MessageBox = ({
  user,
  messages,
  windowLoading,
  setFriends,
  setMessages,
}) => {
  const [content, setContent] = useState("");
  const bottomRef = useRef(null);

  const sendMessage = () => {
    if (content.trim() == "") return;
    socket.emit("sendMessage", { receiverId: user.id, content });
    setContent("");

    const date = new Date();
    setFriends((prev) =>
      [...prev]
        .map((item) =>
          item.friend.id === user.id
            ? {
              friend: item.friend,
              message: {
                content,
                created_at: date.toISOString(),
                receiverId: user.id,
              },
            }
            : item,
        )
        .sort(
          (a, b) =>
            new Date(b.message.created_at) - new Date(a.message.created_at),
        ),
    );

    setMessages((prev) => [
      ...prev,
      {
        content: content,
        created_at: date.toISOString(),
        receiverId: user.id,
      },
    ]);
  };

  useEffect(() => {
    if (bottomRef) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-col w-full h-full flex overflow-hidden">
      <div className="border-b-2 border-[#544c46] bg-[#463f3a] text-[#f4f3ee] font-bold text-base md:text-[1.3rem] px-3 py-3 flex gap-2 md:gap-3 items-center shrink-0">
        <div
          className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-black shrink-0"
          style={{
            backgroundImage: user.pfpUrl ? `url(${user.pfpUrl})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <p className="truncate">{user.username}</p>
      </div>
      <div className="overflow-y-auto gap-2 flex flex-col scrollbar-hide flex-1 w-full px-3">
        {messages.map((message, index) => {
          return (
            <MessageBubble
              key={index}
              userId={user.id}
              content={message.content}
              time={message.created_at}
              who={message.receiverId}
            />
          );
        })}
        <div ref={bottomRef}></div>
      </div>
      <div className="w-full flex gap-3 px-3 py-3 items-center shrink-0 border-t border-[#544c46]">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          type="text"
          className="w-full bg-[#58524d] text-[#f4f3ee] text-base md:text-[1.2rem] rounded-3xl focus:outline-none focus:border-none px-4 md:px-5 py-2"
        />
        <button className="text-[#f4f3ee] text-lg" onClick={sendMessage}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};
export default MessageBox;
