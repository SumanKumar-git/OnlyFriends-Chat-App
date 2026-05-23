import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { ChatContextProvider } from './context/ChatContext.jsx'
import { GroupChatContextProvider } from './context/GroupChatContext.jsx'
import { CallContextProvider } from './context/CallContext.jsx'

createRoot(document.getElementById('root')).render(
        <AuthContextProvider>
            <CallContextProvider>
                <ChatContextProvider>
                    <GroupChatContextProvider>
                        <App />
                    </GroupChatContextProvider>
                </ChatContextProvider>
            </CallContextProvider>
        </AuthContextProvider>
    ,
)
