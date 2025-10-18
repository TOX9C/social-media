import { useEffect, useState } from "react";
import MakePost from "./MakePost";
import Post from "./Post";

const PostWall = () => {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");
  const getPosts = async () => {
    try {
      const response = await fetch("http://localhost:3000/post/get", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="overflow-y-auto scrollbar-hide border-l-2 border-r-2 border-[#544c46] h-screen w-[50%]">
      <MakePost setPosts={setPosts} />
      {posts.map((post) => {
        return (
          <Post
            userId={post.userId}
            key={post.id}
            postId={post.id}
            content={post.content}
            username={post.user.username}
            likes={post._count.likes}
            commentCount={post._count.comments}
            comments={post.comments}
            time={post.created_at}
            pfpUrl={post.user.pfpUrl}
          />
        );
      })}
    </div>
  );
};
export default PostWall;
