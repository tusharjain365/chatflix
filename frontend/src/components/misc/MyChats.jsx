import { Box, Button, Divider, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../../config/chatFunctions";
import { ChatState } from "../../context/ChatProvider";
import GroupChatModal from "./GroupChatModal";
import LoadingChat from "./LoadingChat";

const MyChats = ({fetchAgain})=>{
    //fetch all the chats and set chats global state in provider
    const {user,chats,setChats,selectedChat,setSelectedChat} = ChatState();
    const [loggedUser,setLoggedUser] = useState();
    const [loading ,setLoading] = useState(true);
    const toast = useToast();
    const fetchChat = async ()=>{
        try {
            setLoading(true);
            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data} = await axios.get('/api/chat',config);
            setLoading(false);
            setChats(data);
            // console.log(data);
        } catch (error) {
            setLoading(false);
            toast({
                title: 'Error occured.',
                description: "Failed to load all chats.",
                status: 'error',
                duration: 9000,
                isClosable: true,
              })
        }
    }
    useEffect(()=>{
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        
        fetchChat();
        // console.log(selectedChat);
    },[fetchAgain])

    return (
        <Box display={{base:selectedChat ? "none":"flex", md:"flex"}} alignItems="center"flexDir={"column"}p={3} width={{base:'100%',md:"30%"}}bg="white"borderRadius={"8px"}>
            <Box display={"flex"}width="100%"justifyContent={"space-between"}alignItems="center"p={3}fontSize={{base:"20px",md:"25px"}}>
                My Chats
                <GroupChatModal>
                    <Button display={"flex"} fontSize={{base:"17px",md:"10px",lg:"17px"}}size={{base:"sm",md:"md"}} _hover={{bg:"#01B0D3",transition:".2s all ease-in",color:"white"}}>Create Chat</Button>
                </GroupChatModal>
            </Box>
            <Divider/>
            <Box paddingTop={"5px"} display={"flex"}flexDir="column"alignItems={"center"} width="100%"height={"100%"}overflowY="hidden">
                {loading?(<LoadingChat/>):(
                    <Stack overflowY={"auto"}height="100%"width={"100%"}paddingRight="10px">
                        {chats?.map((chat)=> (
                            <Box key={chat._id}borderRadius="8px"bg={selectedChat===chat?"#01B0D3":"#E8E8E8"}color={selectedChat === chat?"white":"black"}px={3}py={2} onClick={()=>setSelectedChat(chat)}cursor="pointer">
                                <Text>{!chat.isGroupChat ? getSender(loggedUser,chat.users) : chat.chatName}</Text>
                            </Box>
                        ))}
                    </Stack>
                )}
            </Box>
        </Box>
    )
}
export default MyChats;