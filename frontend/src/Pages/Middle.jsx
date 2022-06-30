import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";

const Middle = ()=>{
    const history = useHistory();
    const {user,setUser} = ChatState();
    useEffect(()=>{
        setUser(JSON.parse(localStorage.getItem("userInfo")));
        if(!user)history.push("/");
        else history.push("/chats");
    })
    return (
        <h1>MIddle part</h1>
    )
}
export default Middle;