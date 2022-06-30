import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import UserList from "../UserAvatar/UserList";

const GroupInfo = ({ fetchAgain, setFetchAgain ,fetchAllMessages}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, selectedChat, setSelectedChat } = ChatState();
    const [groupChatName, setGroupChatName] = useState('');
    const [renameLoading, setRenameLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const renameChat = async () => {
        if (!groupChatName) {
            toast({
                title: 'Please enter new name',
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            return;
        }
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }
            const { data } = await axios.put('/api/chat/rename', {
                chatId: selectedChat._id,
                chatName: groupChatName,
            }, config);
            setRenameLoading(false);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            toast({
                title: 'Chat rename successfully',
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
            onClose();
        } catch (error) {
            setRenameLoading(false);
            toast({
                title: 'Error occurred!',
                description: error.response.data.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
        setGroupChatName("");

    }
    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }
            const { data } = await axios.get(`/api/user?search=${search}`, config);
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
    const handleRemove = async (userId) => {
        if (selectedChat.groupAdmin._id !== user._id && userId !== user._id) {
            toast({
                title: 'Only admins can remove from group',
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }
            const { data } = await axios.put('/api/chat/groupremove', {
                chatId: selectedChat._id,
                userId: userId
            }, config);
            userId === user._id ?setSelectedChat(): setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchAllMessages();
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast({
                title: 'Error occurred!',
                description: error.response.data.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
        setGroupChatName("");

    }
    const handleAdd = async (cuser) => {
        console.log(selectedChat);
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'Only admin can add someone',
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            return;
        }
        if (selectedChat.users.find(u => u._id === cuser._id)) {
            toast({
                title: 'User is already in the group',
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }
            const { data } = await axios.put('/api/chat/groupadd', {
                chatId: selectedChat._id,
                userId: cuser._id
            }, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast({
                title: 'Error occurred!',
                description: error.response.data.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
        setGroupChatName("");
    }

    return (
        <>
            <IconButton display={{ base: "flex" }} onClick={onOpen}>
                <i className="fas fa-eye"></i>
            </IconButton>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader display={"flex"} justifyContent="center" alignItems={"center"}>{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box display={"flex"} alignItems="center" padding={'2px'} width="100%">
                            {selectedChat.users.map((u) => (
                                <Box key={u._id} bg="#38B2AC" color={"white"} padding={"2px 10px"} cursor={"pointer"} mb={2} mt={1} marginRight={2} borderRadius="10px" onClick={() => handleRemove(u._id)}>{u.name}</Box>
                            ))}
                        </Box>
                        <FormControl display={"flex"}>
                            <Input placeholder="New Chat name..." value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} mb={3}></Input>
                            <Button colorScheme={"yellow"} onClick={renameChat} ml={2} isLoading={renameLoading}>Rename</Button>
                        </FormControl>
                        <FormControl display={"flex"}>
                            <Input placeholder="Add users to group." onChange={(e) => handleSearch(e.target.value)} mb={3}></Input>
                        </FormControl>
                        {loading ? (
                            <Spinner size={"md"}></Spinner>
                        ) : (
                            searchResult?.map(cuser => (
                                <UserList key={cuser._id} user={cuser} handleFunction={() => handleAdd(cuser)}></UserList>
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={0} onClick={() => handleRemove(user._id)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
export default GroupInfo;