import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

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
                `${API_URL}/follow/request/${requestType}`,
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
    console.log(type)

    const deleteNoti = async () => {
        try {
            const responce = await fetch(`${API_URL}/noti/delete`, {
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
        <div className="flex items-start gap-3 px-4 md:px-5 py-2.5 hover:bg-[#3b342f] transition-colors">
            <div
                className="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-full bg-black cursor-pointer"
                onClick={() => navigate(`/profile/${triggerById}`)}
                style={{
                    backgroundImage: pfpUrl ? `url(${pfpUrl})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            ></div>
            {type == "COMMENT" ? (
                <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
                    <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="text-sm md:text-base text-[#f4f3ee]">
                            <span className="font-bold">{username}</span>
                            <span className="ml-1">commented on your post</span>
                        </div>
                        <p className="text-xs text-[#d6d2c0]">{formatPostTime(time)}</p>
                    </div>
                    <button
                        className="shrink-0 text-[#f4f3ee] border border-[#544c46] hover:bg-[#544c46] rounded-full px-3 py-1 text-xs"
                        onClick={goPost}
                    >
                        View
                    </button>
                </div>
            ) : type == "REQUEST_FOLLOW" ? (
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-0.5 mb-2">
                        <div className="text-sm md:text-base text-[#f4f3ee]">
                            <span className="font-bold">{username}</span>
                            <span className="ml-1">sent a follow request</span>
                        </div>
                        <p className="text-xs text-[#d6d2c0]">{formatPostTime(time)}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => answerRequest("accept")}
                            className="text-[#463f3a] bg-[#f4f3ee] font-medium rounded-full py-1 px-3 text-xs"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => answerRequest("reject")}
                            className="border-[#544c46] border text-[#f4f3ee] px-3 py-1 rounded-full text-xs"
                        >
                            Reject
                        </button>
                    </div>
                </div>
            ) : type == "REQUEST_ACCEPT" ? (
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-0.5">
                        <div className="text-sm md:text-base text-[#f4f3ee]">
                            <span className="font-bold">{username}</span>
                            <span className="ml-1">accepted your request</span>
                        </div>
                        <p className="text-xs text-[#d6d2c0]">{formatPostTime(time)}</p>
                    </div>
                </div>
            ) : type == "LIKE" ? (
                <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
                    <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="text-sm md:text-base text-[#f4f3ee]">
                            <span className="font-bold">{username}</span>
                            <span className="ml-1">liked your post</span>
                        </div>
                        <p className="text-xs text-[#d6d2c0]">{formatPostTime(time)}</p>
                    </div>
                    <button
                        className="shrink-0 text-[#f4f3ee] border border-[#544c46] hover:bg-[#544c46] rounded-full px-3 py-1 text-xs"
                        onClick={goPost}
                    >
                        View
                    </button>
                </div>
            ) : <div></div>}
        </div>
    );
};
export default Noti;
