import { Avatar, Tooltip } from '@chakra-ui/react';
import { isLastMessage, isSameSender, isSameSenderMargin } from '../config/chatFunctions';
import ScrollableFeed from 'react-scrollable-feed';
import { ChatState } from '../context/ChatProvider';

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();
    return (
        <ScrollableFeed>
            {messages && messages.map((m, i) => (
                <div key={m._id} style={{ display: "flex" }}>
                    {(isSameSender(messages, m, i, user._id) ||
                        isLastMessage(messages, i, user._id)) && (
                            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                                <Avatar
                                    mt="7px"
                                    mr={1}
                                    size="sm"
                                    cursor="pointer"
                                    name={m.sender.name}
                                    src={m.sender.pic}
                                />
                            </Tooltip>
                        )}
                        <span style={{backgroundColor:`${user._id === m.sender._id?"#FFFFFF":"#c8b7a6"}`, borderRadius:'8px',padding:"5px 15px",maxWidth:'75%',marginBottom:'2px',marginLeft:isSameSenderMargin(messages,m,i,user._id)}}>
                            {m.content}
                        </span>
                </div>
            ))}
        </ScrollableFeed>
    )
}
export default ScrollableChat;