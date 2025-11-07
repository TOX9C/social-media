import { useLocation, useNavigate } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { GoHomeFill } from "react-icons/go";
import { IoPersonOutline, IoSearchOutline } from "react-icons/io5";
import { IoSearchSharp, IoPersonSharp } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoMdNotifications } from "react-icons/io";
import { TbMessageCircle, TbMessageCircleFilled } from "react-icons/tb";

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Navigation - Side Nav */}
      <div className="hidden md:flex text-[#f4f3ee] flex-col items-start pl-5 gap-1 text-[1.4rem] ml-[8%] mt-[5%]">
        <button
          onClick={() => navigate("/")}
          className={`hover:bg-[#8a817c] px-3 py-1 transition-all rounded-xl flex flex-row items-center gap-3 ${isActive("/") ? "font-bold" : " "}`}
        >
          {isActive("/") ? <GoHomeFill /> : <GoHome />}
          Home
        </button>
        <button
          onClick={() => navigate("/messages")}
          className={`hover:bg-[#8a817c] px-3 py-1 transition-all rounded-xl flex flex-row items-center gap-3 ${isActive("/messages") ? "font-bold" : " "}`}
        >
          {isActive("/messages") ? (
            <TbMessageCircleFilled />
          ) : (
            <TbMessageCircle />
          )}
          Messages
        </button>
        <button
          onClick={() => navigate("/search")}
          className={`hover:bg-[#8a817c] px-3 py-1 transition-all rounded-xl flex flex-row items-center gap-3 ${isActive("/search") ? "font-bold" : " "}`}
        >
          {isActive("/search") ? <IoSearchSharp /> : <IoSearchOutline />}
          Search
        </button>
        <button
          onClick={() => navigate("/notification")}
          className={`hover:bg-[#8a817c] px-3 py-1 transition-all rounded-xl flex flex-row items-center gap-3 ${isActive("/notification") ? "[text-shadow:0_0_1px_currentColor,0_0_1px_currentColor]" : "text-shadow-none"}`}
        >
          {isActive("/notification") ? (
            <IoMdNotifications />
          ) : (
            <IoMdNotificationsOutline />
          )}
          Notifications
        </button>
        <button
          onClick={() => navigate("/profile")}
          className={`hover:bg-[#8a817c] px-3 py-1 transition-all rounded-xl flex flex-row items-center gap-3 ${isActive("/profile") ? "font-bold" : " "}`}
        >
          {isActive("/profile") ? <IoPersonSharp /> : <IoPersonOutline />}
          Profile
        </button>
      </div>

      {/* Mobile Navigation - Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#463f3a] border-t-2 border-[#544c46] z-50">
        <div className="flex justify-around items-center text-[#f4f3ee] text-[1.5rem] py-2">
          <button
            onClick={() => navigate("/")}
            className={`p-2 transition-all rounded-xl ${isActive("/") ? "text-[#f4f3ee]" : "text-[#d6d2c0]"}`}
          >
            {isActive("/") ? <GoHomeFill /> : <GoHome />}
          </button>
          <button
            onClick={() => navigate("/messages")}
            className={`p-2 transition-all rounded-xl ${isActive("/messages") ? "text-[#f4f3ee]" : "text-[#d6d2c0]"}`}
          >
            {isActive("/messages") ? <TbMessageCircleFilled /> : <TbMessageCircle />}
          </button>
          <button
            onClick={() => navigate("/search")}
            className={`p-2 transition-all rounded-xl ${isActive("/search") ? "text-[#f4f3ee]" : "text-[#d6d2c0]"}`}
          >
            {isActive("/search") ? <IoSearchSharp /> : <IoSearchOutline />}
          </button>
          <button
            onClick={() => navigate("/notification")}
            className={`p-2 transition-all rounded-xl ${isActive("/notification") ? "text-[#f4f3ee]" : "text-[#d6d2c0]"}`}
          >
            {isActive("/notification") ? <IoMdNotifications /> : <IoMdNotificationsOutline />}
          </button>
          <button
            onClick={() => navigate("/profile")}
            className={`p-2 transition-all rounded-xl ${isActive("/profile") ? "text-[#f4f3ee]" : "text-[#d6d2c0]"}`}
          >
            {isActive("/profile") ? <IoPersonSharp /> : <IoPersonOutline />}
          </button>
        </div>
      </div>
    </>
  );
};

export default Nav;
