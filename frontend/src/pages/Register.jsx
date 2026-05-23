import {Mail, Lock, Zap, UserRound} from "lucide-react"
import { useContext, useState } from "react";
import { Link } from "react-router"
import { AuthContext } from "../context/AuthContext";

const Register = () => {

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {register} = useContext(AuthContext);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        await register({fullName, email, password});
    }

    return (
    <main className="h-screen w-full flex items-center justify-center">
        {/* Main Container */}
        <div className="w-[70%] h-[85%] shadow-[5px_5px_15px_rgba(0,0,0,0.1)] rounded-4xl flex flex-row justify-center items-center">
            {/* Left Conatiner */}
            <div className="bg-linear-to-r from-[#5859CA] to-[#6e70de] h-full w-[50%] rounded-l-4xl p-10">
                <h1 className="text-2xl font-bold text-white pb-10">OnlyFriends</h1>
                <div className="flex flex-col gap-7">
                    <h2 className="text-4xl/12 text-white">
                        Join the future of conversation.
                    </h2>
                    <p className="text-[#D5DBF5] w-[85%]">
                        Connect with your team, share ideas, and keep the stream moving forward with OnlyFriends.
                    </p>
                <div className="bg-white/20 flex flex-row p-3 gap-3 shadow-[2px_2px_15px_rgba(0,0,0,0.1)] w-[90%] rounded-lg text-white">
                    <div className="flex items-center p-2 bg-white/65 rounded-lg ">
                        <Zap className="text-orange-500"/>
                    </div>
                    <div className="flex flex-col justify-center">
                        <p className="text-sm">Lightning Fast Delivery</p>
                        <p className="text-xs">Messages delivered in under 100ms.</p>
                    </div>
                </div>
                </div>
            </div>
            {/* Right Container */}
            <div className="h-full w-[50%] rounded-r-4xl p-20 flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                    <h2 className="text-2xl font-semibold">Create Account</h2>
                    <p className="text-gray-700">Please fill in the details below to get started.</p>
                </div>
                <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold" htmlFor="fullname">Full Name</label>
                        <div className="flex flex-row items-center bg-[#EDEFF5] p-2.5 gap-3 rounded-xl focus-within:outline-none focus-within:border-gray-300 border-2 border-transparent focus-within:border-2">
                            <UserRound className="text-gray-500" />
                            <input className="outline-none w-full placeholder:text-gray-400" value={fullName} onChange={(e) => setFullName(e.target.value)} type="text" name="fullname" id="fullname" placeholder="John Doe" required/>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold" htmlFor="email">Email Address</label>
                        <div className="flex flex-row items-center bg-[#EDEFF5] p-2.5 gap-3 rounded-xl focus-within:outline-none focus-within:border-gray-300 border-2 border-transparent focus-within:border-2">
                            <Mail className="text-gray-500"/>
                            <input className="outline-none w-full placeholder:text-gray-400 " value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" placeholder="john@doe.com" required/>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold" htmlFor="password">Password</label>
                        <div className="flex flex-row items-center bg-[#EDEFF5] p-2.5 gap-3 rounded-xl focus-within:outline-none focus-within:border-gray-300 border-2 border-transparent focus-within:border-2">
                            <Lock className="text-gray-500"/>
                            <input className="outline-none w-full placeholder:text-gray-400" value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="••••••••" required/>
                        </div>
                    </div>
                    <button className="bg-[#3635aa] cursor-pointer text-white p-2.5 mt-2 text-lg rounded-xl font-semibold">Create Account</button>
                </form>
                <p className="text-center">Already have an account? <Link className="text-[#3635aa] cursor-pointer font-semibold" to="/login">Log In</Link> </p>
            </div>

        </div>
    </main>
    )
}

export default Register