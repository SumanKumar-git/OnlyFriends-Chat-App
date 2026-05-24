import { FaMessage } from "react-icons/fa6";
import { FaUserLarge } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { GroupChatContext } from "../context/GroupChatContext";
import { NavLink } from "react-router-dom";
import { HiUserGroup } from "react-icons/hi2";

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const { selectedUser } = useContext(ChatContext);
  const { selectedGroup } = useContext(GroupChatContext);

  const hideSidebar = selectedUser || selectedGroup;

  const handleLogout = () => {
    logout();
  }

  const activeNav = ({isActive}) => {
    return isActive 
      ? "text-[#7678ed] md:text-white flex flex-col items-center justify-center gap-1 bg-[#7678ed]/10 md:bg-white/20 px-3 py-2 md:py-3 rounded-xl transition-all" 
      : "text-white/60 md:text-white/80 flex flex-col items-center justify-center gap-1 bg-transparent px-3 py-2 md:py-3 rounded-xl hover:text-white hover:bg-white/5 transition-all";
  }

  return (
    <div className={`${hideSidebar ? 'hidden md:flex' : 'flex'} flex-row md:flex-col items-center justify-between md:justify-start gap-3 p-3 h-16 md:h-screen w-full md:w-[8%] bg-[#1b1b22] md:bg-transparent border-t md:border-t-0 md:border-r border-white/5 md:border-transparent shrink-0 z-30 shadow-lg md:shadow-none`}>
        {/* Logo - Desktop Only */}
        <div className="hidden md:block h-[10%]">
          <h1 className="text-white text-3xl font-bold">OF</h1>
        </div>

        {/* Navigation Tabs - Row on mobile (Chats, Groups only), Column on desktop */}
        <div className="flex-1 md:flex-none md:h-[50%] w-full flex flex-row md:flex-col justify-around md:justify-start gap-3">
            <NavLink to="/" className={activeNav}>
                <FaMessage className="text-lg" />
                <p className='text-[10px] md:text-xs font-medium'>Chats</p>
            </NavLink>
            <NavLink to="/groups" className={activeNav}>
                <HiUserGroup className="text-xl md:text-2xl"/>
                <p className='text-[10px] md:text-xs font-medium'>Groups</p>
            </NavLink>
        </div>

        {/* Desktop Profile / Logout */}
        <div className="hidden md:flex h-[40%] flex-col justify-end gap-4 w-full">
              <NavLink to="/profile" className={activeNav}>
                <FaUserLarge className="text-xl" />
                <p className='text-xs'>Profile</p>
              </NavLink>
              <div onClick={handleLogout} className='text-white/80 hover:text-white flex cursor-pointer flex-col items-center gap-1 px-2 py-3 rounded-xl hover:bg-white/5 transition-all'>
                <LuLogOut className="text-2xl" />
                <p className='text-xs'>Logout</p>
              </div>
        </div>
    </div>
  )
}

export default Sidebar
