import { useContext } from "react";
import { GroupChatContext } from "../context/GroupChatContext";
import { AuthContext } from "../context/AuthContext";


const GroupCard = ({group, selectedGroup, onClick}) => {

    const {unseenMessages, lastMessages} = useContext(GroupChatContext);
    const {authUser} = useContext(AuthContext);

    const getLastMessageText = (message, authUser) => {

    if (!message) return "No message yet";

    const isMe =
        message.senderId?._id.toString() === authUser._id.toString();

    let content;

    // System Messages
    if (message.messageType === "system") {
        content = message.text;
    }

    // Text Message
    else if (message.text) {
        content = message.text;
    }

    // Image Message
    else if (message.image) {
        content = "Sent an image";
    }

    // Fallback
    else {
        content = "New message";
    }

    return isMe ? `You: ${content}` : content;
};

    const groupName = group.groupName;
    const initials = groupName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
  return (
    <div onClick={() => onClick(group)} className={`p-2.5 rounded-xl border cursor-pointer ${selectedGroup?._id === group._id ? "bg-[#EEEDFF] border-[#DCDCFE]" : "bg-[#f5f5f5] border-transparent"}`}>
        <div className="flex flex-row gap-3">
            <div className="bg-[#202022] aspect-square w-14 h-14 flex items-center justify-center rounded-lg relative">
                {
                    group.groupIcon ? (
                        <img src={group.groupIcon} alt="" className="h-full w-full object-cover rounded-lg"/>
                    ) : (
                        <h3 className="text-white font-semibold text-2xl">{initials}</h3>
                    )
                }
            </div>
            <div className="flex flex-row w-full justify-between overflow-hidden ">
                <div className="flex flex-col justify-center w-[70%]  gap-1.5">
                    <h2 className="text-sm font-semibold">{group.groupName}</h2>
                    <p className="text-xs truncate">
                        {getLastMessageText(lastMessages[group._id], authUser)}
                    </p>
                </div>
                <div className="flex h-full flex-col items-center pt-0.5 gap-2.5">
                    {
                        lastMessages[group._id] && (
                            <p className="text-xs uppercase">
                                {new Date(lastMessages[group._id]?.createdAt).toLocaleTimeString([], {
                                    hour:"2-digit",
                                    minute:"2-digit",
                                    hour12: true
                                })}
                            </p>
                        )
                    }
                    {
                        unseenMessages[group._id] && unseenMessages[group._id] > 0 && (
                            <div className="w-6 h-6 flex items-center justify-center bg-[#7678ed] rounded-full">
                                <p className=" text-white text-xs">
                                    {unseenMessages[group._id] > 99 ? "99+" : unseenMessages[group._id]}
                                </p>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default GroupCard