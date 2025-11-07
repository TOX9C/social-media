import { useEffect, useState } from "react";
import Nav from "../comps/Nav.jsx";
import { socket } from "../socket.js";
import FriendList from "../comps/FriendList.jsx";
import MessageBox from "../comps/MessageBox.jsx";
import { API_URL } from "../config";

const Messages = () => {
    const [friends, setFriends] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [windowLoading, setWindowLoading] = useState(false);

    socket.on("receiveMessage", ({ message }) => {
        if (!message) return;
        setFriends((prev) =>
            prev.map((item) =>
                item.friend.id === message.senderId
                    ? { friend: item.friend, message, last: item.friend.username }
                    : item,
            ),
        );
        if (message.senderId == selectedUser.id) {
            setMessages((prev) => [...prev, message]);
        }
    });

    const getList = async () => {
        try {
            const responce = await fetch(`${API_URL}/message/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-type": "application/json",
                },
            });
            const data = await responce.json();
            if (responce.ok) {
                const sorted = data.latestMessage
                    .filter(item => item.message) // Remove items with null messages
                    .sort((a, b) =>
                        new Date(b.message.created_at) - new Date(a.message.created_at)
                    );
                setFriends(sorted);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getHistory = async () => {
        if (selectedUser == null) return;
        setWindowLoading(true);
        try {
            const responce = await fetch(`${API_URL}/message/history`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ otherId: selectedUser.id }),
            });
            const data = await responce.json();
            if (responce.ok) {
                setMessages(data.messages);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setWindowLoading(false);
        }
    };

    useEffect(() => {
        getList();
    }, []);

    useEffect(() => {
        getHistory();
    }, [selectedUser]);

    return (
        <div className="flex gap-0 md:gap-8 h-screen overflow-hidden">
            <Nav />
            <div className="border-l-0 md:border-l-2 border-r-0 md:border-r-2 border-[#544c46] h-screen w-full md:w-[55%] overflow-hidden pb-16 md:pb-0">
                <div className="flex w-full h-full">
                    {/* Desktop: Show both friend list and message box */}
                    <div className="hidden md:flex w-full h-full">
                        <FriendList
                            friends={friends}
                            setSelectedUser={setSelectedUser}
                            selectedUser={selectedUser}
                        />
                        {selectedUser == null ? (
                            <div className="overflow-y-auto scrollbar-hide w-full"></div>
                        ) : (
                            <MessageBox
                                windowLoading={windowLoading}
                                setMessages={setMessages}
                                setFriends={setFriends}
                                user={selectedUser}
                                messages={messages}
                            />
                        )}
                    </div>

                    {/* Mobile: Show friend list or message box based on selection */}
                    <div className="md:hidden w-full h-full flex flex-col">
                        {selectedUser == null ? (
                            <FriendList
                                friends={friends}
                                setSelectedUser={setSelectedUser}
                                selectedUser={selectedUser}
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col overflow-hidden">
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="text-[#f4f3ee] bg-[#463f3a] border-b-2 border-[#544c46] px-3 py-3 text-left shrink-0 flex items-center gap-2"
                                >
                                    <span className="text-lg">←</span>
                                    <span>Back to Messages</span>
                                </button>
                                <div className="flex-1 overflow-hidden">
                                    <MessageBox
                                        windowLoading={windowLoading}
                                        setMessages={setMessages}
                                        setFriends={setFriends}
                                        user={selectedUser}
                                        messages={messages}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Messages;
