const MessageBubble = ({ content, who, time, userId }) => {
    if (!userId) return null;
    const me = who == userId;
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
        <div
            className={`${me ? "self-end" : "self-start"} text-[#f4f3ee] flex flex-col mx-2 mt-1 `}
        >
            <div
                className={`${me ? "bg-[#6d9d2e] rounded-bl-lg" : "bg-[#6a6561] rounded-br-lg"} text-[1rem] px-4 py-1 rounded-t-lg select-text`}
            >
                {content.trim()}
            </div>
            <p
                className={`text-[.8rem] ${me ? "ml-auto" : "mr-auto"} text-[#d6d2c0] select-none`}
            >
                {formatPostTime(time)}
            </p>
        </div>
    );
};
export default MessageBubble;
