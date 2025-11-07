import { useEffect, useState } from "react";
import Nav from "../comps/Nav.jsx";
import { CiSearch } from "react-icons/ci";
import UserCard from "../comps/UserCard.jsx";
import Post from "../comps/Post.jsx";
import { useLocation } from "react-router-dom";
import { API_URL } from "../config";

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const token = localStorage.getItem("token");
  const [searched, setSearched] = useState(false);

  const location = useLocation();

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [searchLoadin, setSearchLoading] = useState(false);

  useEffect(() => {
    if (location.state) {
      const value = location.state.value;
      window.history.replaceState({}, "");
      setSearchValue(value);
      setSearched(true);
      submitSearch(value);
    }
  }, []);

  const submitSearch = async (value) => {
    if (value.trim() == "") return console.log("noo");
    setSearchLoading(true);
    setPosts([]);
    setUsers([]);
    try {
      const responce = await fetch(`${API_URL}/search`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value }),
      });
      const data = await responce.json();
      if (responce.ok) {
        setUsers(data.users);
        setPosts(data.posts);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSearchLoading(false);
      setSearched(true);
    }
  };

  const search = (event) => {
    if (event.key == "Enter") {
      submitSearch(searchValue);
    }
  };

  return (
    <div className="flex gap-0 md:gap-8 pb-16 md:pb-0">
      <Nav />
      <div className="overflow-y-auto scrollbar-hide border-l-0 md:border-l-2 border-r-0 md:border-r-2 border-[#544c46] h-screen w-full md:w-[50%]">
        <div className="mt-3 text-[1.2rem] mx-5 flex items-center gap-2 border-2 border-[#544c46] rounded-3xl py-1 px-4 text-[#f4f3ee]">
          <CiSearch />
          <input
            type="text"
            placeholder="Search"
            value={searchValue}
            onKeyDown={search}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            className="bg-transparent focus:outline-none focus:border-none placeholder-[#d6d2c0] text-[#f4f3ee] w-full"
          />
        </div>

        {searchLoadin ? (
          <div>loading...</div>
        ) : (
          <div className="flex flex-col ">
            <div>
              {!Array.isArray(users) || (!users.length && searched) ? (
                <div className="font-bold text-[#f4f3ee] text-[1.1rem] ml-5 mt-5 mb-5">
                  No Users
                </div>
              ) : (
                users.map((user) => {
                  return (
                    <div className="border-b-2 border-[#544c46] text-[#f4f3ee] px-3 py-2">
                      <UserCard
                        username={user.username}
                        userId={user.id}
                        key={user.id}
                        pfpUrl={user.pfpUrl}
                      />
                    </div>
                  );
                })
              )}
            </div>

            <div>
              {!Array.isArray(posts) || (!posts.length && searched) ? (
                <div className="text-[#f4f3ee] font-bold mt-5 ml-5 text-[1.1rem] ">
                  No posts
                </div>
              ) : (
                posts.map((post) => {
                  return (
                    <Post
                      key={post.id}
                      content={post.content}
                      username={post.user.username}
                      time={post.created_at}
                      likes={post._count.likes}
                      commentCount={post._count.comments}
                      pfpUrl={post.user.pfpUrl}
                    />
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Search;
