import { FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack,Button } from "@chakra-ui/react"
import { useState } from "react"
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import {useHistory } from 'react-router-dom';

const SignUp = () => {
    const [show,setShow]=useState(false);
    const [name,setName]=useState();
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    const [confirm,setConfirm]=useState();
    const [pic,setPic]=useState();
    const [loading ,setLoading]=useState();
    const toast = useToast();
    const history = useHistory();

    const handle = ()=> {
        setShow(!show);
    }
    const submitHandler= async ()=>{
        setLoading(true);
        if(!name || !password || !email) {
            toast({
                title: 'Fill all the details bud',
                status: 'error',
                duration: 5000,
                isClosable: true,
              });
              setLoading(false);
              return;
        }
        if(password !== confirm) {
            toast({
                title: 'Password is not matching with confirm password',
                status: 'error',
                duration: 5000,
                isClosable: true,
              });
              setLoading(false);
              return;
        }
        try {
            const {data} = await axios.post("/api/user",{name,email,password,pic});
            toast({
                title: 'You are now a member of chat app!!',
                status: 'success',
                duration: 5000,
                isClosable: true,
              });
              setLoading(false);    
              localStorage.setItem("userInfo",JSON.stringify(data));
              history.push("/verify");
        } catch (error) {
            toast({
                title: 'Some Error occurred',
                description:error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
              });
              setLoading(false);
        }
        
    }
    const picHandler=(picture)=>{
        setLoading(true);
        if(picture === undefined) {
            toast({
                title: 'Please select an image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
              });
              setLoading(false);
              return;
            }
        if(picture.type === "image/jpeg" || picture.type === "image/png") {
            const data = new FormData();
            data.append("file",picture);
            data.append("upload_preset","chat-app");
            data.append("cloud_name","dlzrcuumq");
            fetch("https://api.cloudinary.com/v1_1/dlzrcuumq/image/upload",{
                method:"post",
                body:data,
            }).then((res)=> res.json())
            .then((item) => {
                setPic(item.url.toString());
                setLoading(false);
            })
            .catch(err=> {
                console.log(err);
                setLoading(false);
            })
        }else {
            toast({
                title: 'Please select an valid image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);
        }
    }
    return (
        <VStack spacing={"2"}>
            <FormControl isRequired >
                <FormLabel htmlFor='name' >Name</FormLabel>
                <Input id='name'placeholder="Please type your name here.." type='text' onChange={(e)=> setName(e.target.value)} />
            </FormControl>
            <FormControl isRequired >
                <FormLabel htmlFor='cemail' >Email address</FormLabel>
                <Input id='cemail'placeholder="Please type your email here.." type='email'onChange={(e)=> setEmail(e.target.value)} />
            </FormControl>
            <FormControl isRequired >
                <FormLabel htmlFor='cpass' >Password</FormLabel>
                <InputGroup>
                    <Input id='cpass'placeholder="Please type your secret here.." type={show ? "text" : 'password'} onChange={(e)=> setPassword(e.target.value)} />
                    <InputRightElement width={"4.5rem"}>
                        <Button h="1.6rem"  size={"sm"} onClick={handle}>
                            {
                                show ? "Hide" : "Show"
                            }
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl isRequired >
                <FormLabel htmlFor='conpass' >Confirm Password</FormLabel>
                <InputGroup>
                    <Input id='conpass'placeholder="Please confirm your secret here.." type={show ? "text" : 'password'} onChange={(e)=> setConfirm(e.target.value)} />
                    <InputRightElement width={"4.5rem"}>
                        <Button h="1.6rem"  size={"sm"} onClick={handle}>
                            {
                                show ? "Hide" : "Show"
                            }
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl isRequired >
                <FormLabel htmlFor='pic' >Upload your picture</FormLabel>
                <Input id='pic' p={1.5} placeholder="Please select your profile pic" type='file' accept="image/*" onChange={(e)=> picHandler(e.target.files[0])}/>
            </FormControl>
            <Button color={'white'} style={{backgroundColor:'#1C67D2'}} width="100%" onClick={submitHandler} isLoading={loading} >
                Register
            </Button>
        </VStack>
    )
}
export default SignUp