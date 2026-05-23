import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const GroupChatContext = createContext()

export const GroupChatContextProvider = ({children}) => {

    const {socket, axios, authUser} = useContext(AuthContext);
    const [allUsers, setAllUsers] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const [groupIcon, setGroupIcon] = useState(null);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [allGroups, setAllGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedGroupTab, setSelectedGroupTab] = useState("my-groups");
    const [groupMessages, setGroupMessages] = useState([]);
    const [lastMessages, setLastMessages] = useState({});
    const [unseenMessages, setUnseenMessages] = useState({});
    const [modalType, setModalType] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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


    //function to get all the users
    const getUsersForGroup = async () => {
        try{
            const response = await axios.get("/api/group-messages/all-users")
            setAllUsers(response.data.users);

        }
        catch(error){
            console.log("Error fetching users for group:",error.message);
        }
    }

    //function to create a group
    const createGroup = async (formData) => {
        try{
            const response = await axios.post("/api/groups/create", formData)
            toast.success(response.data.message);
        }
        catch(error){
            toast.error(error.response?.data?.message || error.message);
        }
    }

    //function to get all the groups
    const getAllGroup = async () => {
        try{
            const response = await axios.get("/api/groups/get-groups");
            setAllGroups(response.data.groups);
        }
        catch(error){
            console.log("Error fetching groups:",error.message);
        }
    }

    //function to get all the groups, last message and unseen-messages count of group the user is a member of
    const getUserGroups = async () => {
        try{
            const response = await axios.get("/api/groups/my-groups");
            setAllGroups(response.data.groups);
            setLastMessages(response.data.lastMessages);
            setUnseenMessages(response.data.unseenMessages);
        }
        catch(error){
            console.log("Error fetching user groups:",error.message);
        }
    }

    //function to get all the messages of a group chat
    const getGroupMessages = async (groupId) => {
        try{
            const response = await axios.get(`/api/group-messages/${groupId}`);
            setGroupMessages(response.data.allMessages);
        }
        catch(error){
            console.log("Error fetching group messages:",error.message);
        }
    }


    //function to send a message in group chat
    const sendGroupMessage = async({groupId, formData, tempId}) => {
        try {
            const response = await axios.post(`/api/group-messages/send/${groupId}`, formData);
            if(response.data.success){
                const newMessage = response.data.groupMessage;
                setGroupMessages((prev) =>
                    prev.map((msg) =>
                        msg._id === tempId ? newMessage : msg
                    )
                );
                setLastMessages((prev)=>({...prev, [groupId]: newMessage}));
            }
            else{
                toast.error(response.data.message);
                if (tempId) {
                    setGroupMessages((prev) => prev.filter((msg) => msg._id !== tempId));
                }
            }
        }
        catch(error){
            toast.error(error.response?.data?.error || error.message);
            if(tempId) {
                setGroupMessages((prev) => prev.filter((msg) => msg._id !== tempId));
            }
        }
    }

    //function to delete a message in group message
    const deleteGroupMessage = async (messageId) => {
        try {
            const response = await axios.delete(`/api/group-messages/delete/${messageId}`);
            if(response.data.success){
                setGroupMessages((prev)=>prev.filter((msg)=>msg._id !== messageId));
                toast.success(response.data.message);
            }
            else{
                toast.error(response.data.message);
            }
        }
        catch(error){
            toast.error(error.response?.data?.message || error.message);
        }
    };

    //function to clear group messages
    const clearGroupMessages = async (groupId) => {
        try {
            const response = await axios.delete(`/api/group-messages/clear-messages/${groupId}`);
            if(response.data.success){
                setGroupMessages([]);
                toast.success(response.data.message);
            }
            else{
                toast.error(response.data.message);
            }
        }
        catch(error){
            toast.error(error.response?.data?.message || error.message);
        }
    }

    //function to update group
    const updateGroup = async (groupId, formData) => {
        try {
            const response = await axios.patch(`/api/groups/update/${groupId}`, formData);
            if(response.data.success){
                setAllGroups((prev)=>prev.map((group)=>group._id === groupId ? response.data.group : group));
                if(selectedGroup?._id === response.data.group._id){
                    setSelectedGroup(response.data.group);
                }
                toast.success(response.data.message);
            }
            else{
                toast.error(response.data.message);
            }
        }
        catch(error){
            toast.error(error.response?.data?.message || error.message);
        }
    }

    //function to add member in group
    const addMembersToGroup = async (groupId, members) => {
        try {
            const response = await axios.patch(`/api/groups/add-member/${groupId}`, members);
            if(response.data.success){
                setAllGroups((prev)=>prev.map((group)=>group._id === groupId ? response.data.group : group));
                setSelectedGroup((prev) => ({...prev, groupMembers: response.data.group.groupMembers}));
                toast.success(response.data.message);
            }
            else{
                toast.error(response.data.message);
            }
        }
        catch(error){
            toast.error(error.response?.data?.message || error.message);
        }
    }

    //function to remove member from group
    const removeMembersFromGroup = async (groupId, members) => {
        try {
            const response = await axios.patch(`/api/groups/remove-member/${groupId}`, members);
            if(response.data.success){
                setAllGroups((prev)=>prev.map((group)=>group._id === groupId ? response.data.group : group));
                setSelectedGroup((prev) => ({...prev, groupMembers: response.data.group.groupMembers}));
                toast.success(response.data.message);
            }
            else{
                toast.error(response.data.message);
            }
        }
        catch(error){
            toast.error(error.response?.data?.message || error.message);
        }
    }

    //function to join group
    const joinGroup = async (groupId) => {
        try {
            const response = await axios.patch(`/api/groups/join/${groupId}`);
            if(response.data.success){
                setAllGroups((prev)=>prev.map((group)=>group._id === groupId ? response.data.group : group));
                setSelectedGroup((prev) => ({...prev, groupMembers: response.data.group.groupMembers}));
                toast.success(response.data.message);
            }
            else{
                toast.error(response.data.message);
            }
        }
        catch(error){
            toast.error(error.response?.data?.message || error.message);
        }
    }

    //function to leave a group
    const leaveGroup = async (groupId) => {
        try {
            const response = await axios.patch(`/api/groups/leave/${groupId}`);
            if(response.data.success){
                setAllGroups((prev)=>prev.map((group)=>group._id === groupId ? response.data.group : group));
                setSelectedGroup((prev) => ({...prev, groupMembers: response.data.group.groupMembers}));
                toast.success(response.data.message);
            }
            else{
                toast.error(response.data.message);
            }
        }
        catch(error){
            toast.error(error.response?.data?.message || error.message);
        }
    }

    //function to mark all group messages as seen
    const markGroupMessagesSeen = async (groupId) => {
        try{
            const id = groupId || selectedGroup?._id;
            if(!id) return;
            await axios.patch(`/api/group-messages/mark-seen/${id}`);
        }
        catch(error){
            console.log(error);
        }
    }

    const subscribeToMessages = () => {
            if(!socket) return;

            socket.on("receiveGroupMessage", (newMessage) => {

                if(authUser && newMessage.senderId._id.toString() === authUser._id.toString()) return;

                setLastMessages((prev)=>({...prev, [newMessage.groupId.toString()]: newMessage}));

                if(selectedGroup && newMessage.groupId.toString() === selectedGroup._id.toString()){
                    newMessage.isViewed = true;
                    setGroupMessages((prev)=>[...prev, newMessage]);
                    markGroupMessagesSeen(selectedGroup._id);
                }
                else{
                    setUnseenMessages((prev)=>({...prev, [newMessage.groupId]: prev[newMessage.groupId]? prev[newMessage.groupId] + 1 : 1}));
                }
            })

            socket.on("groupCreated",({sysMsg,group}) => {
                socket.emit("joinGroup", group._id);
                setAllGroups((prev) => {
                    const exists = prev.some(
                        (g) => g._id.toString() === group._id.toString()
                    );
                    if(exists) return prev;
                    return [...prev, group];
                });
                setLastMessages((prev)=>({...prev, [group._id.toString()]: sysMsg}));
            })

            socket.on("markGroupMessageSeen", ({updatedMessageIds, groupId}) => {
                if (!selectedGroup) return;
                if(groupId.toString() !== selectedGroup._id.toString()) return;
                setGroupMessages((prev) =>
                    prev.map((msg) =>{
                        const isUpdated = updatedMessageIds?.some((id) => id.toString() === msg._id.toString());

                        return isUpdated
                            ? { ...msg, isViewed: true }
                            : msg;
                    })
                );
            })

            socket.on("deleteGroupMessage", ({messageId, groupId, lastMessage})=>{
                setLastMessages((prev)=>({...prev, [groupId.toString()]: lastMessage}));
                if (selectedGroup && groupId.toString() === selectedGroup._id.toString()){
                    setGroupMessages((prev)=>prev.filter((msg)=>msg._id !== messageId));
                }
            })

            socket.on("clearGroupChat", ({groupId, groupMessages, sysMsg}) => {
                setLastMessages((prev)=>({...prev, [groupId]: sysMsg}));
                if (selectedGroup && groupId.toString() === selectedGroup._id.toString()){
                    setGroupMessages(groupMessages);
                }
            })

            socket.on("groupUpdated", ({group, sysMsg, groupId}) => {
                setAllGroups((prev)=>prev.map((grp)=>grp._id === group._id ? {...grp, ...group} : grp));
                setLastMessages((prev)=>({...prev, [groupId]: sysMsg}));
                if (selectedGroup && groupId.toString() === selectedGroup._id.toString()){
                    setSelectedGroup((prev) => ({...prev, ...group}));
                    setGroupMessages((prev)=>[...prev, sysMsg]);
                }
            })

            socket.on("userJoinedGroup", ({groupId, groupMembers, sysMsg}) => {
                socket.emit("joinGroup", groupId);
                setLastMessages((prev)=>({...prev, [groupId]: sysMsg}));
                if (selectedGroup && groupId.toString() === selectedGroup._id.toString()){
                    setSelectedGroup((prev) => (prev ? {...prev, groupMembers} : prev));
                    setGroupMessages((prev)=>[...prev, sysMsg]);
                }
            })

            socket.on("userLeftGroup", ({groupId, memberLeft, groupMembers, sysMsg}) => {
                if(memberLeft._id.toString() === authUser._id.toString()){
                    socket.emit("leaveGroup", groupId);
                    setAllGroups((prev)=>prev.filter((grp)=>grp._id.toString() !== groupId.toString()));
                    return;
                }
                setSelectedGroup((prev) => (prev ? {...prev, groupMembers} : prev));
                setLastMessages((prev)=>({...prev, [groupId]: sysMsg}));
                if (selectedGroup && groupId.toString() === selectedGroup._id.toString()){
                    setGroupMessages((prev)=>[...prev, sysMsg]);
                }})

            socket.on("groupMemberAdded", ({group, groupMembers, sysMsg}) => {
                socket.emit("joinGroup", group._id);
                setAllGroups((prev) => {
                    const exists = prev.some(
                        (g) => g._id.toString() === group._id.toString()
                    );
                    if(exists) return prev;
                    return [...prev, group];
                });
                setSelectedGroup((prev) => {
                    if(!prev) return prev;
                    if(prev._id.toString() !== group._id.toString()){
                        return prev;
                    }
                    return {...prev, groupMembers};
                });
                setLastMessages((prev)=>({...prev, [group._id]: sysMsg}));
                if (selectedGroup && group._id.toString() === selectedGroup._id.toString()){
                    setGroupMessages((prev)=>[...prev, sysMsg]);
                }
            })

            socket.on("groupMemberRemoved", ({groupId, memberId, groupMembers, sysMsg}) => {
                const isRemoved = memberId.some(
                    (id) => id.toString() === authUser._id.toString()
                );
                if(isRemoved){
                    socket.emit("leaveGroup", groupId);
                    setAllGroups((prev)=>prev.filter((grp)=>grp._id.toString() !== groupId.toString()));
                    return;
                }
                setSelectedGroup((prev) => (prev ? {...prev, groupMembers} : prev));
                if(sysMsg){
                    setLastMessages((prev)=>({...prev, [groupId]: sysMsg}));
                }
                if (selectedGroup && groupId.toString() === selectedGroup._id.toString()){
                    if(sysMsg){
                        setGroupMessages((prev)=>[...prev, sysMsg]);
                    }
                }
            })
        }

        const unsubscribeFromMessages = () => {
            if(socket){
                socket.off("receiveGroupMessage");
                socket.off("deleteGroupMessage");
                socket.off("clearGroupChat");
                socket.off("groupUpdated");
                socket.off("userJoinedGroup");
                socket.off("userLeftGroup");
                socket.off("groupMemberAdded");
                socket.off("groupMemberRemoved");
                socket.off("groupCreated");
                socket.off("markGroupMessageSeen");
            }
        }

        useEffect(() => {
            subscribeToMessages();
            return () => {
                unsubscribeFromMessages();
            }
        }, [socket, selectedGroup]);



    const value = {
        allUsers,
        groupName,
        allGroups,
        selectedGroup,
        groupDescription,
        selectedMembers,
        groupIcon,
        getUsersForGroup,
        setGroupName,
        setGroupDescription,
        setGroupIcon,
        setSelectedMembers,
        createGroup,
        getAllGroup,
        setSelectedGroup,
        getUserGroups,
        selectedGroupTab,
        setSelectedGroupTab,
        groupMessages,
        setGroupMessages,
        getGroupMessages,
        unseenMessages,
        lastMessages,
        sendGroupMessage,
        deleteGroupMessage,
        setLastMessages,
        setUnseenMessages,
        selectedImageMessage,
        isImageModalOpen,
        openImageModal,
        closeImageModal,
        clearGroupMessages,
        updateGroup,
        addMembersToGroup,
        removeMembersFromGroup,
        joinGroup,
        leaveGroup,
        markGroupMessagesSeen,
        modalType,
        setModalType,
        isModalOpen,
        setIsModalOpen
    }


    return (
        <GroupChatContext.Provider value={value}>
            {children}
        </GroupChatContext.Provider>
    )
}
