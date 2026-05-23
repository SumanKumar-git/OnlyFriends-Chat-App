import IncomingImageBubble from "./IncomingImageBubble";
import IncomingImageAndCaptionBubble from "./IncomingImageAndCaptionBubble";

const IncomingChatbox = ({message, isSameSender}) => {
  return (
    <>
      {message.text && !message.image &&
        <div className="w-full flex flex-row items-center justify-start">
      <div className={`bg-[#DCDCFE] w-fit max-w-[70%] px-3 py-2 ${isSameSender ? "rounded-xl" : "rounded-r-xl rounded-bl-xl" } flex flex-col gap-1`}>
        <p className="text-sm text-black">{message.text}</p>
        <p className="text-xs uppercase text-right text-gray-500">{new Date(message?.createdAt).toLocaleTimeString([], {
                  hour:"2-digit",
                  minute:"2-digit",
                  hour12: true
                })}
        </p>
      </div>
    </div>
      }
      {
        message.image && !message.text && (
            <IncomingImageBubble isSameSender={isSameSender} message={message}/>
        )
      }
      {
        message.image && message.text && (
            <IncomingImageAndCaptionBubble isSameSender={isSameSender} message={message}/>
        )
      }
    </>
  )
}

export default IncomingChatbox