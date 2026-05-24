import { useState, useContext, useEffect } from "react"
import GroupChatInfo from "../components/GroupChatInfo"
import GroupChatScreen from "../components/GroupChatScreen"
import GroupSidebar from "../components/GroupSidebar"
import { GroupChatContext } from "../context/GroupChatContext"
import CreateGroupModal from "../components/CreateGroupModal"
import MemberSelectModel from "../components/MemberSelectModel"
import AddGroupMembersModal from "../components/AddGroupMembersModal"
import RemoveGroupMembersModal from "../components/RemoveGroupMembersModal"
import ClearChatConfirmationModal from "../components/ClearChatConfirmationModal"
import GroupUpdateModal from "../components/GroupUpdateModal"
import GroupImageModal from "../components/GroupImageModal"

const Groups = () => {
    const {getAllGroup, getUserGroups, selectedGroupTab, selectedGroup, modalType, isModalOpen, isImageModalOpen} = useContext(GroupChatContext);
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        async function fetchGroups() {
            if(selectedGroupTab === "all-groups"){
                await getAllGroup();
            }else{
                await getUserGroups();
            }
        }
        fetchGroups();
    }, [selectedGroupTab]);

    return (
        <>
            <div className={`${selectedGroup ? "hidden md:block" : "block"} flex-1 md:flex-none w-full md:w-[22%] h-[calc(100vh-7.5rem)] md:h-full md:py-3`}>
                <GroupSidebar />
            </div>
            <div className={`${selectedGroup ? (showInfo ? "hidden md:block" : "block") : "hidden md:block"} flex-1 md:flex-none w-full md:w-[47%] h-full md:py-3`}>
                <GroupChatScreen onShowInfo={() => setShowInfo(true)} />
            </div>
            <div className={`${selectedGroup && showInfo ? "block" : "hidden md:block"} flex-1 md:flex-none w-full md:w-[23%] h-full md:p-3`}>
                <GroupChatInfo onCloseInfo={() => setShowInfo(false)} />
            </div>

            {/* Global Overlay Modals for Group Operations */}
            {modalType === "create-group" && isModalOpen && <CreateGroupModal />}
            {modalType === "select-members" && isModalOpen && <MemberSelectModel />}
            {modalType === "add-members" && isModalOpen && <AddGroupMembersModal />}
            {modalType === "remove-members" && isModalOpen && <RemoveGroupMembersModal />}
            {modalType === "clear-chat" && isModalOpen && <ClearChatConfirmationModal />}
            {modalType === "update-group" && isModalOpen && <GroupUpdateModal />}

            {/* Global Overlay Modal for Group Images */}
            {isImageModalOpen && <GroupImageModal />}
        </>
    )
}

export default Groups