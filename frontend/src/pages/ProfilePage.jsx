import { useParams } from "react-router-dom";
import Nav from "../comps/Nav.jsx";
import ProfileUserCard from "../comps/ProfileUserCard.jsx";

const ProfilePage = () => {
  const { userId } = useParams();
  return (
    <div className="flex gap-8">
      <Nav />
      <ProfileUserCard userId={userId} />
    </div>
  );
};
export default ProfilePage;
