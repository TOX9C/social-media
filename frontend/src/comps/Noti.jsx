import { useNavigate } from "react-router-dom";

const Noti = ({
  removeNoti,
  type,
  username,
  id,
  time,
  postId,
  triggerById,
  userId,
  pfpUrl,
}) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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

  const answerRequest = async (requestType) => {
    try {
      const responce = await fetch(
        `http://localhost:3000/follow/request/${requestType}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            followerId: triggerById,
            followingId: userId,
            id,
          }),
        },
      );

      const data = await responce.json();
      if (responce.ok) {
        console.log(data);
        removeNoti(id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const goPost = () => {
    navigate(`/post/${postId}`);
  };

  const deleteNoti = async () => {
    try {
      const responce = await fetch("http://localhost:3000/noti/delete", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ notiId: id }),
      });
      const data = await responce.json();
      if (responce.ok) {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center mt-2 pb-2  pl-3  gap-5">
      <div
        className="w-10 h-10 shrink-0 rounded-full bg-black"
        style={{
          backgroundImage: pfpUrl ? `url(${pfpUrl})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      {type == "COMMENT" ? (
        <div className="flex gap-1 w-full text-[#f4f3ee]">
          <p className="font-bold text-[1rem] text-[#f4f3ee]">{username}</p>
          Commented on you'r post
          <p className="text-[#d6d2c0]">{formatPostTime(time)}</p>
          <button
            className="ml-auto mr-4 text-[#d6d2c0] cursor-pointer"
            onClick={goPost}
          >
            Go to post
          </button>
        </div>
      ) : type == "REQUEST_FOLLOW" ? (
        <div className="flex gap-1 w-full text-[#f4f3ee]">
          <p className="font-bold">{username}</p>
          <p>Sent a follow request</p>
          <p className="text-[#d6d2c0]">{formatPostTime(time)}</p>
          <div className="ml-auto text-[#d6d2c0] gap-3 flex items-center">
            <button
              onClick={() => answerRequest("accept")}
              className="text-[#463f3a] bg-[#f4f3ee] font-bold rounded-2xl py-1 text-[.9rem] px-3"
            >
              Accept
            </button>
            <button
              onClick={() => answerRequest("reject")}
              className="border-[#544c46] border-2  px-3 py-1 rounded-2xl text-[.9rem]"
            >
              Reject
            </button>
          </div>
        </div>
      ) : type == "REQUEST_ACCEPT" ? (
        <div className="flex gap-1 w-full text-[#f4f3ee]">
          <p className="font-bold">{username}</p>
          <p>Accepted you'r request</p>
          <p className="text-[#d6d2c0]">{formatPostTime(time)}</p>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
export default Noti;
