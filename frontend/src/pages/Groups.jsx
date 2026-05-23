import { useContext, useEffect } from "react"
import GroupChatInfo from "../components/GroupChatInfo"
import GroupChatScreen from "../components/GroupChatScreen"
import GroupSidebar from "../components/GroupSidebar"
import { GroupChatContext } from "../context/GroupChatContext"


const Groups = () => {

    const {getAllGroup, getUserGroups, selectedGroupTab} = useContext(GroupChatContext);

    useEffect(() => {
        async function fetchGroups() {
            if(selectedGroupTab === "all-groups"){
                await getAllGroup();
            }else{
                await getUserGroups();
            }
        }
        fetchGroups();
    }, [selectedGroupTab]);

    return (
        <>
            <GroupSidebar />
            <GroupChatScreen />
            <GroupChatInfo />
        </>
    )
}

export default Groups