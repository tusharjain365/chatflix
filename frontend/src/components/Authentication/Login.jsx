import { VStack,FormControl,FormLabel,Input, InputGroup, Button, InputRightElement } from "@chakra-ui/react"
import { useState } from "react"
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { useToast } from '@chakra-ui/react'

const Login = ()=>{
    const [show,setShow]=useState(false);
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    const [loading,setLoading]=useState();
    const toast = useToast();
    const history = useHistory();

    const handle = ()=> {
        setShow(!show);
    }
    const submitHandler= async ()=>{
        setLoading(true);
        
        if(!email || !password) {
            toast({
                title: 'Fill all the details bud',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);
            return;
        }
        try {
            const {data} = await axios.post("/api/user/login",{email,password});
            toast({
                title: 'you are recognized as a member of chat app!',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);
            localStorage.setItem("userInfo",JSON.stringify(data));
            history.push("/verify");

        } catch (error) {
            toast({
                title: 'Error occured',
                description:error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
              });
              setLoading(false);
              return;
        }
    }
    return (
       <VStack>
        <FormControl isRequired >
                <FormLabel htmlFor='email' >Email address</FormLabel>
                <Input id='email'placeholder="Please type your email here.." type='email'onChange={(e)=> setEmail(e.target.value)} />
            </FormControl>
            <FormControl isRequired >
                <FormLabel htmlFor='pass' >Password</FormLabel>
                <InputGroup>
                    <Input id='pass'placeholder="Please type your secret here.." type={show ? "text" : 'password'} onChange={(e)=> setPassword(e.target.value)} />
                    <InputRightElement width={"4.5rem"}>
                        <Button h="1.6rem"  size={"sm"} onClick={handle}>
                            {
                                show ? "Hide" : "Show"
                            }
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button color={'white'} style={{backgroundColor:'#1C67D2'}} width="100%" onClick={submitHandler} isLoading={loading}>
                Login
            </Button>
       </VStack>
    )
}
export default Login