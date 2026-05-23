import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"

const MainLayout = () => {
    return (
        <div className="bg-[#202022] w-full h-screen flex flex-row items-center">
            <Sidebar/>
            <Outlet/>
        </div>
    )
}

export default MainLayout