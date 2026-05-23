import { Mail, User, Info, PencilLine, Loader} from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const Profile = () => {
    const { authUser, updateUserProfile } = useContext(AuthContext);
    const [fullName, setFullName] = useState(authUser?.fullName);
    const [bio, setBio] = useState(authUser?.bio);
    const [editName, setEditName] = useState(false);
    const [editBio, setEditBio] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async () => {
        try{
            const formData = new FormData();
            formData.append("fullName", fullName);
            formData.append("bio", bio);
            await updateUserProfile(formData);
        }catch(error){
            console.log(error.message);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleUpdateProfile();
        setEditName(false);
        setEditBio(false);
    }

    const handleProfilePhotoSelect = async (e) => {
        const file = e.target.files[0];
        if(!file){
            return;
        }
        if(!file.type.startsWith("image/")){
            toast.error("Please select an image file");
            return;
        }
        try{
            setLoading(true);
            const fromData = new FormData();
            fromData.append("profilePhoto", file);
            await updateUserProfile(fromData);
        }catch(error){
            toast.error(error.message);
        }finally{
            setLoading(false);
        }
    }

    const initials = authUser?.fullName?.split(' ').map((word) => word[0]).join('').toUpperCase();


    return (
    <div className="w-[92%] h-screen py-4 pr-4">
        <div className="w-full h-full bg-[#f9fafc] rounded-4xl overflow-hidden flex flex-col">
            {/* Heading Section */}
            <div className="w-full h-[10%] flex items-center border-b border-gray-200 px-8">
                <h1 className="font-bold text-2xl text-gray-800">Profile Settings</h1>
            </div>
            {/* Main section */}
            <div className="w-full h-[90%] flex justify-center flex-row gap-12 overflow-y-auto">
                {/* Left side for profile picture and upload */}
                <div className="flex flex-col items-center gap-4 w-[35%] pt-5">
                    <div className="relative group">
                        <div className="bg-[#202022] w-48 h-48 rounded-3xl flex items-center justify-center shadow-md transition-all duration-300 group-hover:shadow-lg">
                            {
                                authUser?.profilePhoto ? (
                                    <img src={authUser?.profilePhoto} alt="Profile Photo" className="w-full h-full object-cover rounded-3xl" />
                                ) : (
                                    <h3 className="text-white font-bold text-5xl tracking-wider">{initials}</h3>
                                )
                            }
                            {
                                loading && (
                                    <div className="absolute inset-0 bg-[#202022]/55 w-full h-full rounded-3xl flex items-center justify-center">
                                        <Loader strokeWidth={2} color="white" size={24} className="animate-spin"/>
                                    </div>
                                )
                            }
                        </div>
                        <label htmlFor="profilePhoto">
                        <div className="absolute -bottom-3 -right-3 bg-[#7678ed] p-3 rounded-full border-4 border-[#f9fafc] shadow-sm group-hover:bg-[#6567d1] transition-colors cursor-pointer">
                                <input type="file" name="profilePhoto" id="profilePhoto" className="cursor-pointer hidden" accept="image/*" onChange={handleProfilePhotoSelect} />
                                <PencilLine className="text-white w-5 h-5" strokeWidth={2} />
                        </div>
                        </label>
                    </div>
                    <div className="text-center mt-2 flex flex-col gap-1">
                        <h2 className="font-semibold text-xl text-gray-800">Profile Photo</h2>
                        <p className="text-sm text-gray-500">JPG, PNG. Max size of 2MB.</p>
                    </div>
                </div>
                {/* Right side for profile details */}
                <div className="flex flex-col gap-6 w-[50%] pt-4">
                    {/* Name Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-500 flex items-center gap-2 uppercase tracking-wide">
                            <User size={16} className="text-[#7678ed]" /> Full Name
                        </label>
                        {
                            !editName ? (
                                <div className="w-full bg-[#EEEDFF] rounded-xl px-5 py-4 border-2 border-transparent hover:border-[#DCDCFE] transition-colors flex justify-between items-center group">
                            <span className="text-gray-800 font-medium text-lg">{fullName}</span>
                            <PencilLine onClick={() => setEditName(true)} size={20} className="text-gray-400 group-hover:text-[#7678ed] cursor-pointer transition-colors" />
                        </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex w-full gap-3">
                            <div className="w-[85%] bg-[#EEEDFF] rounded-xl px-5 py-4 border-2 border-transparent hover:border-[#DCDCFE] transition-colors flex justify-between items-center group">
                            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className=" outline-none w-full text-gray-800 font-medium text-lg"/>
                            </div>
                            <button type="submit" className="bg-[#7678ed] w-[15%] rounded-xl px-4 py-2 text-white font-medium  cursor-pointer hover:bg-[#5f61cb] transition-colors shadow-md">Save</button>
                        </form>
                            )
                        }
                    </div>

                    {/* Email Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-500 flex items-center gap-2 uppercase tracking-wide">
                            <Mail size={16} className="text-[#7678ed]" /> Email Address
                        </label>
                        <div className="w-full bg-gray-100 rounded-xl px-5 py-4 border-2 border-transparent flex justify-between items-center opacity-70">
                            <span className="text-gray-800 font-medium text-lg">{authUser?.email}</span>
                        </div>
                        <p className="text-xs text-gray-400 font-medium ml-1">Email address cannot be changed.</p>
                    </div>

                    {/* About Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-500 flex items-center gap-2 uppercase tracking-wide">
                            <Info size={16} className="text-[#7678ed]" /> About
                        </label>
                        {
                            !editBio ? (
                                <div className="w-full bg-[#EEEDFF] rounded-xl px-5 py-4 border-2 border-transparent hover:border-[#DCDCFE] transition-colors flex justify-between items-start group">
                            <p className="text-gray-800 font-medium text-base leading-relaxed w-[90%]">
                                {bio || "Hey there! I am using this chat application."}
                            </p>
                            <PencilLine onClick={() => setEditBio(true)} size={20} className="text-gray-400 group-hover:text-[#7678ed] cursor-pointer transition-colors mt-0.5" />
                        </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex w-full gap-3">
                            <div className="w-[85%] bg-[#EEEDFF] rounded-xl px-5 py-4 border-2 border-transparent hover:border-[#DCDCFE] transition-colors flex justify-between items-center group">
                            <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} className=" outline-none w-full text-gray-800 font-medium text-base"/>
                            </div>
                            <button type="submit" className="bg-[#7678ed] w-[15%] rounded-xl px-4 py-2 text-white font-medium  cursor-pointer hover:bg-[#5f61cb] transition-colors shadow-md">Save</button>
                        </form>
                            )
                        }
                    </div>

                </div>
            </div>
        </div>
    </div>
  )
}

export default Profile