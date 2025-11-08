import { useState } from "react";
import { FaRegComment } from "react-icons/fa";
import { IoMdHeartEmpty } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const Post = ({
  userId,
  postId,
  content,
  username,
  likes,
  commentCount,
  time,
  pfpUrl,
}) => {
  const [like, setLike] = useState(likes);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  function formatPostTime(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 12) {
      const diffMinutes = diffMs / (1000 * 60);
      if (diffMinutes < 1) return "Just now";
      if (diffMinutes < 60) return `${Math.floor(diffMinutes)}m ago`;
      return `${Math.floor(diffHours)}h ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      });
    }
  }

  const likePost = async () => {
    try {
      const responce = await fetch(`${API_URL}/post/like`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId }),
      });
      const data = await responce.json();
      if (responce.ok) {
        if (data.message == "liked") {
          setLike((prev) => prev + 1);
        } else if (data.message == "unliked") {
          setLike((prev) => prev - 1);
        }
      }
    } catch (error) {
      // Error liking post
    }
  };

  const goPost = () => {
    navigate(`/post/${postId}`);
  };
  const goProfile = () => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="border-b-2 border-[#544c46] p-3 md:p-4 text-[#f4f3ee]">
      <div
        onClick={goProfile}
        className="flex cursor-pointer items-center gap-2 md:gap-3 select-none"
      >
        <div
          className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black shrink-0"
          style={{
            backgroundImage: pfpUrl ? `url(${pfpUrl})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <span className="text-sm md:text-base font-medium">{username}</span>
      </div>
      <p className="mt-2 text-sm md:text-base leading-relaxed select-text">{content}</p>
      <div className="flex gap-4 md:gap-6 mt-2 w-full justify-start text-sm md:text-base select-none">
        <div
          onClick={goPost}
          className="flex items-center gap-1 md:gap-2 text-[#d6d2c0] cursor-pointer"
        >
          <FaRegComment />
          {commentCount}
        </div>
        <div
          onClick={likePost}
          className="flex cursor-pointer items-center gap-1 md:gap-2 text-[#d6d2c0]"
        >
          <IoMdHeartEmpty />
          {like}
        </div>
        <p className="text-[#d6d2c0] ml-auto text-xs md:text-sm">{formatPostTime(time)}</p>
      </div>
    </div>
  );
};
export default Post;
