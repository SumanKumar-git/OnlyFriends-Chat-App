import { EllipsisVertical, Pin, Send, Image as ImageIcon, Video, ArrowLeft } from "lucide-react";
import IncomingChatbox from "./IncomingChatbox";
import OutgoingChatbox from "./OutgoingChatbox";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { CallContext } from "../context/CallContext";
import toast from "react-hot-toast";
import ImageModal from "./ImageModal";


const ChatScreen = ({ onShowInfo }) => {
    const [message, setMessage] = useState("");
    const [image, setImage] = useState(null);
    const [height, setHeight] = useState(null);
    const [width, setWidth] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const {selectedUser, sendMessage, allMessages, getMessages, setAllMessages, markMessagesSeen, isImageModalOpen, setSelectedUser} = useContext(ChatContext);
    const {onlineUsers, authUser} = useContext(AuthContext);
    const {startCall} = useContext(CallContext);

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

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!message.trim() && !image) return;

        const tempId = Date.now();
        const tempMessage = {
            _id: tempId,
            senderId: authUser._id,
            text: message,
            isTemp: true,
            createdAt: new Date().toISOString()
        };

        if (image) {
            tempMessage.image = previewUrl;
            tempMessage.imageWidth = width;
            tempMessage.imageHeight = height;
        }

        setAllMessages((prev) => [...prev, tempMessage]);

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

        await sendMessage(formData, tempId);
};


    useEffect(() => {
        const loadChat = async () => {
            if(selectedUser){
                setAllMessages([]);
                await getMessages(selectedUser._id);
                await markMessagesSeen(selectedUser._id);
            }
        };
        loadChat();
    }, [selectedUser]);

    useEffect(()=>{
        if(scrollEnd.current){
            scrollEnd.current.scrollIntoView({behavior:"auto"});
        }
    }, [allMessages]);

    const initials = selectedUser?.fullName?.split(' ').map((word) => word[0]).join('').toUpperCase();

    return (
    <div className="w-full h-full">
        <div className="w-full h-full bg-[#f9fafc] rounded-none md:rounded-r-3xl flex flex-col justify-between overflow-hidden">
            {
                selectedUser?(
                    <>
                        {/* Top section */}
            <div className="w-full h-[10%] border-b border-gray-300 p-4 flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-2 md:gap-5">
                    {/* Back Button (Mobile Only) */}
                    <button 
                        onClick={() => setSelectedUser(null)} 
                        className="md:hidden text-gray-500 hover:text-gray-700 mr-1 flex items-center justify-center cursor-pointer"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div onClick={onShowInfo} className="flex flex-row gap-3 md:gap-5 items-center cursor-pointer">
                        <div className="bg-[#202022] shadow-md aspect-square w-12 h-12 flex items-center justify-center rounded-lg relative">
                            {
                                selectedUser?.profilePhoto ? (
                                    <img src={selectedUser?.profilePhoto} alt="Profile Photo" className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                    <h3 className="text-white font-semibold text-2xl">{initials}</h3>
                                )
                            }
                            {
                                onlineUsers.includes(selectedUser._id)&&(
                                    <div className="absolute bg-green-500 h-3 w-3 rounded-full -bottom-1 -right-1 border-2 border-white"></div>
                                )
                            }
                        </div>
                        <div className="flex flex-col justify-center gap-0.5">
                            <h1 className="font-semibold text-lg md:text-xl capitalize">{selectedUser?.fullName}</h1>
                            <p className="text-[10px] md:text-xs">{onlineUsers.includes(selectedUser._id)?"Online":"Offline"}</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row gap-5">
                    <Video onClick={() => startCall(selectedUser)} className="text-gray-400 hover:text-gray-600 transition-all cursor-pointer"/>
                    <Pin className="text-gray-400 hover:text-gray-600 transition-all cursor-pointer"/>
                    <EllipsisVertical className="text-gray-400 hover:text-gray-600 transition-all cursor-pointer"/>
                </div>
            </div>
            {/* Middle Section */}
            <div className="chat-screen h-[78%] p-4 flex flex-col gap-2 overflow-y-auto">
                {
                    allMessages?.map((msg, index)=> {
                        const prev = allMessages[index - 1];
                        const isSameSender = prev && prev?.senderId === msg.senderId;
                        return(
                        msg.senderId !== authUser?._id?(<IncomingChatbox isSameSender={isSameSender} key={msg._id} message={msg}/>):(<OutgoingChatbox isSameSender={isSameSender} key={msg._id} message={msg}/>))
                    }
                    )
                }
                <div ref={scrollEnd}></div>
            </div>
            {/* Message Input Section */}
            <div className="w-full h-[12%] flex justify-center items-center p-4">
                <form className="w-full bg-[#DCDCFE] rounded-xl px-3 py-2 border-2 border-transparent focus-within:border-2 focus-within:border-[#9b9bd3]  gap-4 flex flex-row items-center">
                    <div>
                        <label htmlFor="image"><ImageIcon strokeWidth={1.5} className="text-gray-500 cursor-pointer"/></label>
                        <input onChange={handleImageSelect} type="file" id="image" className="hidden" accept="image/*"/>
                    </div>
                    <input className="w-full p-2 text-sm outline-none border-none" value={message} onChange={(e)=>setMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null} type="text" placeholder="Your message" />
                    <button onClick={handleSendMessage} disabled={!message.trim() && !image} className="cursor-pointer bg-[#7678ed] p-2 flex justify-center disabled:bg-[#7678ed]/50 disabled:cursor-not-allowed items-center rounded-full">
                        <Send size={20} strokeWidth={1.5} className="text-white"/>
                    </button>
                </form>
            </div>
                    </>
                ):(
                    <div className="w-full h-full flex items-center justify-center">
                        <h1 className="font-medium text-2xl text-gray-500">Select a user to start conversation.</h1>
                    </div>

                )
            }

        </div>
        {
            isImageModalOpen && <ImageModal/>
        }
    </div>
    )
}

export default ChatScreen