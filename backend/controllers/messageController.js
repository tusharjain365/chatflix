const User = require("../models/userModel")
const Chat = require("../models/chatModel")
const Message = require("../models/messageModel")

const asyncHandler = require("express-async-handler");

const sendMessage = asyncHandler(async (req,res)=>{
    const {chatId, content}=req.body;
    let newMessage = await Message.create({
        sender:req.user._id,
        content:content,
        chat:chatId
    });
    try {
        let message = await Message.create(newMessage);
        message = await message.populate("sender",'name pic');
        message = await message.populate("chat");
        message = await User.populate(message, {
            path:'chat.users',
            select:'name pic email',
        })

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage:message,
        })
        res.status(200).json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
    
    
});

const allMessages = asyncHandler(async (req,res)=>{
    try {
        const messages = await Message.find({chat:req.params.chatId}).populate("sender","name pic email").populate('chat');
        res.status(200).json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});
module.exports={sendMessage,allMessages};
