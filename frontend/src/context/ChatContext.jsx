import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({children}) => {
    const [allMessages, setAllMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});
    const [lastMessages, setLastMessages] = useState({});

    const {socket, axios} = useContext(AuthContext);

    const [selectedImageMessage, setSelectedImageMessage] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const openImageModal = (message) => {
        setSelectedImageMessage(message);
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
        setSelectedImageMessage(null);
    };

    const getMessages = async(userId) => {
        try {
            const response = await axios.get(`/api/messages/${userId}`);
            if(response.data.success){
                setAllMessages(response.data.chatMessages);
            }
        }
        catch(error){
            toast.error(error.response?.data?.message || error.message);
        }
    }

    const sendMessage = async(formData, tempId) => {
        try {
            const response = await axios.post(`/api/messages/send/${selectedUser._id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if(response.data.success){
                const newMessage = response.data.newMessage;
                setAllMessages((prev) =>
                    prev.map((msg) =>
                        msg._id === tempId ? newMessage : msg
                    )
                );
                setLastMessages((prev)=>({...prev, [selectedUser._id]: newMessage}));
            }
            else{
                toast.error(response.data.message);
                if (tempId) {
                    setAllMessages((prev) => prev.filter((msg) => msg._id !== tempId));
                }
            }
        }
        catch(error){
            toast.error(error.response?.data?.error || error.message);
            if (tempId) {
                setAllMessages((prev) => prev.filter((msg) => msg._id !== tempId));
            }
        }
    }

    const markMessagesSeen = async (senderId) => {
        try {
            await axios.put(`/api/messages/mark-seen/${senderId}`);
        }
        catch(error){
            console.log(error);
        }
    };

    const deleteSingleMessage = async (messageId) => {
        try {
            const response = await axios.delete(`/api/messages/delete/${messageId}`);
            if(response.data.success){
                setAllMessages((prev)=>prev.filter((msg)=>msg._id !== messageId));
                toast.success(response.data.message);
            }
            else{
                toast.error(response.data.message);
            }
        }
        catch(error){
            toast.error(error.response?.data?.error || error.message);
        }
    };

    const subscribeToMessages = () => {
        if(!socket) return;

        socket.on("newMessage", (newMessage) => {

            setLastMessages((prev)=>({...prev, [newMessage.senderId.toString()]: newMessage}));

            if(selectedUser && newMessage.senderId.toString() === selectedUser._id.toString()){
                newMessage.isViewed = true;
                setAllMessages((prev)=>[...prev, newMessage]);
                markMessagesSeen(newMessage.senderId);
            }
            else{
                setUnseenMessages((prev)=>({...prev, [newMessage.senderId]: prev[newMessage.senderId]? prev[newMessage.senderId] + 1 : 1}));
            }
        })

        socket.on("messagesViewed", ({byUser}) => {
            setAllMessages((prev)=>
                prev.map((msg)=>
                    msg.receiverId.toString() === byUser.toString() ? {...msg, isViewed: true} : msg
                )
            );
        })

        socket.on("messageDeleted", ({messageId, lastMessages})=>{
            setAllMessages((prev)=>prev.filter((msg)=>msg._id !== messageId));
            setLastMessages((prev)=>({
                ...prev,
                ...Object.fromEntries(
                    Object.entries(lastMessages).map(([userId,msg]) => [userId.toString(), msg])
                )
            }));
        })
    }

    const unsubscribeFromMessages = () => {
        if(socket){
        socket.off("newMessage");
        socket.off("messagesViewed");
        socket.off("messageDeleted");
        }
    }

    useEffect(() => {
        subscribeToMessages();
        return () => {
            unsubscribeFromMessages();
        }
    }, [socket, selectedUser]);

    const getUsers = async() => {
        try {
            const response = await axios.get("/api/messages/users");
            if(response.data.success){
                setUsers(response.data.users);
                setUnseenMessages(response.data.unseenMessages);
                setLastMessages(response.data.lastMessages);
            }
        }
        catch(error){
            toast.error(error.response?.data?.message || error.message);
        }
    }


    const value = {
        allMessages,
        users,
        selectedUser,
        unseenMessages,
        getMessages,
        sendMessage,
        getUsers,
        setSelectedUser,
        setAllMessages,
        setUnseenMessages,
        lastMessages,
        markMessagesSeen,
        deleteSingleMessage,
        selectedImageMessage,
        isImageModalOpen,
        openImageModal,
        closeImageModal
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}

