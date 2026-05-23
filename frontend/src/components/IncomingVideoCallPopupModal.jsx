import { IoCall } from "react-icons/io5";
import { FaVideo } from "react-icons/fa6";
import { useContext } from "react";
import { CallContext } from "../context/CallContext";


const IncomingVideoCallPopupModal = () => {

    const {incomingCall, acceptCall, rejectCall} = useContext(CallContext);

    if(!incomingCall){
        return null;
    }

    return (
        <div className="absolute top-10 bg-white flex flex-row items-center justify-between z-50 shadow-md rounded-xl px-2 w-110 h-15">
            <div className="flex flex-row items-center gap-3">
                {
                    incomingCall?.callerInfo?.profilePhoto ? (
                        <img src={incomingCall?.callerInfo?.profilePhoto} alt="profile" className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                            {
                                incomingCall?.callerInfo?.fullName
                                ?.split(" ")
                                ?.map(word => word[0])
                                ?.join("")
                                ?.toUpperCase()
                            }
                        </div>
                    )
                }
                <div>
                    <h1 className="font-semibold">{incomingCall?.callerInfo?.fullName}</h1>
                    <p className="text-sm font-medium text-gray-500">Incoming Video Call...</p>
                </div>
            </div>
            <div className="flex flex-row gap-3">
                <button onClick={() => rejectCall()} className="bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"><IoCall className="rotate-135 w-6 h-6" /></button>
                <button onClick={() => acceptCall()} className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"><FaVideo className="w-6 h-6" /></button>
            </div>
        </div>
    )
}

export default IncomingVideoCallPopupModal