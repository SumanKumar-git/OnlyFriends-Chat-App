import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { X } from "lucide-react";


const ImageModal = () => {

    const {closeImageModal, selectedImageMessage} = useContext(ChatContext);

    const isPortrait = selectedImageMessage?.imageHeight > selectedImageMessage?.imageWidth;

    return (
        <div className="w-full h-screen bg-black/80 backdrop-blur-sm z-10 absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
                <img src={selectedImageMessage?.image} alt="chat-image" className={`${isPortrait ? "w-110 h-150" : "w-220 h-130"} object-contain`}/>
                {
                    selectedImageMessage?.text && (
                        <p className="text-white text-lg mt-4">{selectedImageMessage.text}</p>
                    )
                }
            </div>
            <X onClick={closeImageModal} className="absolute top-4 right-4 w-12 h-12 text-white cursor-pointer"/>
        </div>
    )
}

export default ImageModal