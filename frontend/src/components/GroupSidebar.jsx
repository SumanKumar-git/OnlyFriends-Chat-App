import { Plus, Search } from "lucide-react"
import GroupCard from "./GroupCard"
import { GroupChatContext } from "../context/GroupChatContext"
import { useContext } from "react";


const GroupSidebar = () => {

    const { allGroups, setModalType, selectedGroup, setIsModalOpen, setSelectedGroup, selectedGroupTab, setSelectedGroupTab, markGroupMessagesSeen, setUnseenMessages} = useContext(GroupChatContext);

    const handleSelectGroup = (group) => {
        setSelectedGroup(group);
        setUnseenMessages((prev) => {
            const updated = {...prev};
            delete updated[group._id.toString()];
            return updated;
        });
        markGroupMessagesSeen(group._id);
    };
    const handleSelectedGroupTab = (tab) => {
        setSelectedGroupTab(tab);
    };

    const createGroupHandler = () => {
        setModalType("select-members");
        setIsModalOpen(true);
    }

    return (
        <div className="w-[22%] h-screen py-4">
            <div className="h-full w-full bg-[#f9fafc] rounded-l-4xl flex flex-col pb-4 overflow-hidden">
                {/* Searchbar */}
            <div className='p-5 flex flex-col gap-3'>
                <div className="flex items-center bg-[#DCDCFE] p-3 rounded-lg w-full gap-4 border-2 border-transparent focus-within:border-2 focus-within:border-[#9b9bd3] transition-all">
                <Search className='text-gray-600' />
                <form className="w-full">
                    <input type="text" placeholder="Search" className="w-full outline-none border-none bg-transparent" required/>
                </form>
                </div>
                <div onClick={createGroupHandler} className="flex gap-1 bg-[#DCDCFE] flex-row justify-center items-center rounded-lg p-1.5 cursor-pointer">
                    <div className="bg-primar rounded-full p-1.5">
                        <Plus />
                    </div>
                    <p className="text-sm font-medium">Create new group</p>
                </div>
                <div className="flex flex-row w-full gap-3">
                    <div onClick={() => handleSelectedGroupTab("my-groups")} className={`w-[50%] flex p-2 cursor-pointer items-center justify-center rounded-lg text-gray-700 border font-medium text-sm ${selectedGroupTab === "my-groups" ? "bg-[#EEEDFF] border-[#DCDCFE]" : "bg-[#f5f5f5] border-transparent"}`}>My Groups</div>
                    <div onClick={() => handleSelectedGroupTab("all-groups")} className={`w-[50%] flex p-2 cursor-pointer items-center rounded-lg justify-center text-gray-700 border font-medium text-sm ${selectedGroupTab === "all-groups" ? "bg-[#EEEDFF] border-[#DCDCFE]" : "bg-[#f5f5f5] border-transparent"}`}>All Groups</div>
                </div>
            </div>
            <div className="groups-section flex flex-col gap-3 pb-4 px-5 overflow-y-auto w-full">
                {
                    allGroups.length > 0 && allGroups.map((group) => (
                        <GroupCard onClick={() => handleSelectGroup(group)} selectedGroup={selectedGroup} key={group._id} group={group}/>
                    ))
                }
            </div>
        </div>
        </div>
    )
}

export default GroupSidebar