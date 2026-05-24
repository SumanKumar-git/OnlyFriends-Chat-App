import { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { EllipsisVertical, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const MobileHeader = () => {
    const { logout } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
    };

    return (
        <div className="w-full h-14 bg-[#1b1b22] border-b border-white/5 flex flex-row justify-between items-center px-4 md:hidden shrink-0 z-40 relative shadow-md">
            {/* Title on the Left */}
            <h1 className="text-white text-xl font-bold tracking-tight select-none">
                OnlyFriends
            </h1>

            {/* Three Dots Button on the Right */}
            <div className="relative" ref={menuRef}>
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                    className="text-white/85 hover:text-white p-2 rounded-lg hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                >
                    <EllipsisVertical className="w-6 h-6" />
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#1e1e24] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                        <Link 
                            to="/profile" 
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-all text-sm font-medium border-b border-white/5"
                        >
                            <User className="w-4 h-4 text-[#7678ed]" />
                            Profile
                        </Link>
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-white/5 transition-all text-sm font-medium text-left cursor-pointer"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileHeader;
