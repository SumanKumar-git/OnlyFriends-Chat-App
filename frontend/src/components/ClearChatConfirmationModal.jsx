import { useContext } from "react";
import { GroupChatContext } from "../context/GroupChatContext";


const ClearChatConfirmationModal = () => {

    const {clearGroupMessages, selectedGroup, setModalType, setIsModalOpen} = useContext(GroupChatContext);

    const handleClearChat = async () => {
        await clearGroupMessages(selectedGroup?._id);
        setModalType(null);
        setIsModalOpen(false);
    }

    const handleCloseButton = () => {
        setModalType(null);
        setIsModalOpen(false);
    }

    return (
    <div className="fixed inset-0 bg-black/50 w-full h-screen flex items-center justify-center z-50 backdrop-blur-md p-4">
        <div className="bg-white p-6 rounded-lg">
            <h1 className="text-xl font-semibold mb-3">Clear Chat</h1>
            <p className="text-gray-700 mb-1">Are you sure you want to clear the chat?</p>
            <p className="text-red-500 text-sm mb-6">Messages will be deleted permanently.</p>
            <div className="flex justify-end gap-4">
                <button onClick={handleCloseButton} className="px-4 py-2 bg-gray-200 rounded-md cursor-pointer">Cancel</button>
                <button onClick={handleClearChat} className="px-4 py-2 border-2 border-transparent hover:border-red-500 hover:bg-white hover:text-red-500 bg-red-500 text-white cursor-pointer rounded-md transition-all">Clear</button>
            </div>
        </div>
    </div>
    )
}

export default ClearChatConfirmationModal