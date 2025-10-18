import { useEffect, useState } from "react";
import Post from "./Post";
import { useNavigate } from "react-router-dom";

const ProfileCard = ({ isAccount, setEditShowing, setUserId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const getInfo = async () => {
    try {
      const responce = await fetch("http://localhost:3000/auth/me", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await responce.json();
      if (responce.ok) {
        setUser(data.user);
        setUserId(data.user.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPosts = async () => {
    try {
      const responce = await fetch("http://localhost:3000/post/userPosts", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await responce.json();
      if (responce.ok) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getInfo();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      getPosts();
    }
  }, [user]);

  if (loading) return <div>loading....</div>;
  return (
    <div className="shrink-0 overflow-y-auto scrollbar-hide  h-screen w-[50%] border-r-2 border-l-2 border-[#544c46] text-[#d6d2c0]">
      <div className="w-full flex flex-col h-[10%] shrink-0  justify-start  border-[#544c46] border-b-2">
        <div className="shrink-0 flex mb-2 mt-1 ml-3 gap-3">
          <div
            className="w-16 h-16 rounded-full bg-black"
            style={{
              backgroundImage: user.pfpUrl ? `url(${user.pfpUrl})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <div className="font-bold text-[1.4rem] text-[#f4f3ee]">
            {user.username}
          </div>
          {isAccount ? (
            <div className="ml-auto flex items-start ">
              <div
                onClick={() => setEditShowing((prev) => !prev)}
                className=" border-[#544c46] px-2 py-1 mr-2 mt-2 cursor-pointer  rounded-3xl border-2 "
              >
                Edit Profile
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
                className=" border-[#544c46] text-red-500 px-2 py-1 mr-2 mt-2 cursor-pointer  rounded-3xl border-2 "
              >
                Logout
              </button>
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="flex gap-3 ml-3 mb-2">
          <div className="flex gap-3">
            <p className="font-bold text-[#f4f3ee]">{user._count.followers}</p>
            <p className=" text-[#d6d2c0]">followers</p>
          </div>
          <div className="flex gap-3">
            <p className="font-bold text-[#f4f3ee]">{user._count.following}</p>
            <p className="text-[#d6d2c0]">following</p>
          </div>
        </div>
      </div>
      <div>
        <div className="flex border-[#544c46] text-[#f4f3ee] text-center border-b-2 w-full font-bold text-[1.1rem]">
          <p className="w-[50%] m-1 cursor-pointer">Posts</p>
          <p className="border-l-2 m-1 border-[#544c46] w-[50%] cursor-pointer">
            Likes
          </p>
        </div>
        <div>
          {posts.map((post) => {
            return (
              <Post
                key={post.id}
                postId={post.id}
                username={post.user.username}
                content={post.content}
                time={post.created_at}
                likes={post._count.likes}
                commentCount={post._count.comments}
                pfpUrl={post.user.pfpUrl}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default ProfileCard;
