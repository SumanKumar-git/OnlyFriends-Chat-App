import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { ArrowLeft } from "lucide-react";


const ChatInfo = ({ onCloseInfo }) => {

  const {selectedUser, allMessages, openImageModal} = useContext(ChatContext);
  const {onlineUsers} = useContext(AuthContext);

  const initials = selectedUser?.fullName?.split(' ').map((word) => word[0]).join('').toUpperCase();
  const imageMessages = allMessages?.filter((msg)=>msg.image)


  return (
    <div className="w-full h-full">
        <div className="w-full h-full bg-[#DCDCFE] px-1 rounded-none md:rounded-3xl overflow-hidden">
            {/* Top */}
            {
              selectedUser?(
                <>
                <div className="w-full h-[10%] px-3 flex items-center gap-3 border-b border-[#9b9bd3]">
                  <button 
                      onClick={onCloseInfo} 
                      className="md:hidden text-gray-700 hover:text-gray-900 cursor-pointer"
                  >
                      <ArrowLeft className="w-6 h-6" />
                  </button>
                  <h1 className="font-semibold text-xl">Chat Info</h1>
                </div>
                {/* Middle */}
                <div className="w-full h-fit max-h-[35%] px-3 flex flex-col items-center gap-2 border-b border-[#9b9bd3] py-4">
                <div className="bg-[#202022] w-22 h-22 aspect-square rounded-2xl shadow-md relative flex items-center justify-center">
                    {
                      selectedUser?.profilePhoto ? (
                        <img src={selectedUser?.profilePhoto} alt="Profile Photo" className="w-full h-full rounded-2xl object-cover" />
                    ) : (
                        <h3 className=" text-white aspect-square w-16 flex items-center justify-center rounded-2xl font-semibold text-3xl">{initials}</h3>
                    )
                    }
                    {
                        onlineUsers?.includes(selectedUser?._id)&&(
                            <div className="absolute bg-green-500 h-4 w-4 rounded-full -bottom-1 -right-1 border-2 border-white"></div>
                        )
                    }
                </div>
                <h2 className="font-semibold text-xl">{selectedUser?.fullName}</h2>
                <p className="text-sm font-medium text-gray-600">{selectedUser?.email}</p>
                <div className=" w-full flex flex-col justify-center items-start  gap-1">
                  <h2 className="text-lg font-semibold">About</h2>
                  <p className="text-sm font-medium text-gray-600">{selectedUser?.bio}</p>
                </div>
            </div>
            {/* Bottom */}
            <div className="w-full h-[55%] pb-4">
              <div className="w-full h-[20%] px-3 py-2 flex flex-col justify-between">
                <h1 className="text-xl font-semibold">Shared Media</h1>
                {
                  imageMessages.length > 0 && (
                    <h2 className="text-base font-medium text-gray-600">Images ({imageMessages?.length})</h2>
                  )
                }
              </div>
              <div className="image-gallery-container pl-3 w-full h-fit max-h-[80%] overflow-auto flex flex-row justify-start flex-wrap gap-2">
                    {imageMessages?.length === 0 ? (
                      <p className="text-center text-gray-500">No media files</p>
                    ):
                    imageMessages?.map((msg)=>(
                        <div onClick={()=>openImageModal(msg)} key={msg._id} className="w-23 h-23 cursor-pointer border-2 border-transparent hover:border-[#7678ed] aspect-square rounded-lg">
                          <img src={msg?.image} alt="Message" className="w-full h-full rounded-lg object-cover" />
                        </div>
                    ))
                    }
              </div>
            </div>
                </>
              ):
              (
                <div className="w-full h-full flex items-center justify-center">
                  <h1 className="font-semibold text-xl">No Chat Selected</h1>
                </div>
              )
            }
        </div>
    </div>
  )
}

export default ChatInfo