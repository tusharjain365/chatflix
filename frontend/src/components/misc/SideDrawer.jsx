import {
  Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, MenuItem, Avatar, useDisclosure, Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Input,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { Spinner } from '@chakra-ui/react'
import { ChatState } from "../../context/ChatProvider";
import UserProfile from "./UserProfile";
import { useHistory } from 'react-router-dom';
import { useState } from "react";
import axios from "axios";
import LoadingChat from "./LoadingChat";
import UserList from "../UserAvatar/UserList";
import { getSender } from "../../config/chatFunctions";

const SideDrawer = () => {
  const { user,setSelectedChat,chats,setChats,notification,setNotification } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const history = useHistory();

  const [search, setSearch] = useState();
  const [loading,setLoading] = useState();
  const [chatLoading,setChatLoading] = useState();
  const [searchResult,setSearchResult] = useState([]);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  }

  const searchHandler = async ()=>{
    if(!search) {
      toast({
        title: 'Please enter name of the person you want to search',
        status: 'warning',
        duration: 9000,
        isClosable: true,
        position:'bottom-left'
      })
      return ;
    }
    try {
      setLoading(true);
      // set the headers to authenticate user
      const config = {
        headers: {
          Authorization:`Bearer ${user.token}`,
        }
      }
      const {data} = await axios.get(`/api/user?search=${search}`,config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Some Error occurred!',
        status: 'error',
        duration: 9000,
        isClosable: true,
        position:'bottom-left'  
      })
    }
  }

  const accessChat = async(userId)=>{
    console.log("access chat is clicked");
    try {
      setChatLoading(true);
      const config={
        headers: {
          "Content-type":"application/json",
          Authorization:`Bearer ${user.token}`
        }
      }
      const {data} = await axios.post('/api/chat',{userId}, config);
      // if new chat is created than append it to the global list of all chats
      if(!chats.find(c=> c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setChatLoading(false);
      setSelectedChat(data);
      onClose();
    } catch (error) {
      toast({
        title: 'Chat cannot be created.',
        description:error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
        position:'bottom-left'
      })
      setChatLoading(false);
    }
  }

  return (
    <>
      <Box display={"flex"} justifyContent="space-between" alignItems={"center"} width="100%" borderRadius={"8px"} bg="white" padding={"6px 13px"}>
        <Tooltip hasArrow label="Search users" placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}><i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} padding="10px 5px 10px 7px" >Search user </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"}>ChatFlix</Text>
        <div>
          <Menu>
            <MenuButton fontSize="xl">
              <i className="fas fa-bell" style={{ margin: "0px 5px 0 0" }}></i>
              {notification.length >0 && <Badge colorScheme={'red'} variant='solid'style={{width:'17px', borderRadius:'50%',marginBottom:'6px'}}>{notification.length}</Badge>}
            </MenuButton>
            <MenuList  paddingLeft={2}>
              {!notification.length && 'No New Message'}
              {notification.map(n=>(
                <MenuItem key={n._id} onClick={()=> {
                  setSelectedChat(n.chat);
                  setNotification(notification.filter((notif)=>notif !== n))
                }}>
                  {n.chat.isGroupChat?`New Message from ${n.chat.chatName}`:`New Message from ${getSender(user,n.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<i className="fas fa-chevron-down"></i>}>
              <Avatar size="sm" cursor={"pointer"} name={user.name[0]} src={user.pic}></Avatar>
            </MenuButton>
            <MenuList>
              <UserProfile user={user}>
                <MenuItem>Profile</MenuItem>
              </UserProfile>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Search user</DrawerHeader>

        <DrawerBody>
          <Box display={"flex"} padding={2}>
          <Input placeholder='Type here...'value={search}onChange={(e)=> setSearch(e.target.value)} marginRight="10px"/>
          <Button onClick={searchHandler}>Search</Button>
          </Box>
          {loading ? (<LoadingChat/>) : (
            searchResult?.map(cuser=> (
              <UserList key={cuser._id} user={cuser} handleFunction={()=> accessChat(cuser._id)} />
            ))
          )}
          {chatLoading && <Spinner ml={"auto"} display="flex"/>}
        </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
export default SideDrawer;