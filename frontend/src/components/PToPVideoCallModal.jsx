import { useContext, useState, useEffect } from "react";
import { CallContext } from "../context/CallContext";
import { AuthContext } from "../context/AuthContext";
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, Volume2, VolumeX } from "lucide-react";

const PToPVideoCallModal = () => {
    const {authUser} = useContext(AuthContext);
    const {localVideoRef, remoteVideoRef, localStream, remoteStream, endCall, callPartner} = useContext(CallContext);

    // Local UI states for call interaction design
    const [isMicMuted, setIsMicMuted] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const [isCallMuted, setIsCallMuted] = useState(false);
    const [isRemoteVideoActive, setIsRemoteVideoActive] = useState(false);
    const [selectedLayout, setSelectedLayout] = useState("default");

    // Reactively bind local stream to local video element when mounted or stream updates
    useEffect(() => {
        if (localStream && localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream, localVideoRef]);

    // Reactively bind remote stream to remote video element when mounted or stream updates
    useEffect(() => {
        if (remoteStream && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream, remoteVideoRef]);

    const initials = callPartner?.fullName
        ? callPartner.fullName
              .split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase()
        : "VC";

    return (
        <div className={`fixed inset-0 z-50 bg-[#0c0c0e] flex flex-col justify-between p-3 select-none overflow-hidden transition-all duration-300`}>
            {/* Ambient Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#7678ed]/5 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-rose-500/5 blur-[120px] pointer-events-none"></div>

            {/* Top Navigation / Overlay Bar */}
            <div className=" w-full flex items-center justify-between z-20 px-2 py-1">
                {/* Caller Information */}
                <div className="bg-[#1b1b22]/80 backdrop-blur-md border border-white/5 pl-2 pr-5 py-2 rounded-full flex items-center gap-3 text-white shadow-lg shadow-black/20">
                    <div className="bg-[#7678ed] w-10 h-10 aspect-square rounded-full flex items-center justify-center font-bold text-base shadow-inner relative">
                        {callPartner?.profilePhoto ? (
                            <img src={callPartner.profilePhoto} alt={callPartner.fullName} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <span>{initials}</span>
                        )}
                        <div className="absolute bg-green-500 h-2.5 w-2.5 rounded-full bottom-0 right-0 border-2 border-[#1b1b22] animate-pulse"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm capitalize">{callPartner?.fullName || "User"}</span>
                        <span className="text-[10px] text-emerald-400 font-medium tracking-wide flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                            Live Connection
                        </span>
                    </div>
                </div>
                {/* Layout Selection */}
                <div className="bg-[#1b1b22]/80 backdrop-blur-md border border-white/5 p-1 rounded-xl flex items-center gap-1.5 text-white shadow-lg shadow-black/20">
                    <button 
                        onClick={() => setSelectedLayout("default")} 
                        className={`flex items-center justify-center p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                            selectedLayout === "default" 
                            ? "bg-[#7678ed]/20 border border-[#7678ed]/50 text-[#7678ed]" 
                            : "bg-transparent border border-transparent text-white/40 hover:text-white/80 hover:bg-white/5"
                        }`}
                        title="Default (Picture-in-Picture) Layout"
                    >
                        <div className={`w-8 h-6 border-2 ${selectedLayout === "default" ? "border-[#7678ed]" : "border-white/40"} rounded relative transition-colors`}>
                            <div className={`absolute w-3 h-2 bottom-0.5 right-0.5 border ${selectedLayout === "default" ? "border-[#7678ed]" : "border-white/40"} rounded-sm bg-[#131317] transition-colors`}></div>
                        </div>
                    </button>
                    <button 
                        onClick={() => setSelectedLayout("split")} 
                        className={`flex items-center justify-center p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                            selectedLayout === "split" 
                            ? "bg-[#7678ed]/20 border border-[#7678ed]/50 text-[#7678ed]" 
                            : "bg-transparent border border-transparent text-white/40 hover:text-white/80 hover:bg-white/5"
                        }`}
                        title="Split Screen Layout"
                    >
                        <div className="flex gap-0.5">
                            <div className={`w-4 h-6 border-2 border-r-0 ${selectedLayout === "split" ? "border-[#7678ed]" : "border-white/40"} rounded-l transition-colors`}></div>
                            <div className={`w-4 h-6 border-2 border-l-0 ${selectedLayout === "split" ? "border-[#7678ed]" : "border-white/40"} rounded-r transition-colors`}></div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Main Video Section */}
            <div className={`relative w-full h-[90%] grow flex ${
                selectedLayout === "split" 
                ? "flex-col md:flex-row-reverse gap-4 pb-24 md:pb-28" 
                : "items-center justify-center"
            } pt-2 z-10`}>
                
                {/* Remote Video Container */}
                <div className={`rounded-3xl overflow-hidden bg-[#131317] border border-white/5 shadow-2xl flex items-center justify-center relative transition-all duration-300 ${
                    selectedLayout === "split" 
                    ? "flex-1 min-h-0 w-full h-full" 
                    : "w-full h-full"
                }`}>
                    <video
                        ref={remoteVideoRef}
                        className={`w-full h-full transition-all duration-300 object-contain`}
                        autoPlay
                        playsInline
                        onPlaying={() => setIsRemoteVideoActive(true)}
                        onLoadedMetadata={() => setIsRemoteVideoActive(true)}
                        muted = {isCallMuted}
                    />

                    {/* Remote User Placeholder (Visible if remote video stream is inactive / loading) */}
                    {!isRemoteVideoActive && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#131317] z-10">
                            <div className="relative flex items-center justify-center">
                                {/* Animated Pulse Waves */}
                                <div className="absolute w-44 h-44 rounded-full bg-[#7678ed]/20 animate-ping opacity-60"></div>
                                <div className="absolute w-56 h-56 rounded-full bg-[#7678ed]/10 animate-pulse opacity-40"></div>
                                <div className="relative bg-[#202022] w-32 h-32 rounded-full border-4 border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
                                    {callPartner?.profilePhoto ? (
                                        <img src={callPartner?.profilePhoto} alt={callPartner?.fullName} className="w-full h-full object-cover" />
                                    ) : (
                                        <h3 className="text-white font-bold text-4xl">{initials}</h3>
                                    )}
                                </div>
                            </div>
                            <h2 className="text-white/95 font-semibold text-lg mt-6 capitalize tracking-wide">
                                {callPartner?.fullName || "User"}
                            </h2>
                            <p className="text-white/40 text-xs mt-1.5 tracking-widest uppercase">
                                Connecting video feed...
                            </p>
                        </div>
                    )}

                    {/* Remote User Name Badge (Visible in split view) */}
                    {selectedLayout === "split" && (
                        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/10 shadow-lg select-none z-20">
                            {callPartner?.fullName || "User"}
                        </div>
                    )}
                </div>

                {/* Local Video Container */}
                <div className={`transition-all duration-300 overflow-hidden bg-[#1a1a20] shadow-2xl z-20 ${
                    selectedLayout === "split"
                    ? "flex-1 min-h-0 w-full h-full rounded-3xl border border-white/5 relative flex items-center justify-center"
                    : "absolute top-3 right-3 w-fit h-44 rounded-2xl border-2 border-white/10 group hover:scale-105"
                }`}>
                    {/* Local Video Element */}
                    <video
                        ref={localVideoRef}
                        className={`w-full h-full scale-x-[-1] transition-all duration-300 ${
                            isVideoMuted ? "opacity-0" : "opacity-100"
                        } object-contain`}
                        autoPlay
                        muted
                        playsInline
                    />
                    
                    {/* Muted video visual representation */}
                    {isVideoMuted && (
                        <div className="absolute inset-0 bg-[#16161a] flex flex-col items-center justify-center z-10">
                            <div className={`bg-[#202022] rounded-full border border-white/10 flex items-center justify-center text-white/80 font-bold overflow-hidden transition-all duration-300 ${
                                selectedLayout === "split" 
                                ? "w-24 h-24 border-4 text-3xl" 
                                : "w-16 h-16 text-lg"
                            }`}>
                                {authUser?.profilePhoto ? (
                                    <img src={authUser.profilePhoto} alt={authUser.fullName} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <span>{authUser?.fullName?.charAt(0).toUpperCase() || "You"}</span>
                                )}
                            </div>
                            <span className={`text-white/50 font-medium tracking-wide mt-2 transition-all duration-300 ${
                                selectedLayout === "split" ? "text-xs" : "text-[10px]"
                            }`}>
                                Camera Muted
                            </span>
                        </div>
                    )}

                    {/* Local User Name Badge */}
                    <div className={`absolute bg-black/60 backdrop-blur-md text-white/90 border border-white/5 rounded-full font-semibold select-none z-20 transition-all duration-300 ${
                        selectedLayout === "split"
                        ? "bottom-4 left-4 px-3 py-1 text-xs"
                        : "bottom-2.5 left-2.5 px-2 py-0.5 text-[10px]"
                    }`}>
                        You
                    </div>
                </div>
                
                {/* Bottom Controls Bar */}
                <div className=" w-full absolute bottom-2 flex justify-center items-center z-20">
                    <div className="bg-[#1c1c24]/90 backdrop-blur-xl border border-white/10 px-3 py-3 rounded-full flex items-center gap-6 shadow-2xl transition-all duration-300 shadow-black/40">
                        {/* Mute Self Audio Toggle */}
                        <button 
                            onClick={() => setIsMicMuted(!isMicMuted)} 
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md ${
                                isMicMuted 
                                ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-900/30 scale-105" 
                                : "bg-[#282834] hover:bg-[#343444] text-white hover:scale-105 active:scale-95"
                            }`}
                            title={isMicMuted ? "Unmute Microphone" : "Mute Microphone"}
                        >
                            {isMicMuted ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>

                        {/* Mute Self Video Toggle */}
                        <button 
                            onClick={() => setIsVideoMuted(!isVideoMuted)} 
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md ${
                                isVideoMuted 
                                ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-900/30 scale-105" 
                                : "bg-[#282834] hover:bg-[#343444] text-white hover:scale-105 active:scale-95"
                            }`}
                            title={isVideoMuted ? "Turn On Camera" : "Turn Off Camera"}
                        >
                            {isVideoMuted ? <VideoOff size={20} /> : <VideoIcon size={20} />}
                        </button>

                        {/* Mute Call Audio (Speaker Toggle) */}
                        <button 
                            onClick={() => setIsCallMuted(!isCallMuted)} 
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md ${
                                isCallMuted 
                                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-900/30 scale-105" 
                                : "bg-[#282834] hover:bg-[#343444] text-white hover:scale-105 active:scale-95"
                            }`}
                            title={isCallMuted ? "Unmute Speaker" : "Mute Speaker"}
                        >
                            {isCallMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>

                        {/* Separation Line */}
                        <div className="h-8 w-px bg-white/10 mx-1"></div>

                        {/* End Call Button */}
                        <button
                            onClick={() => endCall(callPartner?._id)}
                            className="w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg shadow-red-900/40 hover:scale-110 active:scale-95"
                            title="End Call"
                        >
                            <PhoneOff size={22} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PToPVideoCallModal;