import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";


export const CallContext = createContext();

export const CallContextProvider = ({children}) => {

    const {socket, authUser} = useContext(AuthContext);

    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const [incomingCall, setIncomingCall] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [isCalling, setIsCalling] = useState(false);
    const pendingCandidates = useRef([]);

    const peerConnection = useRef(null);
    
    // WebRTC connection refs for synchronous operations
    const localStreamRef = useRef(null);
    const remoteStreamRef = useRef(null);
    
    // React state hooks for reactive UI updates
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    const createPeerConnection = () => {
        const pc = new RTCPeerConnection({
            iceServers: [
                {
                    urls: ["stun:stun.l.google.com:19302"]
                }
            ]
        });
        peerConnection.current = pc;
        return pc;
    };

    const getMedia = async () => {
        try {
            if(localStreamRef.current){
                return localStreamRef.current;
            }
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            localStreamRef.current = stream;
            setLocalStream(stream);

            if(localVideoRef.current){
                localVideoRef.current.srcObject = stream;
            }
            return stream;
        }
        catch(error){
            console.warn("Camera/mic in use or unavailable, trying audio-only fallback:", error);
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: false,
                    audio: true
                });
                localStreamRef.current = stream;
                setLocalStream(stream);
                if(localVideoRef.current){
                    localVideoRef.current.srcObject = stream;
                }
                return stream;
            } catch (audioError) {
                console.warn("Audio-only media failed, trying video-only fallback:", audioError);
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: false
                    });
                    localStreamRef.current = stream;
                    setLocalStream(stream);
                    if(localVideoRef.current){
                        localVideoRef.current.srcObject = stream;
                    }
                    return stream;
                } catch (videoError) {
                    console.error("All media capture fallbacks failed:", videoError);
                    return null;
                }
            }
        }
    };

    const addTracks = () => {
        if (localStreamRef.current && peerConnection.current) {
            localStreamRef.current.getTracks().forEach(track => {
                peerConnection.current.addTrack(track, localStreamRef.current);
            });
        }
    };

    const setupRemoteStream = () => {
        if (peerConnection.current) {
            peerConnection.current.ontrack = (event) => {
                remoteStreamRef.current = event.streams[0];
                setRemoteStream(event.streams[0]);

                if(remoteVideoRef.current){
                    remoteVideoRef.current.srcObject = event.streams[0];
                }
            };
        }
    };

    const setupIceCandidates = (remoteUserId) => {
        if (peerConnection.current) {
            peerConnection.current.onicecandidate = (event) => {
                if(event.candidate){
                    socket.emit("ice-candidate", {
                        to: remoteUserId,
                        candidate: event.candidate
                    });
                }
            };
        }
    };

    const startCall = async (remoteUserId) => {
        try {
            setIsCalling(true);
            setCallEnded(false);
            const stream = await getMedia();
            if (!stream) {
                console.error("Failed to get media stream");
                setIsCalling(false);
                return;
            }
            createPeerConnection();
            addTracks();
            setupRemoteStream();
            setupIceCandidates(remoteUserId);

            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);

            socket.emit("call-user", {
                to: remoteUserId,
                offer,
                callerInfo: {
                    _id: authUser._id,
                    fullName: authUser.fullName,
                    profilePhoto: authUser.profilePhoto
                }
            });
        } catch (error) {
            console.error("Error starting call:", error);
            setIsCalling(false);
            setCallEnded(true);
        }
    };

    // listen incoming call
    useEffect(() => {
        if(!socket) return;
        socket.on("incoming-call", ({from, offer, callerInfo}) => {
            console.log("Incoming Call:", {from, offer, callerInfo});
            setIncomingCall({from, offer, callerInfo});
        });
        return () => {
            socket.off("incoming-call");
        };
    }, [socket]);

    const acceptCall = async () => {
        try {
            if (!incomingCall) return;

            const stream = await getMedia();
            if (!stream) {
                console.error("Failed to get media stream for accepting call");
                setIncomingCall(null);
                return;
            }
            createPeerConnection();
            addTracks();
            setupRemoteStream();
            setupIceCandidates(incomingCall.from);

            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));

            // Process any pending candidates that arrived before setRemoteDescription completed
            for (const candidate of pendingCandidates.current) {
                try {
                    if (candidate) {
                        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
                    }
                } catch (err) {
                    console.error("Error adding pending candidate on accept:", err);
                }
            }
            pendingCandidates.current = [];

            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);

            socket.emit("call-accepted", {
                to: incomingCall.from,
                answer
            });

            setIncomingCall(null);
            setCallAccepted(true);
            setIsCalling(true);
            setCallEnded(false);
        } catch (error) {
            console.error("Error accepting call:", error);
            setIncomingCall(null);
            setCallAccepted(false);
            setIsCalling(false);
        }
    };

    const rejectCall = () => {
        if (incomingCall) {
            socket.emit("reject-call", {
                to: incomingCall.from
            });
        }
        setIncomingCall(null);
    };

    // receive answer
    useEffect(() => {
        if(!socket) return;
        socket.on("call-accepted", async ({answer}) => {
            try {
                if (peerConnection.current) {
                    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
                    setCallAccepted(true);
                    setIsCalling(true);

                    // Process any pending candidates that arrived before remoteDescription was set
                    for (const candidate of pendingCandidates.current) {
                        try {
                            if (candidate) {
                                await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
                            }
                        } catch (err) {
                            console.error("Error adding pending candidate after answer:", err);
                        }
                    }
                    pendingCandidates.current = [];
                }
            } catch (error) {
                console.error("Error in call-accepted handler:", error);
            }
        });
        return () => {
            socket.off("call-accepted");
        };
    }, [socket]);

    // Receive ICE candidate
    useEffect(() => {
        if(!socket) return;
        socket.on("ice-candidate", async ({candidate}) => {
            try {
                if (peerConnection.current && peerConnection.current.remoteDescription) {
                    await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
                } else {
                    pendingCandidates.current.push(candidate);
                }
            }
            catch(error){
                console.error("Error adding ICE candidate:", error);
            }
        });
        return () => {
            socket.off("ice-candidate");
        };
    }, [socket]);

    // listen call rejection
    useEffect(() => {
        if(!socket) return;
        socket.on("call-rejected", () => {
            console.log("Call Rejected by recipient");
            setCallEnded(true);
            setIsCalling(false);
            setCallAccepted(false);
            setIncomingCall(null);
            setLocalStream(null);
            setRemoteStream(null);
            if (peerConnection.current) {
                peerConnection.current.close();
                peerConnection.current = null;
            }
            if(localStreamRef.current){
                localStreamRef.current.getTracks().forEach(track => track.stop());
                localStreamRef.current = null;
            }
            remoteStreamRef.current = null;
        });
        return () => {
            socket.off("call-rejected");
        };
    }, [socket]);

    // listen call ended
    useEffect(() => {
        if(!socket) return;
        socket.on("call-ended", () => {
            console.log("Call Ended by remote user");
            setCallEnded(true);
            setIsCalling(false);
            setCallAccepted(false);
            setIncomingCall(null);
            setLocalStream(null);
            setRemoteStream(null);
            if (peerConnection.current) {
                peerConnection.current.close();
                peerConnection.current = null;
            }
            if(localStreamRef.current){
                localStreamRef.current.getTracks().forEach(track => track.stop());
                localStreamRef.current = null;
            }
            remoteStreamRef.current = null;
        });
        return () => {
            socket.off("call-ended");
        };
    }, [socket]);

    const endCall = (remoteUserId) => {
        setCallEnded(true);
        setIsCalling(false);
        setCallAccepted(false);
        setIncomingCall(null);
        setLocalStream(null);
        setRemoteStream(null);
        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }
        if(localStreamRef.current){
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }
        remoteStreamRef.current = null;
        socket.emit("end-call", {
            to: remoteUserId,
        });
    };

    useEffect(() => {
        return () => {
            if(localStreamRef.current){
                localStreamRef.current.getTracks().forEach(track => {
                    track.stop();
                });
                localStreamRef.current = null;
            }
            if (peerConnection.current) {
                peerConnection.current.close();
                peerConnection.current = null;
            }
            remoteStreamRef.current = null;
            setLocalStream(null);
            setRemoteStream(null);
        };
    }, []);

    const value = {
        localVideoRef,
        remoteVideoRef,
        incomingCall,
        callAccepted,
        callEnded,
        isCalling,
        startCall,
        endCall,
        acceptCall,
        rejectCall,
        setIncomingCall,
        setCallAccepted,
        setIsCalling,
        localStream,
        remoteStream
    }
    return (
        <CallContext.Provider value={value}>
            {children}
        </CallContext.Provider>
    );
}

export default CallContextProvider;