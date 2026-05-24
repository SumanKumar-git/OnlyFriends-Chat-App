import { Search, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { GroupChatContext } from "../context/GroupChatContext";

const MemberSelectModel = () => {

    const {allUsers, getUsersForGroup, setModalType, setIsModalOpen, setSelectedMembers, selectedMembers} = useContext(GroupChatContext);

    const [searchText, setSearchText] = useState("");

    const handleMemberSelection = (memberId) => {
        if(selectedMembers.includes(memberId)) {
            setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
        } else {
            setSelectedMembers([...selectedMembers, memberId]);
        }
    };

    useEffect(() => {
        getUsersForGroup();
    }, []);

    const filteredUsers = allUsers.filter((user) => (user.fullName.toLowerCase().includes(searchText.toLowerCase()) || user.email.toLowerCase().includes(searchText.toLowerCase())))

    const addMemberButtonHandler = () => {
        setModalType("create-group");
        setIsModalOpen(true);
    }
    const cancleButtonHandler = () => {
        setModalType(null);
        setIsModalOpen(false);
        setSelectedMembers([]);
    }

    return (
        <div className="fixed inset-0 bg-black/60 w-full h-screen flex items-center justify-center z-50 backdrop-blur-md p-4">
            <div className="bg-[#f9fafc] rounded-2xl shadow-2xl h-[75dvh] md:h-[85vh] w-full max-w-lg overflow-hidden p-4 md:p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4 shrink-0">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">Add Members</h2>
                        <p className="text-gray-500 mt-0.5 text-xs md:text-sm">Select friends to add to the group.</p>
                    </div>
                    <button onClick={cancleButtonHandler} className="text-gray-400 hover:text-gray-900 hover:bg-[#DCDCFE] p-2 rounded-full transition-all cursor-pointer">
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 min-h-0 flex flex-col gap-3">
                    <div className="relative shrink-0">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" strokeWidth={2} size={18} />
                        <input onChange={(e) => setSearchText(e.target.value)} value={searchText} type="text" className="w-full bg-[#DCDCFE] border-2 border-transparent focus:border-[#7678ed] rounded-lg pl-12 pr-4 py-2.5 outline-none transition-all text-gray-800 placeholder-gray-500 shadow-sm text-sm" placeholder="Search users by name or email..." />
                    </div>
                    <form className="add-member-container flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto pr-1">
                        {filteredUsers.length > 0 && filteredUsers.map(user => (
                            <label key={user._id} className="flex flex-row items-center gap-2 p-3 rounded-lg cursor-pointer transition-all border bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200 shadow-sm">
                                <input checked={selectedMembers.includes(user._id)} onChange={() => handleMemberSelection(user._id)} type="checkbox" className="accent-[#7678ed] mr-4 w-4 h-4" value={user._id} />
                                {
                                    user?.profilePhoto ? (
                                        <img src={user?.profilePhoto} alt="Profile Photo" className="w-12 h-12 rounded-lg object-cover" />
                                    ) : (
                                        <h3 className="bg-[#202022] w-12 h-12 aspect-square flex items-center justify-center rounded-lg text-white font-semibold text-xl md:text-2xl">{user.fullName.split(' ').map((word) => word[0]).join('').toUpperCase()}</h3>
                                    )
                                }
                                <div className="pl-4 flex w-[70%] flex-col justify-center">
                                    <h1 className="font-semibold text-gray-800 text-sm md:text-base">{user.fullName}</h1>
                                    <p className="text-gray-500 text-xs md:text-sm truncate">{user.email}</p>
                                </div>
                            </label>
                        ))}
                    </form>
                </div>
                <div className="shrink-0 pt-4 border-t border-gray-100 flex justify-between items-center mt-3">
                    <span className="font-medium text-sm md:text-base text-[#7678ed]">{selectedMembers.length} selected</span>
                    <div className="flex gap-3">
                        <button onClick={cancleButtonHandler} type="button" className="px-4 py-2 rounded-md font-semibold text-gray-600 hover:bg-[#DCDCFE] hover:text-gray-900 transition-all cursor-pointer text-sm md:text-base">Cancel</button>
                        <button disabled={selectedMembers.length === 0} onClick={addMemberButtonHandler} type="button" className="px-5 py-2 bg-[#7678ed] hover:bg-[#5e5ebf] disabled:bg-[#7678ed]/50 disabled:cursor-not-allowed text-white font-medium rounded-md transition-all shadow-md cursor-pointer text-sm md:text-base">Add Members</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MemberSelectModel