import { useState } from "react";
import MessageUserBox from "./MessageUserBox";

const FriendList = ({ friends, setSelectedUser, selectedUser }) => {
  return (
    <div className=" overflow-y-auto scrollbar-hide w-[55%] border-r-2 border-[#544c46]">
      <p className="border-b-2 border-[#544c46] text-[#f4f3ee] font-bold text-[1.3rem] pl-3 py-1">
        Messages
      </p>
      <div>
        {friends.map((friend, index) => {
          return (
            <MessageUserBox
              key={friend.friend.id ?? index}
              id={friend.friend.id}
              username={friend.friend.username}
              who={friend.last}
              message={friend.message}
              setSelectedUser={setSelectedUser}
              selectedUser={selectedUser}
              pfpUrl={friend.friend.pfpUrl}
            />
          );
        })}
      </div>
    </div>
  );
};
export default FriendList;
