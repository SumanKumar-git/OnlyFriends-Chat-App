import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";


const UserCard = ({user, message, time, unreadCount}) => {

    const { selectedUser, setSelectedUser, setUnseenMessages } = useContext(ChatContext);
    const {onlineUsers} = useContext(AuthContext);

    const onClickHandler = () => {
        setSelectedUser(user);
        setUnseenMessages((prev) => {
            const updated = {...prev};
            delete updated[user._id.toString()];
            return updated;
        });
    }

    const initials = user.fullName.split(' ').map((word) => word[0]).join('').toUpperCase();

    return (
    <div onClick={onClickHandler} className={`p-2.5 rounded-xl cursor-pointer ${selectedUser?._id === user._id ? "bg-[#EEEDFF]" : "bg-[#f5f5f5]"} `}>
        <div className="flex flex-row gap-3">
            <div className="bg-[#202022] aspect-square w-14 h-14 flex items-center justify-center rounded-lg relative">
                {
                    user?.profilePhoto ? (
                        <img src={user?.profilePhoto} alt="Profile Photo" className="w-full h-full rounded-lg object-cover" />
                    ) : (
                        <h3 className="text-white font-semibold text-2xl">{initials}</h3>
                    )
                }
                {
                            onlineUsers.includes(user._id)&&(
                                <div className="absolute bg-green-500 h-3 w-3 rounded-full -bottom-1 -right-1 border-2 border-white"></div>
                            )
                        }
            </div>
            <div className="flex flex-row w-full justify-between overflow-hidden ">
                <div className="flex flex-col justify-center w-[70%]  gap-1.5">
                    <h2 className="text-sm font-semibold">{user.fullName}</h2>
                    {
                        message?.senderId ? (
                            message.senderId.toString() === user._id.toString() ? (
                                <p className="text-xs truncate w-full">
                                    {message.text || (message.image && "Sent an image")}
                                </p>
                            ) : (
                                <p className="text-xs truncate w-full">
                                    You: {message.text || (message.image && "You sent an image")}
                                </p>
                            )
                        ) : (
                            <p className="text-xs text-gray-500">No message yet</p>
                        )
                    }
                </div>
                <div className="flex flex-col items-center gap-1">
                    <p className="text-xs uppercase">{time && new Date(time).toLocaleTimeString([], {
                        hour:"2-digit",
                        minute:"2-digit",
                        hour12: true
                    })}</p>
                {
                    unreadCount && unreadCount > 0 && (
                        <div className="w-6 h-6 flex items-center justify-center bg-[#7678ed] rounded-full">
                            <p className=" text-white text-xs">
                                {unreadCount}
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

export default UserCard