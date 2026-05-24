import { useContext, useEffect } from "react";
import { GroupChatContext } from "../context/GroupChatContext";
import { X } from "lucide-react";

const GroupImageModal = () => {
    const { closeImageModal, selectedImageMessage } = useContext(GroupChatContext);

    useEffect(() => {
        return () => {
            closeImageModal();
        };
    }, [closeImageModal]);

    const isPortrait = selectedImageMessage?.imageHeight > selectedImageMessage?.imageWidth;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center select-none" onClick={closeImageModal}>
            <div className="flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <img 
                    src={selectedImageMessage?.image} 
                    alt="chat-image" 
                    className={`${isPortrait ? "max-w-[90vw] max-h-[80vh] md:w-110 md:h-150" : "max-w-[95vw] max-h-[85vh] md:w-220 md:h-130"} object-contain rounded-lg shadow-2xl`}
                />
                {
                    selectedImageMessage?.text && (
                        <p className="text-white text-lg mt-4 text-center px-4 max-w-[90vw] font-medium">{selectedImageMessage.text}</p>
                    )
                }
            </div>
            <X onClick={closeImageModal} className="absolute top-4 right-4 w-12 h-12 text-white/80 hover:text-white cursor-pointer z-50 transition-colors"/>
        </div>
    );
};

export default GroupImageModal;
