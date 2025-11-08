import React, { useRef, useState, useLayoutEffect } from "react";
import { API_URL } from "../config";

const MakePost = ({ setPosts }) => {
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

  const handleMakePost = async () => {
    try {
      if (content.trim() == "") return;
      const response = await fetch(`${API_URL}/post/make`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      if (response.ok) {
        setContent("");
        console.log(data.message);
        setPosts((prev) => [data.post, ...prev]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="border-b-2 border-[#544c46] flex items-start pb-3 py-2 px-5 gap-5">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onInput={resizeTextarea}
        placeholder="What's happening?"
        rows={1}
        className="resize-none placeholder-[#d6d2c0] overflow-hidden mb-8 box-border w-full min-h-[44px]  mt- text-[#f4f3ee]  text-[1.2rem] leading-relaxed bg-transparent focus:outline-none placeholder:text-gray-400"
        style={{ height: "auto" }}
      />
      <button
        className={`${content.trim() == "" ? "bg-[#d6d2c0]" : "bg-[#f4f3ee]"} text-[1.1rem] py-1 px-3 rounded-xl font-bold  mt-auto`}
        onClick={handleMakePost}
      >
        Post
      </button>
    </div>
  );
};

export default MakePost;
