import { useContext, useState, useEffect } from "react";
import { CallContext } from "../context/CallContext";
import { ChatContext } from "../context/ChatContext";
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, Volume2, VolumeX, Maximize2 } from "lucide-react";

const PToPVideoCallModal = () => {
    const {selectedUser} = useContext(ChatContext);
    const {localVideoRef, remoteVideoRef, localStream, remoteStream, endCall} = useContext(CallContext);

    // Local UI states for call interaction design
    const [isMicMuted, setIsMicMuted] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const [isCallMuted, setIsCallMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isRemoteVideoActive, setIsRemoteVideoActive] = useState(false);

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

    const initials = selectedUser?.fullName
        ? selectedUser.fullName
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
                        {selectedUser?.profilePhoto ? (
                            <img src={selectedUser.profilePhoto} alt={selectedUser.fullName} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <span>{initials}</span>
                        )}
                        <div className="absolute bg-green-500 h-2.5 w-2.5 rounded-full bottom-0 right-0 border-2 border-[#1b1b22] animate-pulse"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm capitalize">{selectedUser?.fullName || "User"}</span>
                        <span className="text-[10px] text-emerald-400 font-medium tracking-wide flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                            Live Connection
                        </span>
                    </div>
                </div>

                {/* Modal Utility controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="bg-[#1b1b22]/80 hover:bg-[#282832] border border-white/5 text-white/80 hover:text-white p-2.5 rounded-full backdrop-blur-md transition-all shadow-lg cursor-pointer"
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                        <Maximize2 size={16} />
                    </button>
                </div>
            </div>

            {/* Main Video Section */}
            <div className="relative w-full h-[90%] grow flex items-center justify-center pt-2 z-10">
                <div className="relative w-fit h-full rounded-3xl overflow-hidden bg-[#131317] border border-white/5 shadow-2xl flex items-center justify-center">

                    {/* Remote Video Element */}
                    <video
                        ref={remoteVideoRef}
                        className="w-full h-full object-contain transition-opacity duration-300"
                        autoPlay
                        playsInline
                        onPlaying={() => setIsRemoteVideoActive(true)}
                        onLoadedMetadata={() => setIsRemoteVideoActive(true)}
                    />

                    {/* Remote User Placeholder (Visible if remote video stream is inactive / loading) */}
                    {!isRemoteVideoActive && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#131317] z-10">
                            <div className="relative flex items-center justify-center">
                                {/* Animated Pulse Waves */}
                                <div className="absolute w-44 h-44 rounded-full bg-[#7678ed]/20 animate-ping opacity-60"></div>
                                <div className="absolute w-56 h-56 rounded-full bg-[#7678ed]/10 animate-pulse opacity-40"></div>
                                <div className="relative bg-[#202022] w-32 h-32 rounded-full border-4 border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
                                    {selectedUser?.profilePhoto ? (
                                        <img src={selectedUser.profilePhoto} alt={selectedUser.fullName} className="w-full h-full object-cover" />
                                    ) : (
                                        <h3 className="text-white font-bold text-4xl">{initials}</h3>
                                    )}
                                </div>
                            </div>
                            <h2 className="text-white/95 font-semibold text-lg mt-6 capitalize tracking-wide">
                                {selectedUser?.fullName || "User"}
                            </h2>
                            <p className="text-white/40 text-xs mt-1.5 tracking-widest uppercase">
                                Connecting video feed...
                            </p>
                        </div>
                    )}

                    {/* Floating Local Video Frame (Picture in Picture) */}
                    <div className="absolute top-3 right-3 w-fit h-44 bg-[#1a1a20] rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl z-20 group transition-all duration-300 hover:scale-105">
                        {/* Local Video Element */}
                        <video
                            ref={localVideoRef}
                            className={`w-full h-full scale-x-[-1] object-contain ${isVideoMuted ? "opacity-0" : "opacity-100"} transition-opacity  duration-300`}
                            autoPlay
                            muted
                            playsInline
                        />
                        {/* Muted video visual representation */}
                        {isVideoMuted && (
                            <div className="absolute inset-0 bg-[#16161a] flex flex-col items-center justify-center">
                                <div className="bg-[#202022] w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white/80 font-bold text-lg">
                                    You
                                </div>
                                <span className="text-[10px] text-white/50 mt-2 font-medium tracking-wide">Camera Muted</span>
                            </div>
                        )}

                        <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-semibold text-white/90 border border-white/5">
                            You
                        </div>
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
                            onClick={() => endCall(selectedUser._id)}
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