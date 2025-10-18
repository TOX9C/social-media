import { useEffect, useState } from "react";
import Nav from "../comps/Nav.jsx";
import { socket } from "../socket.js";
import FriendList from "../comps/FriendList.jsx";
import MessageBox from "../comps/MessageBox.jsx";

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
      const responce = await fetch("http://localhost:3000/message/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-type": "application/json",
        },
      });
      const data = await responce.json();
      if (responce.ok) {
        const sorted = data.latestMessage.sort(
          (a, b) => new Date(b.message.created_at - a.message.created_at),
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
      const responce = await fetch("http://localhost:3000/message/history", {
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
    <div className="flex gap-8">
      <Nav />
      <div className=" border-l-2 border-r-2  border-[#544c46] h-screen w-[55%]">
        <div className="flex w-full h-screen">
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
      </div>
    </div>
  );
};
export default Messages;
