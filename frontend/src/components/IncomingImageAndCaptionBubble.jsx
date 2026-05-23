import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";


const IncomingImageAndCaptionBubble = ({message, isSameSender}) => {

    const {openImageModal} = useContext(ChatContext);

    const isPortrait = message?.imageHeight > message?.imageWidth;

    return (
        <div className="w-full flex flex-row items-center justify-start">
        <div onClick={() => openImageModal(message)} className={`bg-[#DCDCFE] w-fit max-w-[70%] p-1 cursor-pointer ${isSameSender ? "rounded-xl" : "rounded-r-xl rounded-bl-xl" } flex flex-col gap-1`}>
            <div className={` ${isPortrait ? "w-52 h-75" : "w-80 h-48"}  rounded-lg overflow-hidden`}>
                <img src={message?.image} alt="" className="w-full h-full object-cover"/>
            </div>
            <p className="text-sm text-black pl-2">{message?.text}</p>
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

export default IncomingImageAndCaptionBubble