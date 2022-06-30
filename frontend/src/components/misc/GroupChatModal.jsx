import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import UserList from "../UserAvatar/UserList";
import LoadingChat from "./LoadingChat";

const GroupChatModal = ({ children }) => {
    const {user,chats,setChats} = ChatState();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName,setGroupChatName]=useState('');
    const [selectedUsers,setSelectedUsers] = useState([]);
    const [searchResult,setSearchResult] = useState([]);
    const [search,setSearch] = useState();
    const [loading ,setLoading]=useState(false);
    const toast = useToast();

    const handleSearch =async (query)=>{
        setSearch(query);
        if(!query) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization:`Bearer ${user.token}`,
                }
            }
            const {data}= await axios.get(`/api/user?search=${search}`,config);
            setSearchResult(data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast({
                title: 'Error occured',
                description: "User cannot be found",
                status: 'error',
                duration: 9000,
                isClosable: true,
              })
        }
    }

    const handleSubmit =async ()=>{
        if(!groupChatName || !selectedUsers) {
            toast({
                title: 'Please Fill all the details!',
                status: 'error',
                duration: 9000,
                isClosable: true,
              });
              return;
        }
        try {
            const config = {
                headers: {
                    Authorization:`Bearer ${user.token}`,
                }
            }
            const {data} = await axios.post('/api/chat/group',{
                name:groupChatName,
                users:JSON.stringify(selectedUsers.map((u)=>u._id)),
            },config);
            // setSelectedChat(data);
            setChats([data, ...chats]);
            onClose();
            window.location.reload();
            toast({
                title: 'New group chat is created successfully!',
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error occurred!',
                description:error.response.data,
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    }
    const handleGroup = (curUser)=>{
        if(selectedUsers.includes(curUser)) {
            toast({
                title: 'User already included',
                status: 'warning',
                duration: 9000,
                isClosable: true,
              })
              return;
        }
        setSelectedUsers([curUser, ...selectedUsers]);
        // setSearch("");
    }

    const handleDelete = (curUser)=>{
        setSelectedUsers(selectedUsers.filter((cuser)=>cuser._id !== curUser._id ));
    }
    return (<>
        <span onClick={onOpen}>{children}</span>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader display={"flex"} justifyContent="center">Create Group Chat</ModalHeader>
                <ModalCloseButton />
                <ModalBody display={"flex"} flexDir="column" alignItems={"center"}>
                    <FormControl isRequired>
                        <Input mb={3} value = {groupChatName} placeholder='Name of group chat goes here...' onChange={(e)=>setGroupChatName(e.target.value)}/>
                    </FormControl>
                    <FormControl isRequired>
                        <Input  placeholder='Participants name for ex: John,Alexa etc'value={search} onChange={(e)=> handleSearch(e.target.value)}autoComplete="off" />
                    </FormControl>
                    <Box display={"flex"}alignItems="center"padding={'2px'}width="100%">
                    {selectedUsers?.map((user)=>(
                        <Box key={user._id}bg="#38B2AC"color={"white"} padding={"2px 10px"} cursor={"pointer"}mb={2} mt={1} marginRight={2} borderRadius="10px" onClick={()=>handleDelete(user)}>{user.name}</Box>
                        ))}
                    </Box>
                    {loading?(<LoadingChat/>): (
                        searchResult?.slice(0,4).map(user=> (
                            <UserList key={user._id} user={user} handleFunction={()=>handleGroup(user)}/>
                        ))
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme={"messenger"} onClick={handleSubmit}>Create Group</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>
    )
}
export default GroupChatModal;