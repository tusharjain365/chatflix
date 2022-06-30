import { Box } from '@chakra-ui/react';
import { ChatState } from '../../context/ChatProvider';
import SingleChat from '../SingleChat';

const ChatBox = ({fetchAgain,setFetchAgain})=>{
    const {selectedChat} = ChatState();
    return (
        <Box display={{base:selectedChat?"flex":"none",md:"flex"}} bg="white"width={{base:"100%",md:"69%"}}borderRadius="8px"p={3}flexDir="column"alignItems={"center"}>
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    )
}
export default ChatBox