const MessageUserBox = ({
  username,
  id,
  message,
  who,
  time,
  selectedUser,
  setSelectedUser,
  pfpUrl,
}) => {
  let seenMessage = "";
  if (message && message.content) {
    if (message.content.length > 20) {
      seenMessage = message.content.slice(0, 15) + "...";
    } else {
      seenMessage = message.content;
    }
  }
  return (
    <div
      onClick={() => setSelectedUser({ username, id, pfpUrl })}
      className={`border-b-2 hover:bg-[#58524d] gap-3 flex items-center border-[#544c46] px-3 py-2 cursor-pointer ${selectedUser == id ? "bg-[#58524d]" : ""}`}
    >
      <div
        className="w-11 h-11 rounded-full bg-black"
        style={{
          backgroundImage: pfpUrl ? `url(${pfpUrl})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      {who == "none" ? (
        <div className="">
          <p className="font-bold text-[#f4f3ee]">{username}</p>
          <p className="text-[0.9rem] text-[#d6d2c0]"> No messages yet</p>
        </div>
      ) : (
        <div>
          <p className="font-bold text-[#f4f3ee]">{username}</p>
          <p className="text-[0.9rem] text-[#d6d2c0]">{seenMessage}</p>
          <p className="text-[0.9rem] text-[#d6d2c0]">{time}</p>
        </div>
      )}
    </div>
  );
};
export default MessageUserBox;
