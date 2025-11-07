import { useState } from "react";
import Nav from "../comps/Nav.jsx";
import ProfileCard from "../comps/ProfileCard.jsx";
import ProfileEdit from "./ProfileEdit.jsx";

const Profile = () => {
  const [editShowing, setEditShowing] = useState(false);
  const [userId, setUserId] = useState(null);

  return (
    <div className="flex gap-0 md:gap-8 pb-16 md:pb-0">
      <Nav />
      <ProfileCard
        isAccount={true}
        setUserId={setUserId}
        setEditShowing={setEditShowing}
      />
      <ProfileEdit editShowing={editShowing} setEditShowing={setEditShowing} userId={userId} />
    </div>
  );
};
export default Profile;
