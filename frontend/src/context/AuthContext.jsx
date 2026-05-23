import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["token"] = token;
    }
    return config;
});

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const checkAuthUser = async() => {
        if(token){
            try {
                const {data} = await axios.get("/api/auth/check-auth");
                if(data.success){
                    setAuthUser(data.user);
                    connectSocket(data.user);
                }
            }catch (error) {
                setAuthUser(null);
                console.log(error);
            } finally {
                setIsCheckingAuth(false);
            }
        } else {
            setIsCheckingAuth(false);
        }
    }

    const login = async (credentials) => {
        try{
            const response = await axios.post("/api/auth/login", credentials);
            if(response.data.success){
                localStorage.setItem("token", response.data.token);
                setToken(response.data.token);
                setAuthUser(response.data.user);
                connectSocket(response.data.user);
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

    const register = async (credentials) => {
        try{
            const response = await axios.post("/api/auth/signup", credentials);
            if(response.data.success){
                localStorage.setItem("token", response.data.token);
                setToken(response.data.token);
                setAuthUser(response.data.user);
                connectSocket(response.data.user);
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

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        toast.success("Logged out successfully");
        socket?.disconnect();
        setSocket(null);
    }

    const updateUserProfile = async(formData) => {
        try{
            const response = await axios.put("/api/auth/update-profile", formData);
            if(response.data.success){
                setAuthUser(response.data.user);
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

    const connectSocket = (userData) =>{
        if(!userData || socket?.connected) return;

        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            }
        });

        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        });
    }

    useEffect(() => {
   if(token){
      checkAuthUser();
   } else {
      setIsCheckingAuth(false);
   }
    }, [token]);

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        register,
        logout,
        updateUserProfile,
        isCheckingAuth
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
