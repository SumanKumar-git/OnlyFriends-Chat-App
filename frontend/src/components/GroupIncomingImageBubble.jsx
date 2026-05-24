import { useContext } from "react";
import { GroupChatContext } from "../context/GroupChatContext";

const GroupIncomingImageBubble = ({isSameSender, message}) => {
    const { openImageModal } = useContext(GroupChatContext);
    const isPortrait = message?.imageHeight > message?.imageWidth;

    return (
    <div className="w-full flex flex-row items-start justify-start gap-2">
        <div className="w-10 h-10 rounded-lg">
        {
            !isSameSender && (
                message.senderId.profilePhoto ? (
                    <img src={message.senderId.profilePhoto} alt="Profile Photo" className="w-full h-full object-cover rounded-lg" />
                ) : (
                    <div className="bg-[#202022] w-full h-full flex items-center justify-center rounded-lg text-white font-semibold text-lg">
                        {message.senderId.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                )
            )
        }
        </div>
        <div onClick={() => openImageModal(message)} className={`bg-[#DCDCFE] w-fit max-w-[70%] p-1 cursor-pointer ${isSameSender ? "rounded-xl" : "rounded-r-xl rounded-bl-xl"} flex flex-col gap-1`}>
            {
                !isSameSender &&
            <p className="text-sm font-medium text-blue-600 capitalize pl-1.5">{message.senderId.fullName}</p>
            }
            <div className={`${isPortrait ? "w-52" : "w-80"} max-w-full rounded-lg overflow-hidden`} style={{ aspectRatio: isPortrait ? "52/75" : "80/48" }}>
                <img src={message?.image} alt="chat-image" className="w-full h-full object-cover"/>
            </div>
            <div className="w-full flex flex-row justify-end items-center gap-2">
                <p className="text-xs uppercase text-gray-500 pr-1">{new Date(message?.createdAt).toLocaleTimeString([], {
                    hour:"2-digit",
                    minute:"2-digit",
                    hour12: true
                })}</p>
            </div>
        </div>
    </div>
    )
}

export default GroupIncomingImageBubble