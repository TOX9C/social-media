import { useState } from "react";
import Nav from "../comps/Nav.jsx";
import ProfileCard from "../comps/ProfileCard.jsx";
import ProfileEdit from "./ProfileEdit.jsx";

const Profile = () => {
  const [editShowing, setEditShowing] = useState(false);
  const [userId, setUserId] = useState(null);

  return (
    <div className="flex gap-8 ">
      <Nav />
      <ProfileCard
        isAccount={true}
        setUserId={setUserId}
        setEditShowing={setEditShowing}
      />
      <ProfileEdit editShowing={editShowing} userId={userId} />
    </div>
  );
};
export default Profile;
