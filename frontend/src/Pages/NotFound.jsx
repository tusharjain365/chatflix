import { Box, Button, Image } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";

const NotFound = () => {
    const { user } = ChatState();
    const history = useHistory();
    const redirect = () => {
        if (user) history.push('/chats');
        else history.push('/');
    }

    return (
        <Box width={'100%'} height="90vh" display={'flex'} justifyContent='center' alignItems={'center'} flexDir='column'>
            <Image boxSize='80%'
                objectFit='cover'
                src='https://blog.magezon.com/wp-content/uploads/2021/08/404-Page-Not-Found-Errors.jpg'
                alt='404'mb={3}borderRadius='8px' />
            <Button onClick={redirect} _hover={{bg:"#01B0D3",transition:".2s all ease-in",color:"white"}}>Back to Home page</Button>
        </Box>
    )
}
export default NotFound;