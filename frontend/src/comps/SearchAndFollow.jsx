import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import UserCard from "./UserCard";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const SearchAndFollow = () => {
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const getUsers = async () => {
    try {
      const responce = await fetch(`${API_URL}/follow/rand`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await responce.json();
      if (responce.ok) {
        setUsers(data.users);
      }
    } catch (error) {
      // Error fetching random users
    }
  };

  const goSearch = () => {
    if (searchValue.trim() == "") return;
    navigate("/search", {
      state: {
        value: searchValue,
      },
    });
  };

  const search = (e) => {
    if (e.key == "Enter") {
      goSearch();
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <div className="mt-3 text-[1.2rem] flex items-center gap-2 border-2 border-[#544c46] rounded-3xl py-1 px-4 text-[#f4f3ee]">
        <CiSearch />
        <input
          type="text"
          placeholder="Search"
          value={searchValue}
          onKeyDown={search}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          className="bg-transparent focus:outline-none focus:border-none placeholder-[#d6d2c0] text-[#f4f3ee]"
        />
      </div>
      <div className="border-2 px-3 py-2 flex mt-4 flex-col gap-1 border-[#544c46] text-[#f4f3ee] rounded-3xl">
        <p className="text-[1.4rem] font-bold">Who to follow</p>
        <div className="flex flex-col ">
          {users.map((user) => {
            return (
              <UserCard
                key={user.id}
                username={user.username}
                userId={user.id}
                pfpUrl={user.pfpUrl}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default SearchAndFollow;
