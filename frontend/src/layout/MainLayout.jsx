import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import MobileHeader from "../components/MobileHeader"
import { useContext } from "react"
import { ChatContext } from "../context/ChatContext"
import { GroupChatContext } from "../context/GroupChatContext"
import { CallContext } from "../context/CallContext"
import IncomingVideoCallPopupModal from "../components/IncomingVideoCallPopupModal"
import PToPVideoCallModal from "../components/PToPVideoCallModal"

const MainLayout = () => {
    const { selectedUser } = useContext(ChatContext);
    const { selectedGroup } = useContext(GroupChatContext);
    const { isCalling, callAccepted } = useContext(CallContext);

    // Hide mobile header if any conversation is active
    const isChatActive = selectedUser || selectedGroup;

    return (
        <div className="bg-[#202022] w-full h-screen flex flex-col md:flex-row items-center overflow-hidden relative">
            {/* Mobile Header - Top of the screen on mobile (only when no active chat) */}
            {!isChatActive && <MobileHeader />}

            {/* Inner Content Layout Wrapper */}
            <div className={`flex-1 w-full ${isChatActive ? 'h-screen' : 'h-[calc(100vh-3.5rem)]'} md:h-screen flex flex-col-reverse md:flex-row overflow-hidden`}>
                <Sidebar/>
                <Outlet/>
            </div>

            <IncomingVideoCallPopupModal />
            {(isCalling || callAccepted) && <PToPVideoCallModal />}
        </div>
    )
}

export default MainLayout