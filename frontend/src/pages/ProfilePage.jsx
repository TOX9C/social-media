import { useParams } from "react-router-dom";
import Nav from "../comps/Nav.jsx";
import ProfileUserCard from "../comps/ProfileUserCard.jsx";

const ProfilePage = () => {
  const { userId } = useParams();
  return (
    <div className="flex gap-0 md:gap-8 pb-16 md:pb-0">
      <Nav />
      <ProfileUserCard userId={userId} />
    </div>
  );
};
export default ProfilePage;
