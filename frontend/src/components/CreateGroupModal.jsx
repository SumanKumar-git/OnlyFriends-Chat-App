import { Camera, MoveLeft, X } from "lucide-react"
import { useContext } from "react"
import { GroupChatContext } from "../context/GroupChatContext"
import toast from "react-hot-toast";

const CreateGroupModal = () => {

    const { setIsModalOpen, setModalType, groupName, setGroupName, groupDescription, setGroupDescription, setSelectedMembers, groupIcon, setGroupIcon, selectedMembers, createGroup } = useContext(GroupChatContext);

    const createGroupHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        try{
            if(!groupName.trim()){
                toast.error("Group name is required");
                return;
            }
            if(selectedMembers.length === 0){
                toast.error("Please select at least one member");
                return;
            }
            formData.append("groupName", groupName);
            formData.append("groupDescription", groupDescription);
            if(groupIcon){
                formData.append("groupIcon", groupIcon);
            }
            formData.append("groupMembers", JSON.stringify(selectedMembers));
            await createGroup(formData);
            setGroupName("");
            setGroupDescription("");
            setGroupIcon(null);
            setSelectedMembers([]);
            setModalType(null);
            setIsModalOpen(false);
        }
        catch(error){
            toast.error(error.response.data.message);
        }
    }

    const closeButtonHandler = () => {
        setModalType(null);
        setIsModalOpen(false);
        setSelectedMembers([]);
        setGroupName("");
        setGroupDescription("");
        setGroupIcon(null);
    }

    const backButtonHandler = () => {
        setModalType("select-members");
        setIsModalOpen(true);
    }

    return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-md p-4">
        <div className="bg-[#f9fafc] rounded-2xl shadow-2xl h-[90%] w-[40%] p-8 flex flex-col">
            <div className="flex justify-between items-start h-[15%]">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Create New Group</h2>
                    <p className="text-gray-500 text-sm">Set up your group details and invite your friends to start chatting.</p>
                </div>
                <button onClick={closeButtonHandler} className="text-gray-400 hover:text-gray-900 hover:bg-[#DCDCFE] p-3 rounded-full transition-all cursor-pointer">
                    <X size={24} />
                </button>
            </div>
            <form onSubmit={(e) => createGroupHandler(e)} className="flex flex-col items-center justify-between gap-8 h-[85%] ">
                    <label htmlFor="profilePhoto" className="w-32 h-32 bg-black rounded-xl shadow-xl flex flex-col items-center justify-center shrink-0 cursor-pointer transition-all group relative overflow-hidden">
                        {
                            groupIcon ? (
                                <img src={URL.createObjectURL(groupIcon)} alt="Profile Photo" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <Camera className="text-white mb-1" strokeWidth={1.5} size={36} />
                                    <span className="text-white text-xs font-medium tracking-wide">Add Photo</span>
                                </>
                            )
                        }
                    </label>
                    <input onChange={(e) => setGroupIcon(e.target.files[0])} type="file" id="profilePhoto" className="hidden" accept="image/*" />
                    <div className="flex flex-col gap-2 w-full">
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Group Name</label>
                        <input onChange={(e) => setGroupName(e.target.value)} value={groupName} type="text" className="w-full bg-[#DCDCFE] border-2 border-transparent focus:border-[#7678ed] rounded-lg px-5 py-4 outline-none transition-all text-gray-800 placeholder-gray-500 font-medium shadow-sm" placeholder="E.g. Weekend Trip, Family, etc." required/>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Group Description</label>
                        <input onChange={(e) => setGroupDescription(e.target.value)} value={groupDescription} type="text" className="w-full bg-[#DCDCFE] border-2 border-transparent focus:border-[#7678ed] rounded-lg px-5 py-4 outline-none transition-all text-gray-800 placeholder-gray-500 shadow-sm font-medium" placeholder="Description (Optional)" />
                    </div>
                <div className="flex justify-between w-full gap-4">
                    <button onClick={backButtonHandler} type="button" className="px-5 py-3.5 rounded-lg font-bold text-gray-600 hover:bg-[#DCDCFE] hover:text-gray-900 transition-all cursor-pointer text-lg">
                        <MoveLeft />
                    </button>
                    <div className="flex gap-2">
                        <button onClick={closeButtonHandler} type="button" className="px-5 py-3.5 rounded-lg font-bold text-gray-600 hover:bg-[#DCDCFE] hover:text-gray-900 transition-all cursor-pointer text-lg">Cancel</button>
                        <button type="submit" className="px-5 py-3.5 bg-[#7678ed] hover:bg-[#5e5ebf] text-white font-semibold rounded-lg transition-all shadow-lg cursor-pointer text-lg">Create Group</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    )
}

export default CreateGroupModal