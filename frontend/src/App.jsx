import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom"
import Chat from "./pages/Chat"
import Login from "./pages/Login"
import Register from "./pages/Register"
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";
import Profile from "./pages/Profile";
import { Loader } from "lucide-react";
import Groups from "./pages/Groups";

const App = () => {
  const {authUser, isCheckingAuth} = useContext(AuthContext);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-center"/>
      <Routes>
        <Route element={<AuthLayout/>}>
          <Route path="/login" element={!authUser ? <Login/> : <Navigate to="/"/>}/>
          <Route path="/register" element={!authUser ? <Register/> : <Navigate to="/"/>}/>
        </Route>
        <Route path="/" element={<MainLayout/>}>
          <Route index element={authUser ? <Chat/> : <Navigate to="/login"/>}/>
          <Route path="profile" element={authUser ? <Profile/> : <Navigate to="/login"/>}/>
          <Route path="groups" element={authUser ? <Groups/> : <Navigate to="/login"/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App