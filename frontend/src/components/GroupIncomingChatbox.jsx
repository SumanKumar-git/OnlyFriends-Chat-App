import GroupIncomingImageAndCaptionBubble from "./GroupIncomingImageAndCaptionBubble"
import GroupIncomingImageBubble from "./GroupIncomingImageBubble"

const GroupIncomingChatbox = ({message, isSameSender}) => {
    return (
    <>
    {message.text && !message.image &&
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
        <div className={`bg-[#EEEDFF] w-fit max-w-[70%] px-2.5 py-2 ${isSameSender ? "rounded-xl" : "rounded-r-xl rounded-bl-xl"} flex flex-col`}>
            {
                !isSameSender &&
            <p className="text-sm font-medium text-blue-600 capitalize ">{message.senderId.fullName}</p>
            }
            <p className="text-sm text-black pb-0.5">{message.text}</p>
            <p className="text-xs uppercase text-gray-500">{new Date(message?.createdAt).toLocaleTimeString([], {
                    hour:"2-digit",
                    minute:"2-digit",
                    hour12: true
                })}</p>
        </div>
    </div>
    }
    {
        message.image && !message.text &&
        <GroupIncomingImageBubble isSameSender={isSameSender} message={message}/>
    }
    {
        message.image && message.text &&
        <GroupIncomingImageAndCaptionBubble isSameSender={isSameSender} message={message}/>
    }
    </>
  )
}

export default GroupIncomingChatbox