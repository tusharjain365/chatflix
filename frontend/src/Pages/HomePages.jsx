import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import SignUp from '../components/Authentication/SignUp';
import Login from '../components/Authentication/Login';
import {useHistory} from 'react-router-dom';
import { useEffect } from 'react';

const HomePage = () => {
    const history = useHistory();
    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if(userInfo) {
            history.push("/chats");
        }
    })
    return (
        <Container maxW='xl' centerContent>
            <Box display={"flex"} justifyContent="center" p={2} bg={"white"} w="100%" m={"20px 0 15px 0"} borderRadius="8">
                <Text fontSize='2xl'>ChatFlix</Text>
            </Box>
            <Box display={"flex"} justifyContent="center" p={3} bg={"white"} w="100%" borderRadius="8">
                <Tabs width={"100%"} variant='enclosed'>
                    <TabList>
                        <Tab width={"50%"}>Login</Tab>
                        <Tab width={"50%"}>Register</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login/>
                        </TabPanel>
                        <TabPanel>
                            <SignUp/>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}
export default HomePage;