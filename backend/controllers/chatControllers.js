const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat= asyncHandler(async(req,res)=>{
    // for creating chat user has provided some id which is req.body and then check if chat is not a group chat and both users are present in that chat
    const {userId}=req.body;
    if(!userId) {
        console.log("Userid is not in request");
        return res.sendStatus(400);
    }
    let isChat = await Chat.find({
        isGroupChat:false,
        $and :[
            {users: {$elemMatch: {$eq : req.user._id}}}, // signed in user
            {users: {$elemMatch: {$eq : userId}}} // want oneto one chat with
        ]
    }).populate("users", "-password").populate("latestMessage") // get info of both users in chat and latest message 

    // get info of user who send latest message 
    isChat = await User.populate(isChat,{
        path:"latestMessage.sender",
        select:"name pic email",
    }) 
    if(isChat.length > 0) {
        res.send(isChat[0]);
    }else {
        let chatData= {
            chatName:"sender",
            isGroupChat:false,
            users:[req.user._id,userId],
        };
        try {
            const created = await Chat.create(chatData);
            const FullChat = await Chat.findOne({_id:created._id}).populate("users","-password");
            res.status(200).send(FullChat);

        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

const fetchChat = asyncHandler(async (req,res)=>{
    try {
        Chat.find({users: {$elemMatch: {$eq :req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updatedAt :-1})
        .then(async (results)=> {
            results= await User.populate(results, {
                path:"latestMessage.sender",
                select:"name,pic,email"
            })
            res.status(200).send(results);
        })
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const createGroupChat = asyncHandler(async(req,res)=>{
    if(!req.body.users || !req.body.name) {
        return res.status(400).send({message: "Both fields are required"});
    }
    let users = JSON.parse(req.body.users);
    if(users.length < 2) {
        return res.status(400).send({message: "Group chat required more than 2 users"});
    }
    users.push(req.user);
    try {
        const groupChat = await Chat.create({
            chatName:req.body.name,
            isGroupChat:true ,
            users:users,
            groupAdmin:req.user
        })
        const fullGroupChat = await Chat.find({_id :groupChat._id})
        .populate("users","-password")
        .populate("groupAdmin","-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const renameGroup = asyncHandler(async(req,res)=> {
    const {chatId, chatName}=req.body;
    const updatedChat = await Chat.findByIdAndUpdate(chatId, {chatName},{new:true})
    .populate("users","-password")
    .populate("groupAdmin","-password")

    if(!updatedChat) {
        return res.status(404).send({message:"Chat not found"});
    }
    res.status(200);
    res.json(updatedChat);
});

const addToGroup = asyncHandler(async (req,res)=> {
    const {chatId, userId} = req.body;
    // const exists = await Chat.find({users:{$elemMatch:{$eq:userId}}});
    // if(exists) {
    //     return res.status(400).send({message:"User already present"});
    // }
    const added = await Chat.findByIdAndUpdate(chatId,{
        $push:{users:userId},
    }, {new:true})
    .populate("users","-password")
    .populate("groupAdmin","-password");
    if(!added) {
        return res.status(404).send({message:"Chat not found"});
    }
    res.status(200);
    res.json(added);
});

const removeFromGroup = asyncHandler(async(req,res)=>{
    const {chatId, userId}=req.body;
    const removed = await Chat.findByIdAndUpdate(chatId,{
        $pull:{users:userId},
    },{new:true})
    .populate("users","-password")
    .populate("groupAdmin","-password");
    if(!removed) {
        return res.status(400).send({message:"Chat not found"});
    }
    res.status(200);
    res.json(removed);
})

module.exports={accessChat,fetchChat,createGroupChat,renameGroup,addToGroup,removeFromGroup};