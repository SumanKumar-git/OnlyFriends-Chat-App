import ChatInfo from "../components/ChatInfo"
import ChatScreen from "../components/ChatScreen"
import SidebarUsers from "../components/SidebarUsers"

const Chat = () => {
  return (
    <>
      <SidebarUsers/>
      <ChatScreen/>
      <ChatInfo/>
    </>
  )
}

export default Chat