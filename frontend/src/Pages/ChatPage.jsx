import { ChatState } from '../context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/misc/SideDrawer';
import MyChats from '../components/misc/MyChats';
import ChatBox from '../components/misc/ChatBox';
import { useState } from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const ChatPage = ()=>{
    const{user} = ChatState();
    const [fetchAgain,setFetchAgain] = useState(true);
    const history = useHistory();
    useEffect(()=>{
        if(!user)history.push("/");
    })
    return (
        <div style={{width:"100%"}}>
            {user && <SideDrawer/>}
            <Box display={"flex"} justifyContent="space-between"  height="91.5vh" width={"100%"} padding="10px">
                {user && <MyChats fetchAgain={fetchAgain}/>}
                {user &&<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>  
    )
}
export default ChatPage;