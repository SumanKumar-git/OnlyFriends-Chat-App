import { useContext } from "react";
import { GroupChatContext } from "../context/GroupChatContext";
import { ArrowLeft } from "lucide-react";

const GroupChatInfo = ({ onCloseInfo }) => {
    const {selectedGroup} = useContext(GroupChatContext);

    const initials = selectedGroup?.groupName
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    return (
        <div className="w-full h-full">
            <div className="w-full h-full bg-[#DCDCFE] rounded-none md:rounded-3xl overflow-hidden">
                {/* Top Section */}
                {
                    selectedGroup ? (
                        <>
                        <div className="w-full h-[10%] px-4 flex items-center gap-3 border-b border-[#9b9bd3]">
                            <button 
                                onClick={onCloseInfo} 
                                className="md:hidden text-gray-700 hover:text-gray-900 cursor-pointer"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <h1 className="font-semibold text-xl">Group Info</h1>
                        </div>

                {/* Middle Section */}
                <div className="w-full h-[35%] px-3 flex flex-col items-center gap-2 border-b border-[#9b9bd3] py-4">
                <div className="bg-[#202022] w-22 h-22 aspect-square rounded-2xl shadow-md relative flex items-center justify-center">
                    {
                        selectedGroup?.groupIcon ? (
                            <img src={selectedGroup?.groupIcon} alt="Profile Photo" className="w-full h-full rounded-2xl object-cover" />
                        ) : (
                            <h3 className=" text-white aspect-square w-16 flex items-center justify-center rounded-2xl font-semibold text-3xl">{initials}</h3>
                        )
                    }
                </div>
                <div className="flex flex-col items-center justify-center gap-1">
                    <h2 className="font-semibold text-xl">{selectedGroup?.groupName}</h2>
                    <p className="text-xs font-medium text-center text-gray-600">Created by {selectedGroup?.groupAdmin.fullName} on {new Date(selectedGroup?.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div className=" w-full flex flex-col justify-center items-start  gap-1">
                  <h2 className="text-lg font-semibold">About</h2>
                  <p className="text-sm font-medium text-gray-600">{selectedGroup?.groupDescription}</p>
                </div>
            </div>

                {/* Bottom Section */}
                <div className="w-full h-[55%] px-4 pb-4">
                    {
                        selectedGroup?.groupMembers?.length > 0 && (
                            <div className="w-full h-full">
                                <div className="w-full h-[10%] flex items-center justify-between">
                                    <h1 className="text-lg font-semibold">Group Members</h1>
                                    <h2 className="text-lg font-medium text-gray-600">{selectedGroup?.groupMembers?.length}</h2>
                                </div>
                                <div className="members-list-container w-full h-[90%] overflow-y-auto flex flex-col gap-2">
                                    {
                                        selectedGroup?.groupMembers?.map((member)=> {
                                            const initials = member?.fullName
                                            ?.split(' ')
                                            .map(n => n[0])
                                            .join('')
                                            .toUpperCase()
                                            .slice(0, 2);
                                            return (
                                                <div key={member?._id} className="w-full flex flex-row gap-4 items-center">
                                                <div className="w-12 h-12 rounded-lg bg-gray-300">
                                                    {
                                                        member?.profilePhoto ? (
                                                            <img src={member?.profilePhoto} alt="Profile Photo" className="w-full h-full rounded-lg object-cover" />
                                                        ) : (
                                                            <h3 className=" text-white bg-black aspect-square w-full h-full flex items-center justify-center rounded-lg font-semibold text-xl">{initials}</h3>
                                                        )
                                                    }
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="flex flex-row gap-2.5 items-center">
                                                        <h2 className="font-medium text-sm">{member?.fullName}</h2>
                                                        {member?._id?.toString() === selectedGroup?.groupAdmin?._id?.toString() && (
                                                            <div className="w-fit h-fit flex items-center justify-center text-xs bg-[#7678ed] px-2 py-0.5 rounded-sm text-white font-medium">Admin</div>
                                                        )}
                                                    </div>
                                                    <p className="text-xs font-medium text-gray-600">{member?.email}</p>
                                                </div>
                                            </div>
                                            )
                                        } )
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
                        </>
                    ): (
                        <div className="w-full h-full flex items-center justify-center">
                            <h1 className="font-semibold text-xl">No Group Chat Selected</h1>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default GroupChatInfo