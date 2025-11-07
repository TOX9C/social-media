import { useState, useEffect } from "react";
import Post from "../comps/Post.jsx";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const ProfileUserCard = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const followRequest = async () => {
    try {
      const responce = await fetch(`${API_URL}/follow/request`, {
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
      const responce = await fetch(`${API_URL}/search/searchUser`, {
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
      const responce = await fetch(`${API_URL}/post/userPosts`, {
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

  if (loading) return (
    <div className="flex items-center justify-center h-screen w-full md:w-[50%] bg-[#463f3a]">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-[#544c46] border-t-[#f4f3ee] rounded-full animate-spin"></div>
        <p className="mt-4 text-[#d6d2c0]">Loading profile...</p>
      </div>
    </div>
  );

  return (
    <div className="overflow-y-auto scrollbar-hide h-screen w-full md:w-[50%] border-r-0 md:border-r-2 border-l-0 md:border-l-2 border-[#544c46] text-[#d6d2c0]">
      <div className="w-full flex flex-col min-h-fit shrink-0 justify-start border-[#544c46] border-b-2 py-3 px-3 md:px-4">
        <div className="shrink-0 flex mb-3 gap-2 md:gap-3 flex-wrap items-start">
          <div
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-black shrink-0"
            style={{
              backgroundImage: user.pfpUrl ? `url(${user.pfpUrl})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <div className="font-bold text-[1.1rem] md:text-[1.4rem] text-[#f4f3ee] flex items-center">
            {user.username}
          </div>
          {isFollowing == "PENDING" ? (
            <button className="ml-auto self-start border-2 border-[#544c46] rounded-3xl py-1 px-3 text-[#f4f3ee] cursor-pointer text-sm">
              Request Sent
            </button>
          ) : isFollowing == "ACCEPTED" ? (
            <button className="ml-auto self-start border-2 border-[#544c46] rounded-3xl py-1 px-3 text-[#f4f3ee] cursor-pointer text-sm">
              Following
            </button>
          ) : (
            <button
              onClick={followRequest}
              className="ml-auto self-start border-2 border-[#544c46] rounded-3xl py-1 px-3 text-[#f4f3ee] cursor-pointer text-sm"
            >
              Follow
            </button>
          )}
        </div>
        <div className="flex gap-3 md:gap-4 text-sm md:text-base">
          <div className="flex gap-1 md:gap-2">
            <p className="font-bold text-[#f4f3ee]">{user._count.followers}</p>
            <p className="text-[#d6d2c0]">followers</p>
          </div>
          <div className="flex gap-1 md:gap-2">
            <p className="font-bold text-[#f4f3ee]">{user._count.following}</p>
            <p className="text-[#d6d2c0]">following</p>
          </div>
        </div>
      </div>
      <div>
        <div className="flex border-[#544c46] text-[#f4f3ee] text-center border-b-2 w-full font-bold text-base md:text-[1.1rem]">
          <p className="w-[50%] py-2 cursor-pointer">Posts</p>
          <p className="border-l-2 py-2 border-[#544c46] w-[50%] cursor-pointer">
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
