import SearchAndFollow from "../comps/SearchAndFollow";
import Nav from "../comps/Nav.jsx";
import { useEffect, useState } from "react";
import Noti from "../comps/Noti.jsx";
import { API_URL } from "../config";

const Notifications = () => {
  const token = localStorage.getItem("token");
  const [notifications, setNotifications] = useState([]);

  const getNotis = async () => {
    try {
      const responce = await fetch(`${API_URL}/noti/`, {
        method: "GET",
        headers: {
          "Content-type": "application",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await responce.json();
      if (responce.ok) {
        setNotifications(data.notis);
      }
    } catch (error) {
      // Error fetching notifications
    }
  };

  function groupNotifications(notifications) {
    const grouped = {
      Today: [],
      Yesterday: [],
      "This Week": [],
      Earlier: [],
    };

    const now = new Date();

    for (const n of notifications) {
      const date = new Date(n.created_at);
      const diffMs = now - date;
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (diffDays < 1) {
        grouped.Today.push(n);
      } else if (diffDays < 2) {
        grouped.Yesterday.push(n);
      } else if (diffDays < 7) {
        grouped["This Week"].push(n);
      } else {
        grouped.Earlier.push(n);
      }
    }
    return Object.fromEntries(
      Object.entries(grouped).filter(([_, arr]) => arr.length),
    );
  }

  const removeNoti = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    getNotis();
  }, []);
  const groupedNotis = groupNotifications(notifications);

  return (
    <div className="flex gap-0 md:gap-8 pb-16 md:pb-0">
      <Nav />
      <div className="overflow-y-auto scrollbar-hide border-l-0 md:border-l-2 border-r-0 md:border-r-2 border-[#544c46] h-screen w-full md:w-[50%]">
        <p className="font-bold px-4 md:px-5 py-3 md:py-4 text-xl md:text-[1.4rem] text-[#f4f3ee] border-b border-[#544c46]">
          Notifications
        </p>
        {Object.keys(groupedNotis).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-[#d6d2c0]">
            <p className="text-lg">No notifications yet</p>
          </div>
        ) : (
          Object.entries(groupedNotis).map(([group, notis]) => (
            <div key={group} className="border-[#544c46] border-b-2">
              <h2 className="font-bold text-[#d6d2c0] text-sm md:text-lg px-4 md:px-5 pt-3 md:pt-4 pb-2">
                {group}
              </h2>
              {notis.map((noti) => (
                <Noti
                  key={noti.id}
                  username={noti.triggerBy.username}
                  id={noti.id}
                  time={noti.created_at}
                  type={noti.type}
                  postId={noti.postId}
                  triggerById={noti.triggerById}
                  userId={noti.userId}
                  removeNoti={removeNoti}
                  pfpUrl={noti.triggerBy.pfpUrl}
                />
              ))}
            </div>
          ))
        )}
      </div>
      <div className="hidden md:block">
        <SearchAndFollow />
      </div>
    </div>
  );
};
export default Notifications;
