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
    if (content.trim() == "") return console.log("no message");
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
    <div className=" flex-col w-full h-full flex">
      <div className="border-b-2 border-[#544c46] mb-3 text-[#f4f3ee] font-bold text-[1.3rem] pl-3 py-1 flex gap-3 items-center">
        <div
          className="w-7 h-7 rounded-full bg-black"
          style={{
            backgroundImage: user.pfpUrl ? `url(${user.pfpUrl})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <p className="">{user.username}</p>
      </div>
      <div className="overflow-y-auto gap-2 flex flex-col scrollbar-hide h-full w-full ">
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
      <div className="w-full flex gap-3 px-3 items-center shrink-0 mb-5">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          type="text"
          className="w-full bg-[#58524d] text-[#f4f3ee] text-[1.2rem] rounded-3xl focus:outline-none  focus:border-none px-5 py-1"
        />
        <button className="text-[#f4f3ee]" onClick={sendMessage}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};
export default MessageBox;
