import { useContext, useEffect, useRef } from "react";
import { GroupChatContext } from "../context/GroupChatContext";


const GroupOptionsModal = () => {

    const {setModalType, setIsModalOpen} = useContext(GroupChatContext);
    const modalRef = useRef(null);

    const handleAddMembers = () => {
        setModalType("add-members");
        setIsModalOpen(true);
    };

    const handleRemoveMembers = () => {
        setModalType("remove-members");
        setIsModalOpen(true);
    };

    const handleClearChat = () => {
        setModalType("clear-chat");
        setIsModalOpen(true);
    };

    const handleUpdateGroup = () => {
        setModalType("update-group");
        setIsModalOpen(true);
    };

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                modalRef.current &&
                !modalRef.current.contains(event.target)
            ) {
                setIsModalOpen(false);
                setModalType(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);



    return (
    <div ref={modalRef} className="absolute top-full right-0 mt-3 w-44 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50">
        <p className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md transition-colors" onClick={handleAddMembers}>Add Members</p>
        <p className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md transition-colors" onClick={handleRemoveMembers}>Remove Members</p>
        <p className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md transition-colors" onClick={handleUpdateGroup}>Edit Group Info</p>
        <p className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md transition-colors" onClick={handleClearChat}>Clear Chats</p>
        <p className="px-2 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white cursor-pointer rounded-md transition-colors">Delete Group</p>
    </div>
    )
}

export default GroupOptionsModal