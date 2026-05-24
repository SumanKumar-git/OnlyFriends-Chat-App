import { useState, useContext } from "react";
import ChatInfo from "../components/ChatInfo"
import ChatScreen from "../components/ChatScreen"
import SidebarUsers from "../components/SidebarUsers"
import { ChatContext } from "../context/ChatContext"

const Chat = () => {
  const { selectedUser } = useContext(ChatContext);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <div className={`${selectedUser ? "hidden md:block" : "block"} w-full md:w-[22%] h-[calc(100vh-7.5rem)] md:h-full md:py-3`}>
        <SidebarUsers/>
      </div>
      <div className={`${selectedUser ? (showInfo ? "hidden md:block" : "block") : "hidden md:block"} w-full md:w-[47%] h-full md:py-3`}>
        <ChatScreen onShowInfo={() => setShowInfo(true)} />
      </div>
      <div className={`${selectedUser && showInfo ? "block" : "hidden md:block"} w-full md:w-[23%] h-full md:p-3`}>
        <ChatInfo onCloseInfo={() => setShowInfo(false)} />
      </div>
    </>
  )
}

export default Chat