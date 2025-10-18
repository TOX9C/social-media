import SearchAndFollow from "../comps/SearchAndFollow";
import Nav from "../comps/Nav.jsx";
import { useEffect, useState } from "react";
import Noti from "../comps/Noti.jsx";

const Notifications = () => {
  const token = localStorage.getItem("token");
  const [notifications, setNotifications] = useState([]);

  const getNotis = async () => {
    try {
      const responce = await fetch("http://localhost:3000/noti/", {
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
      console.log(error);
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
    <div className="flex gap-8">
      <Nav />
      <div className="overflow-y-auto scrollbar-hide border-l-2 border-r-2 border-[#544c46] h-screen w-[50%]">
        <p className="font-bold ml-5 my-4 text-[1.4rem] text-[#f4f3ee] ">
          Notifications
        </p>
        {Object.entries(groupedNotis).map(([group, notis]) => (
          <div key={group} className="border-[#544c46] border-b-2">
            <h2 className="font-bold text-[#d6d2c0] text-lg ml-5 mt-4 mb-4">
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
        ))}
      </div>
      <SearchAndFollow />
    </div>
  );
};
export default Notifications;
