import { useDisclosure } from "@chakra-ui/hooks"
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react"

const UserProfile = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            {children ? (<span onClick={onOpen}>{children}</span>) : (
                <IconButton display={{ base: "flex" }} onClick={onOpen}>
                    <i className="fas fa-eye"></i>
                </IconButton>
            )}
            <Modal
                isCentered
                onClose={onClose}
                isOpen={isOpen}
                motionPreset='slideInBottom'
                size={"md"}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader display={"flex"}justifyContent="center"fontSize={"30px"}>{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={"flex"} justifyContent="space-between" alignItems={"center"} flexDir="column">
                        <Image
                            borderRadius='full'
                            boxSize='150px'
                            src={user.pic}
                            alt={user.email}
                        />
                        <Text fontSize={{base:"15px",md:"25px"}}>{user.email}</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UserProfile