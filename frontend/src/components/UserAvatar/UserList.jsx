import { Avatar, Box, Text } from "@chakra-ui/react";

const UserList = ({user,handleFunction})=>{
    return (
        <Box onClick={handleFunction} bg={"gray.100"}borderRadius="8px"display={"flex"}alignItems="center"cursor={"pointer"} width="100%"px={3}py={2}mb={2}_hover={{bg:"messenger.400", transition:"all .2s ease-in",color:"white"}}>
            <Avatar name={user.name} src={user.pic} size="sm" cursor={"pointer"}mr={2}/>
            <Box>
                <Text>{user.name}</Text>
                <Text fontSize={"xs"}><em>{user.email}</em></Text>
            </Box>
        </Box>
    )
}
export default UserList;