import { Box, Button, FormControl, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { getSender, getSenderUser } from "../config/chatFunctions";
import { ChatState } from "../context/ChatProvider";
import GroupInfo from "./misc/GroupInfo";
import UserProfile from "./misc/UserProfile";
import ScrollableChat from "./ScrollableChat";
import './style.css';
import io from 'socket.io-client';
import TypingAnimation from "../Animation/TypingAnimation";

const ENDPOINT = 'https://tj-chatflix.herokuapp.com/';
let socket,selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain})=>{
    const {user,selectedChat,setSelectedChat,notification,setNotification} = ChatState();
    const [loading ,setLoading] = useState(false);
    const [newMessage,setNewMessage] = useState('');
    const [allMessages,setAllMessages] = useState([]);
    const Toast = useToast();
    const [typing,setTyping]= useState(false);
    const [isTyping,setIsTyping]= useState(false);
    const [socketConnected, setSocketConnected]=useState(false)

    const fetchAllMessages = async()=>{
        if(!selectedChat)return;
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }
            const {data}=await axios.get(`/api/message/${selectedChat._id}`,config);
            setAllMessages(data);
            setLoading(false);
            socket.emit('join chat',selectedChat._id);
            
        } catch (error) {
            setLoading(false);
            Toast({
                title: 'Error Occured!',
                description:error.response.data.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
    }
    const sendMessage = async (e)=>{
        if(e.key === "Enter" && newMessage) {
            socket.emit('stop typing',selectedChat._id);
            try {
                const config = {
                    headers: {
                        'Content-Type':'application/json',
                        Authorization: `Bearer ${user.token}`,
                    }
                }
                setNewMessage("");
                const {data}=await axios.post('/api/message',{
                    chatId:selectedChat._id,
                    content:newMessage,
                },config);
                socket.emit('new message',data)
                setAllMessages([...allMessages,data]);
            } catch (error) {
                Toast({
                    title: 'Error Occured!',
                    description:error.response.data.message,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            }
        }
    }

    
    useEffect(()=>{
        socket= io(ENDPOINT);
        socket.emit('setup',user);
        socket.on('connected',()=> setSocketConnected(true))
        socket.on('typing',()=> setIsTyping(true));
        socket.on('stop typing',()=> setIsTyping(false));
    },[]);
    
    useEffect(()=>{
        fetchAllMessages();
        selectedChatCompare=selectedChat;
    },[selectedChat]);
    useEffect(()=>{
        socket.on('message received',(message)=>{
            if(!selectedChatCompare || selectedChatCompare._id !== message.chat._id) {
                if(!notification.includes(message)) {
                    setNotification([message,...notification]);
                    setFetchAgain(!fetchAgain);
                }
            }else {
                setAllMessages([...allMessages, message]);
            }
        })
    })
    const typingHandler = (e)=>{
        setNewMessage(e.target.value);
        if(!socketConnected)return ;
        if(!typing) {
            setTyping(true);
            socket.emit('typing',selectedChat._id);
        }
        let timer = 3000;
        let lastTime = new Date().getTime();
        setTimeout(() => {
            let curTime = new Date().getTime();
            let timeDiff = curTime-lastTime;
            if(timeDiff>=timer && typing) {
                socket.emit('stop typing',selectedChat._id);
                setTyping(false);
            }
        }, timer);
    }

    return (
        <>
        {selectedChat? (<>
            <Text fontSize={{base:"25px",md:"30px"}} pb={2} px={2} width="100%"display={"flex"}justifyContent={{base:"space-between"}}alignItems='center'>
                <Button rightIcon={<i className="fas fa-arrow-left"></i>} size="sm" iconSpacing={0} display={{base:'flex',md:"none"}} onClick={()=>setSelectedChat("")}></Button>
                {!selectedChat.isGroupChat? (<>
                {getSender(user,selectedChat.users)}
                <UserProfile user={getSenderUser(user,selectedChat.users)}/>
                </>):(<>
                {selectedChat.chatName}
                <GroupInfo fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchAllMessages={fetchAllMessages}/>
                </>)}
            </Text>
            <Box display={"flex"}justifyContent="flex-end"flexDir={"column"}borderRadius="8px"overflowY={"hidden"}width="100%"height={"100%"}bg="#25395C">
                {loading ? (
                    <Spinner size={'xl'}alignSelf="center" margin={"auto"}color="white"/>
                ): (
                    <div className="messages">
                        <ScrollableChat messages={allMessages} />
                    </div>
                )}
                <FormControl isRequired mt={3}onKeyDown={sendMessage}>
                    {isTyping ? (
                        <TypingAnimation/>) : (<></>)}
                    <Input placeholder="Enter a message.." onChange={typingHandler} value = {newMessage} bg="#25395C"color={'white'}/>
                </FormControl>
            </Box>
        </>): (
            <Box display={"flex"}justifyContent="center"alignItems={"center"}h="100%">
                <Text fontSize={"3xl"} pb={3}>Select Chat to start Chatting</Text>
            </Box>
        )}
        </>
    )
}
export default SingleChat;