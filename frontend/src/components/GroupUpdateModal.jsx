import { useContext, useState } from "react"
import { GroupChatContext } from "../context/GroupChatContext"
import { PencilLine } from "lucide-react";
import toast from "react-hot-toast";

const GroupUpdateModal = () => {
    const {updateGroup, setModalType, setIsModalOpen, selectedGroup} = useContext(GroupChatContext);

    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const [groupIcon, setGroupIcon] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const cancelButtonHandler = () => {
        setIsModalOpen(false);
        setModalType(null);
        setGroupName("");
        setGroupDescription("");
        setGroupIcon(null);
        setPreviewUrl(null);
    };

    const handleSelectGroupIcon = (e) => {
        const file = e.target.files[0];
        if(!file){
            return;
        }
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.src = url;
        img.onload = () => {
            setGroupIcon(file);
            setPreviewUrl(url);
        }
    }

    const handleProfileUpdate = async(e) => {
        e.preventDefault();
        if(!groupName && !groupDescription && !groupIcon){
            toast.error("No changes to update");
            return;
        }
            const formData = new FormData();
            if(groupName){
                formData.append("groupName", groupName);
            }
            if(groupDescription){
                formData.append("groupDescription", groupDescription);
            }
            if(groupIcon){
                formData.append("groupIcon", groupIcon);
            }
            await updateGroup(selectedGroup?._id, formData);
            setIsModalOpen(false);
            setModalType(null);
    }



    return (
        <div className="fixed inset-0 bg-black/60 w-full h-screen flex items-center justify-center z-50 backdrop-blur-md p-4">
            <div className="w-full max-w-lg h-[95%] md:h-[75%] flex flex-col justify-center items-center bg-white rounded-2xl p-6">
                <div className="h-[15%] w-full">
                    <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">Update Group Details</h1>
                    <p className="text-gray-500 mt-1 text-sm">Update your group details.</p>
                </div>
                <form onSubmit={handleProfileUpdate} className="h-[85%] w-full flex flex-col justify-between pt-4">
                    <div className="w-full flex flex-col items-center gap-4">
                                <div className="relative w-30 h-30 rounded-lg">
                                    {selectedGroup?.groupIcon ? (
                                    <img src={previewUrl ? previewUrl : selectedGroup?.groupIcon} alt="Profile Photo" className="w-full h-full rounded-lg object-cover" />
                                ) : (
                                    <h3 className="bg-[#202022] w-full h-full aspect-square flex items-center justify-center rounded-lg text-white font-semibold text-2xl">SK</h3>
                                )}
                                    <label htmlFor="groupIcon">
                                        <div className="absolute -bottom-3 -right-3 bg-[#7678ed] p-2 rounded-full border-3 border-[#f9fafc] shadow-sm group-hover:bg-[#6567d1] transition-colors cursor-pointer">
                                            <input type="file" name="groupIcon" id="groupIcon" onChange={handleSelectGroupIcon} className="cursor-pointer hidden" accept="image/*" />
                                            <PencilLine className="text-white w-4 h-4" strokeWidth={2} />
                                        </div>
                                    </label>
                                </div>
                    </div>
                    <div>
                        <label htmlFor="group-name" className="block text-lg font-semibold text-gray-700 mb-2">Group Name</label>
                        <input onChange={(e) => setGroupName(e.target.value)} value={groupName} type="text" name="groupName" id="group-name" placeholder="Enter group name" className="w-full bg-[#EEEDFF] rounded-xl px-5 py-4 border-2 border-transparent hover:border-[#DCDCFE] transition-colors flex justify-between items-center outline-none" />
                    </div>
                    <div>
                        <label htmlFor="group-description" className="block text-lg font-semibold text-gray-700 mb-2">Group Description</label>
                        <input onChange={(e) => setGroupDescription(e.target.value)} value={groupDescription} type="text" name="groupDescription" id="group-description" placeholder="Enter group description" className="w-full bg-[#EEEDFF] rounded-xl px-5 py-4 border-2 border-transparent hover:border-[#DCDCFE] transition-colors flex justify-between items-center outline-none" />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button onClick={cancelButtonHandler} type="button" className="px-5 py-2.5 rounded-md font-semibold text-gray-600 hover:bg-[#DCDCFE] hover:text-gray-900 transition-all cursor-pointer text-base">Cancel</button>
                        <button type="submit" className="px-6 py-2.5 bg-[#7678ed] hover:bg-[#5e5ebf] disabled:bg-[#7678ed]/50 disabled:cursor-not-allowed text-white font-medium rounded-md transition-all shadow-md cursor-pointer text-base">Update</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default GroupUpdateModal