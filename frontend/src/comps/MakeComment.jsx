import { useLayoutEffect, useRef, useState } from "react";
import { API_URL } from "../config";

const MakeComment = ({ postId, authorId, onAddComment }) => {
  const [content, setContent] = useState("");
  const textareaRef = useRef(null);
  const token = localStorage.getItem("token");

  const resizeTextarea = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  };

  useLayoutEffect(() => {
    resizeTextarea();
  }, [content]);

  const submitComment = async () => {
    if (content.trim() == "") return;
    try {
      const response = await fetch(`${API_URL}/comment/make`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, authorId, content }),
      });

      const data = await response.json();
      if (response.ok) {
        setContent("");
        if (onAddComment) onAddComment(data.comment);
      }
    } catch (error) {
      // Error posting comment
    }
  };

  return (
    <div className="flex px-5 py-3 gap-4 border-b-2 border-[#544c46]">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onInput={resizeTextarea}
        placeholder="Post you'r reply"
        rows={1}
        className="resize-none placeholder-[#d6d2c0] overflow-hidden mb-8 box-border w-full min-h-[44px]  mt- text-[#f4f3ee]  text-[1.2rem] leading-relaxed bg-transparent focus:outline-none placeholder:text-gray-400"
        style={{ height: "auto" }}
      />
      <button
        onClick={submitComment}
        className={`${content.trim() == "" ? "bg-[#d6d2c0]" : "bg-[#f4f3ee]"} text-[1rem] py-1 px-3 rounded-xl font-bold  mt-auto`}
      >
        Reply
      </button>
    </div>
  );
};
export default MakeComment;
