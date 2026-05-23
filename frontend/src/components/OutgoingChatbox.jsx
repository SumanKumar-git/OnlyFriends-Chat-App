import {CheckCheck, Check, Trash2 } from "lucide-react";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import OutgoingImageBubble from "./OutgoingImageBubble";
import OutgoingImageAndCaptionBubble from "./OutgoingImageAndCaptionBubble";

const OutgoingChatbox = ({message, isSameSender}) => {

  const {deleteSingleMessage} = useContext(ChatContext);

  const handleDelete = async () => {
    await deleteSingleMessage(message._id);
  }

  return (
    <>
    {
      message.text && !message.image &&
      <div className="w-full flex flex-row justify-end items-center gap-1">
      <div className="w-fit h-full flex items-center justify-center">
        <Trash2 onClick={handleDelete} strokeWidth={1.75} size={18} className="text-gray-400 hover:text-gray-700 cursor-pointer"/>
      </div>
        <div className={`bg-[#7678ed] w-fit max-w-[70%] px-2 py-2 ${isSameSender ? "rounded-xl" : "rounded-l-xl rounded-br-xl"}  flex flex-col gap-1`}>
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
    }
    {
      message.image && !message.text &&
      <OutgoingImageBubble isSameSender={isSameSender} message={message}/>
    }
    {
      message.image && message.text &&
      <OutgoingImageAndCaptionBubble isSameSender={isSameSender} message={message}/>
    }
    </>
  )
}

export default OutgoingChatbox