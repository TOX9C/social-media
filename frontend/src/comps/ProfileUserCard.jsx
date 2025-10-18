import { useState, useEffect } from "react";
import Post from "../comps/Post.jsx";
import { useNavigate } from "react-router-dom";

const ProfileUserCard = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const followRequest = async () => {
    try {
      const responce = await fetch("http://localhost:3000/follow/request", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ followingId: userId }),
      });
      const data = await responce.json();
      if (responce.ok) {
        setIsFollowing("PENDING");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getInfo = async () => {
    try {
      const responce = await fetch("http://localhost:3000/search/searchUser", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ searchId: userId }),
      });
      const data = await responce.json();
      if (responce.ok) {
        if (data.message == "you") navigate("/profile");
        setUser(data.user);
        setIsFollowing(data.isFollowing.status);
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
        body: JSON.stringify({ userId }),
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
      await getPosts();
    };
    fetchData();
  }, []);

  if (loading) return <div>loading....</div>;

  return (
    <div className="overflow-y-auto scrollbar-hide  h-screen w-[50%] border-r-2 border-l-2 border-[#544c46] text-[#d6d2c0]">
      <div className="w-full flex flex-col h-[10%] shrink-0  justify-start  border-[#544c46] border-b-2">
        <div className="shrink-0 flex mb-2 mt-1 ml-3 gap-3">
          <div
            className="w-14 h-14 rounded-full bg-black"
            style={{
              backgroundImage: user.pfpUrl ? `url(${user.pfpUrl})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <div className="font-bold text-[1.4rem] text-[#f4f3ee]">
            {user.username}
          </div>
          {isFollowing == "PENDING" ? (
            <button className="ml-auto self-start border-2 border-[#544c46] rounded-3xl py-1 px-3 mt-2 mr-2 text-[#f4f3ee] cursor-pointer">
              Request Sent
            </button>
          ) : isFollowing == "ACCEPTED" ? (
            <button className="ml-auto self-start border-2 border-[#544c46] rounded-3xl py-1 px-3 mt-2 mr-2 text-[#f4f3ee] cursor-pointer">
              Following
            </button>
          ) : (
            <button
              onClick={followRequest}
              className="ml-auto self-start border-2 border-[#544c46] rounded-3xl py-1 px-3 mt-2 mr-2 text-[#f4f3ee] cursor-pointer"
            >
              Follow
            </button>
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
        <div className="flex border-[#544c46] text-[#f4f3ee]  text-center border-b-2 w-full font-bold text-[1.1rem]">
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
export default ProfileUserCard;
