import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import {createContext} from 'react';
import { useHistory } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({children})=>{
    // can add timeout to roll some time in recognizing the user from localstorage
    const [user,setUser] = useState();
    const [selectedChat,setSelectedChat] = useState();
    const [chats,setChats] = useState();
    const [notification,setNotification] = useState([]);

   const history = useHistory();

    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        if(userInfo === undefined) {
            history.push("/");
        }
    },[history])
    return (
        <ChatContext.Provider value={{user,setUser,selectedChat,setSelectedChat,chats,setChats,notification,setNotification}}>
            {children}
        </ChatContext.Provider>
    )
}

export const ChatState =()=>{
    return useContext(ChatContext);
}

export default ChatProvider;