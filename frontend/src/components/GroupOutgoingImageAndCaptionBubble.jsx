import { Check, CheckCheck, Trash2 } from "lucide-react";
import { useContext } from "react";
import { GroupChatContext } from "../context/GroupChatContext";

const GroupOutgoingImageAndCaptionBubble = ({isSameSender, message}) => {

    const {deleteGroupMessage, openImageModal} = useContext(GroupChatContext);


    const handleDelete = async () => {
        await deleteGroupMessage(message._id);
    }

    const isPortrait = message?.imageHeight > message?.imageWidth;
    return (
    <div className="w-full flex flex-row justify-end items-center gap-1">
        <div className="w-fit h-full flex items-center justify-center">
            <Trash2 onClick={handleDelete} strokeWidth={1.75} size={18} className="text-gray-400 hover:text-gray-700 cursor-pointer"/>
        </div>
        <div onClick={() => openImageModal(message)} className={`bg-[#7678ed] w-fit max-w-[70%] cursor-pointer p-1 ${isSameSender ? "rounded-xl" : "rounded-l-xl rounded-br-xl"} flex flex-col gap-1 overflow-hidden`}>
            <div className={`${isPortrait ? "w-52" : "w-80"} max-w-full rounded-lg overflow-hidden`} style={{ aspectRatio: isPortrait ? "52/75" : "80/48" }}>
                <img src={message?.image} alt="chat-image" className="w-full h-full object-cover"/>
            </div>
            <p className="text-sm text-white">{message.text}</p>
            <div className="w-full flex flex-row justify-end items-center gap-2">
                <p className="text-xs uppercase text-gray-300">{new Date(message?.createdAt).toLocaleTimeString([], {
                    hour:"2-digit",
                    minute:"2-digit",
                    hour12: true
                })}</p>
                {
                    message.isViewed ? (<CheckCheck  size={16} strokeWidth={1.5} className="text-white"/>) :
                    (<Check size={16} strokeWidth={1.5} className="text-gray-300" />)
                }
            </div>
        </div>
    </div>
    )
}

export default GroupOutgoingImageAndCaptionBubble