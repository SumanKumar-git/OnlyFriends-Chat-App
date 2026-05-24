import {Search} from 'lucide-react';
import UserCard from './UserCard';
import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../context/ChatContext';

const SidebarUsers = () => {

  const [search, setSearch] = useState("");
  const {users, getUsers, lastMessages, unseenMessages} = useContext(ChatContext);



  const filterUsers = search ? users.filter((user) => user.fullName.toLowerCase().includes(search.toLowerCase())) : users;

  useEffect(()=>{
    getUsers();
  }, []);

  return (
    <div className='w-[22%] h-screen py-3'>
      <div className="w-full h-full bg-[#f9fafc] rounded-l-3xl flex flex-col pb-4 overflow-hidden">
      {/* Searchbar */}
      <div className='p-5'>
        <div className="flex items-center bg-[#DCDCFE] p-3 rounded-xl w-full gap-4 border-2 border-transparent focus-within:border-2 focus-within:border-[#9b9bd3] transition-all">
        <Search className='text-gray-600' />
        <form className="w-full">
          <input type="text" placeholder="Search" className="w-full outline-none border-none bg-transparent" value={search} onChange={(e)=>setSearch(e.target.value)} required/>
        </form>
      </div>
      </div>
      <div className='friends-section flex flex-col gap-3 pb-4 px-5 overflow-y-auto w-full'>
        {
          filterUsers.map((user) => (
            <UserCard user={user} key={user._id.toString()} message={lastMessages[user._id.toString()]} time={lastMessages[user._id.toString()]?.createdAt} unreadCount={unseenMessages[user._id.toString()]} />
          ))
        }
      </div>
      <div>
      </div>
    </div>
    </div>
  )
}

export default SidebarUsers