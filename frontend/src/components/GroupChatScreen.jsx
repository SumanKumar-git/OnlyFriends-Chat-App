import { EllipsisVertical, ImageIcon, Pin, Send, ArrowLeft } from "lucide-react"
import GroupIncomingChatbox from "./GroupIncomingChatbox"
import { useContext, useEffect, useRef, useState } from "react"
import { GroupChatContext } from "../context/GroupChatContext"

import { AuthContext } from "../context/AuthContext"
import toast from "react-hot-toast"
import GroupOutgoingChatbox from "./GroupOutgoingChatbox"
import GroupSystemMessage from "./GroupSystemMessage"
import GroupOptionsModal from "./GroupOptionsModal"



const GroupChatScreen = ({ onShowInfo }) => {

    const {setGroupMessages, joinGroup, leaveGroup, setModalType, setIsModalOpen, groupMessages, getGroupMessages, sendGroupMessage, isModalOpen, modalType, selectedGroup, markGroupMessagesSeen, setSelectedGroup} = useContext(GroupChatContext);
    const {authUser} = useContext(AuthContext);
    const [message, setMessage] = useState("");
    const [image, setImage] = useState(null);
    const [height, setHeight] = useState(null);
    const [width, setWidth] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const scrollEnd = useRef(null);

    const handleImageSelect = (e) => {
            const file = e.target.files[0];
            if(!file){
                return;
            }
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.src = url;
            img.onload = () => {
                const width = img.width;
                const height = img.height;
                setImage(file);
                setHeight(height);
                setWidth(width);
                setPreviewUrl(url);
            };
        }

        const handleSendGroupMessage = async (e) => {
            e.preventDefault();
            if (!message.trim() && !image) return;
            const tempId = Date.now();
            const tempMessage = {
                _id: tempId,
                senderId: {
                    _id: authUser._id,
                    fullName: authUser.fullName,
                    profilePhoto: authUser.profilePhoto
                },
                text: message,
                isTemp: true,
                createdAt: new Date().toISOString()
            };
            if (image) {
                tempMessage.image = previewUrl;
                tempMessage.imageWidth = width;
                tempMessage.imageHeight = height;
            }
            setGroupMessages((prev) => [...prev, tempMessage]);
            const formData = new FormData();
            formData.append("text", message.trim());
            if (image) {
                if (!image.type.startsWith("image/")) {
                    toast.error("Please select an image file");
                    return;
                }
                formData.append("image", image);
                formData.append("height", height);
                formData.append("width", width);
            }
            setMessage("");
            setImage(null);
            setPreviewUrl(null);
            await sendGroupMessage({groupId: selectedGroup._id, formData, tempId});
    };

    useEffect(() => {
            const loadChat = async () => {
                if(selectedGroup){
                    setGroupMessages([]);
                    await getGroupMessages(selectedGroup._id);
                    await markGroupMessagesSeen(selectedGroup._id);
                }
            };
            loadChat();
        }, [selectedGroup]);

        const handleJoinGroup = async () => {
            try {
                await joinGroup(selectedGroup._id);
            } catch (error) {
                toast.error(error.message);
            }
        }

        const handleLeaveGroup = async () => {
            try {
                await leaveGroup(selectedGroup._id);
            } catch (error) {
                toast.error(error.message);
            }
        }

        useEffect(()=>{
                if(scrollEnd.current){
                    scrollEnd.current.scrollIntoView({behavior:"auto"});
                }
            }, [groupMessages]);

    const initials = selectedGroup?.groupName
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const openOptionsHandler = () => {
        setModalType("group-options");
        setIsModalOpen(true);
    }

    const isAdmin = selectedGroup?.groupAdmin?._id?.toString() === authUser?._id?.toString();

    return (
        <div className="w-full h-full">
            <div className="w-full h-full bg-[#f9fafc] rounded-none md:rounded-r-3xl flex flex-col justify-between overflow-hidden">
                {
                    selectedGroup ? (
                        <>
                        {/* Top Info Section */}
                <div className="h-[10%] w-full border-b border-gray-300 p-4 flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-2 md:gap-5">
                        {/* Back Button (Mobile Only) */}
                        <button 
                            onClick={() => setSelectedGroup(null)} 
                            className="md:hidden text-gray-500 hover:text-gray-700 mr-1 flex items-center justify-center cursor-pointer"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div onClick={onShowInfo} className="flex flex-row gap-3 md:gap-5 items-center cursor-pointer">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-black">
                                {
                                            selectedGroup?.groupIcon ? (
                                                <img src={selectedGroup?.groupIcon} alt="Profile Photo" className="w-12 h-12 rounded-lg object-cover" />
                                            ) : (
                                                <h3 className="bg-[#202022] w-12 h-12 aspect-square flex items-center justify-center rounded-lg text-white font-semibold text-2xl">{initials}</h3>
                                            )
                                        }
                            </div>
                        <div className="flex flex-col justify-center gap-0.5">
                            <h1 className="font-semibold text-xl capitalize">{selectedGroup?.groupName}</h1>
                            <div className="flex flex-row gap-2">
                                <p className="text-sm text-gray-500">{selectedGroup?.groupMembers.length} Members</p>
                                {/* <p className="text-sm text-gray-500">10 Online</p> */}
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="flex flex-row items-center gap-5">
                        {
                            selectedGroup?.groupMembers?.some(
                                (member) => member._id.toString() === authUser._id.toString()
                            ) && (
                                <div onClick={handleLeaveGroup} className="hidden md:block bg-[#7678ed] text-white text-sm font-medium px-4 py-2 rounded-lg cursor-pointer">Leave Group</div>
                            )
                        }
                        {
                            selectedGroup?.groupMembers?.some(
                                (member) => member._id.toString() === authUser._id.toString()
                            ) ? (
                                <Pin className="text-gray-400 hover:text-gray-600 transition-all cursor-pointer"/>
                            ) : (
                                <div onClick={handleJoinGroup} className="hidden md:block bg-[#7678ed] text-white text-sm font-medium px-4 py-2 rounded-lg cursor-pointer">Join Group</div>
                            )
                        }
                        {
                            (isAdmin || true) && (
                                <div className={isAdmin ? "relative" : "relative md:hidden"}>
                                <EllipsisVertical onClick={openOptionsHandler} className="text-gray-400 hover:text-gray-600 transition-all cursor-pointer"/>
                                        {
                                            modalType === "group-options" && isModalOpen && (
                                                <GroupOptionsModal />
                                            )
                                        }
                                </div>
                            )
                        }
                    </div>
                </div>
                {/* Message Section */}
                <div className="chat-screen h-[78%] p-4 flex flex-col gap-2 overflow-y-auto">
                    {
                    groupMessages?.map((msg, index)=>{
                        const prev = groupMessages?.[index - 1];
                        const isSameSender = prev?.senderId?._id?.toString() === msg?.senderId?._id?.toString();

                        return (
                            msg?.messageType === "system" ? (
                            <GroupSystemMessage key={msg._id} message={msg}/>
                        ) : (
                            msg?.senderId?._id?.toString() !== authUser?._id?.toString()?(<GroupIncomingChatbox key={msg._id} isSameSender={isSameSender} message={msg}/>):(<GroupOutgoingChatbox isSameSender={isSameSender} key={msg._id} message={msg}/>)
                        )
                        )

                        }
                    )
                }
                <div ref={scrollEnd}></div>
                </div>
                {/*Message Input Section */}
                <div className="w-full h-[12%] flex justify-center items-center p-4">
                    {
                        selectedGroup?.groupMembers?.some(
                            (member) => member._id.toString() === authUser._id.toString()
                        ) ? (
                            <form onSubmit={handleSendGroupMessage} className="w-full bg-[#DCDCFE] rounded-xl px-3 py-2 border-2 border-transparent focus-within:border-2 focus-within:border-[#9b9bd3]  gap-4 flex flex-row items-center">
                    <div>
                        <label htmlFor="image"><ImageIcon strokeWidth={1.5} className="text-gray-500 cursor-pointer"/></label>
                        <input  type="file" id="image" className="hidden" accept="image/*" onChange={handleImageSelect}/>
                    </div>
                    <input className="w-full p-2 text-sm outline-none border-none" type="text" placeholder="Your message" value={message} onChange={(e) => setMessage(e.target.value)}/>
                    <button type="submit" disabled={!message.trim() && !image} className="cursor-pointer bg-[#7678ed] p-2 flex justify-center disabled:bg-[#7678ed]/50 disabled:cursor-not-allowed items-center rounded-full">
                        <Send size={20} strokeWidth={1.5} className="text-white"/>
                    </button>
                </form>
                        ) : (
                            <div className="w-full h-full flex bg-[#DCDCFE] items-center rounded-xl justify-center">
                                <h1 className=" text-sm text-gray-600">You are not a member of this group</h1>
                            </div>
                        )
                    }
                </div>
                        </>
                    ) :
                    (
                        <div className="w-full h-full flex items-center justify-center">
                            <h1 className="font-medium text-2xl text-gray-500">Select a group to chat</h1>
                        </div>
                    )
                }
        </div>
        </div>
    )
}

export default GroupChatScreen