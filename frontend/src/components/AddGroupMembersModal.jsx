import { Search, X } from "lucide-react"
import { useContext, useEffect, useState } from "react";
import { GroupChatContext } from "../context/GroupChatContext";
import toast from "react-hot-toast";


const AddGroupMembersModal = () => {

    const { allUsers, addMembersToGroup, selectedGroup, setModalType, setIsModalOpen, getUsersForGroup, selectedMembers, setSelectedMembers } = useContext(GroupChatContext);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        const loadUsers = async () => {
            await getUsersForGroup(selectedGroup._id);
        };
        loadUsers();
    }, [selectedGroup]);

    const handleMemberSelection = (memberId) => {
        if(selectedMembers.includes(memberId)) {
            setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
        } else {
            setSelectedMembers([...selectedMembers, memberId]);
        }
    };

    const handleCloseButton = () => {
        setModalType(null);
        setIsModalOpen(false);
        setSearchText("");
        setSelectedMembers([]);
    }

    const handleAddMembers = async (e) => {
        e.preventDefault();
        try {
            if(selectedMembers.length > 0) {
                await addMembersToGroup(selectedGroup._id, {members:selectedMembers});
                setModalType(null);
                setIsModalOpen(false);
                setSearchText("");
                setSelectedMembers([]);
            } else {
                toast.error("Please select at least one member");
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const availableMembers = allUsers.filter((user) => !selectedGroup.groupMembers.some(member => member._id.toString() === user._id.toString()));

    return (
        <div className="fixed inset-0 bg-black/60 w-full h-screen flex items-center justify-center z-50 backdrop-blur-md p-4">
            <div className="bg-[#f9fafc] rounded-2xl shadow-2xl h-[90%] w-[40%] overflow-hidden p-6 flex flex-col ">
                <div className="flex justify-between items-start h-[12%]">
                    <div>
                        <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Add Members</h2>
                        <p className="text-gray-500 mt-1 text-sm">Select friends to add to the group.</p>
                    </div>
                    <button onClick={handleCloseButton} className="text-gray-400 hover:text-gray-900 hover:bg-[#DCDCFE] p-2.5 rounded-full transition-all cursor-pointer">
                        <X size={22} />
                    </button>
                </div>
                <div className="flex flex-col gap-4 h-[88%]">
                    <div className="relative h-[10%]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" strokeWidth={2} size={18} />
                        <input onChange={(e) => setSearchText(e.target.value)} value={searchText} type="text" className="w-full bg-[#DCDCFE] border-2 border-transparent focus:border-[#7678ed] rounded-lg pl-12 pr-4 py-3 outline-none transition-all text-gray-800 placeholder-gray-500 shadow-sm text-sm" placeholder="Search users by name or email..." />
                    </div>
                    <form onSubmit={handleAddMembers} className="flex flex-col gap-2 justify-between h-[90%]">
                        <div className="add-member-container flex flex-col gap-2 h-[90%] overflow-y-auto pr-2">
                            {availableMembers.length > 0 && availableMembers.map(user => (
                                <label key={user._id} className="flex flex-row items-center gap-2 p-3 rounded-lg cursor-pointer transition-all border bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200 shadow-sm">
                                    <input checked={selectedMembers.includes(user._id)} onChange={() => handleMemberSelection(user._id)} type="checkbox" className="accent-[#7678ed] mr-4 w-4 h-4" value={user._id} />
                                    {
                                        user?.profilePhoto ? (
                                            <img src={user?.profilePhoto} alt="Profile Photo" className="w-12 h-12 rounded-lg object-cover" />
                                        ) : (
                                            <h3 className="bg-[#202022] w-12 h-12 aspect-square flex items-center justify-center rounded-lg text-white font-semibold text-2xl">{user.fullName.split(' ').map((word) => word[0]).join('').toUpperCase()}</h3>
                                        )
                                    }
                                    <div className="pl-4 flec w-[70%] flex-col justify-center">
                                        <h1 className="font-semibold text-gray-800">{user.fullName}</h1>
                                        <p className="text-gray-500 text-sm">{user.email}</p>
                                    </div>
                                </label>
                        ))}
                        </div>
                <div className="flex justify-between items-center">
                    <span className="font-medium text-[#7678ed]">{selectedMembers.length} selected</span>
                    <div className="flex gap-3">
                        <button onClick={handleCloseButton} type="button" className="px-5 py-2.5 rounded-md font-semibold text-gray-600 hover:bg-[#DCDCFE] hover:text-gray-900 transition-all cursor-pointer text-base">Cancel</button>
                        <button disabled={selectedMembers.length === 0} type="submit" className="px-6 py-2.5 bg-[#7678ed] hover:bg-[#5e5ebf] disabled:bg-[#7678ed]/50 disabled:cursor-not-allowed text-white font-medium rounded-md transition-all shadow-md cursor-pointer text-base">Add Members</button>
                    </div>
                </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddGroupMembersModal