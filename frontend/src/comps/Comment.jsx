const Comment = ({ pfpUrl, username, content, time }) => {
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
  return (
    <div className="flex flex-col border-b-2 border-[#544c46] p-3 text-[#f4f3ee]">
      <div className="flex gap-2 items-center ">
        <div
          className="w-8 h-8 rounded-full bg-black"
          style={{
            backgroundImage: pfpUrl ? `url(${pfpUrl})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <p>{username}</p>
      </div>
      <p className="mt-1 pl-1">{content}</p>
      <p className="text-[#d6d2c0] ml-auto">{formatPostTime(time)}</p>
    </div>
  );
};
export default Comment;
