import { FaMessage } from "react-icons/fa6";
import { FaUserLarge } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import { HiUserGroup } from "react-icons/hi2";

const Sidebar = () => {

  const {logout} = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  }

  const activeNav = ({isActive}) => {
    return isActive ? "text-white flex flex-col items-center gap-1 bg-white/20 px-2 py-3 rounded-lg" : "text-white flex flex-col items-center gap-1 bg-transparent px-2 py-3 rounded-lg";
  }

  return (
    <div className='flex flex-col items-center gap-3 p-3 h-screen w-[8%]'>
        <div className="h-[10%]">
          <h1 className="text-white text-3xl font-bold">OF</h1>
        </div>
        <div className="h-[50%] w-full flex flex-col gap-3">
            <NavLink to="/" className={activeNav}>
                <FaMessage className="text-lg" />
                <p className='text-xs'>All Chats</p>
            </NavLink>
            <NavLink to="/groups" className={activeNav}>
                <HiUserGroup className="text-2xl"/>
                <p className='text-xs'>Groups</p>
            </NavLink>
        </div>
        <div className="h-[40%] flex flex-col justify-end gap-4 w-full">
              <NavLink to="/profile" className={activeNav}>
                <FaUserLarge className="text-xl" />
                <p className='text-xs'>Profile</p>
              </NavLink>
              <div onClick={handleLogout} className='text-white flex cursor-pointer flex-col items-center gap-1 px-2 py-3'>
                <LuLogOut className="text-2xl" />
                <p className='text-xs'>Logout</p>
              </div>
            </div>
    </div>
  )
}

export default Sidebar