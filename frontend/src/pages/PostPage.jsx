import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Nav from "../comps/Nav";
import SearchAndFollow from "../comps/SearchAndFollow";
import Post from "../comps/Post.jsx";
import Comment from "../comps/Comment.jsx";
import MakeComment from "../comps/MakeComment.jsx";

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  const getPost = async () => {
    try {
      const responce = await fetch("http://localhost:3000/post/post", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId }),
      });
      const data = await responce.json();
      setPost(data.post);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex gap-0 md:gap-8 pb-16 md:pb-0">
      <Nav />
      <div className="overflow-y-auto scrollbar-hide border-l-0 md:border-l-2 border-r-0 md:border-r-2 border-[#544c46] h-screen w-full md:w-[50%]">
        <Post
          key={post.id}
          id={post.id}
          content={post.content}
          username={post.user.username}
          likes={post._count.likes}
          commentCount={post._count.comments}
          time={post.created_at}
          pfpUrl={post.user.pfpUrl}
        />
        <MakeComment
          postId={post.id}
          authorId={post.userId}
          onAddComment={(newComment) => {
            setPost((prevPost) => ({
              ...prevPost,
              comments: [newComment, ...prevPost.comments],
              _count: {
                ...prevPost._count,
                comments: prevPost._count.comments + 1,
              },
            }));
          }}
        />
        {post.comments.map((comment) => {
          return (
            <Comment
              key={comment.id}
              content={comment.content}
              time={comment.created_at}
              username={comment.user.username}
              pfpUrl={comment.user.pfpUrl}
            />
          );
        })}
      </div>
      <div className="hidden md:block">
        <SearchAndFollow />
      </div>
    </div>
  );
};
export default PostPage;
