import { useNavigate } from "react-router-dom";

const UserCard = ({ pfpUrl, username, userId }) => {
  const navigate = useNavigate();

  const goProfile = () => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div
      onClick={goProfile}
      className="flex items-center rounded-3xl px-2 py-2 gap-2 hover:bg-[#8a817c] "
    >
      <div
        className="w-9 h-9 rounded-full bg-black"
        style={{
          backgroundImage: pfpUrl ? `url(${pfpUrl})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <p className="text-[1.2rem]">@{username}</p>
      <button className="ml-auto text-[#463f3a] bg-[#f4f3ee] font-bold rounded-2xl py-1 text-[.9rem] px-3">
        Follow
      </button>
    </div>
  );
};
export default UserCard;
