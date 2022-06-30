const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req,res,next)=> {
    const {name,email,password,pic}=req.body;
    if(!name || !email||!password) {
        res.status(400);
        throw new Error("Every field is required..");
    }
    const exists=await User.findOne({email});
    if(exists) {
        res.status(400);
        throw new Error("Buddy this email is already registered..");
    }
    const user = await User.create({
        name,
        email,
        password,
        pic,
    });
    if(user) {
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
            pic:user.pic,
            token:generateToken(user._id),
        });
    }else {
        res.status(400);
        throw new Error("Sorry fox, account cannot be created..");
    }
});

const loginUser = asyncHandler(async (req,res,next)=>{
    const {email,password}=req.body;
    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))) {
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
            pic:user.pic,
            token:generateToken(user._id),
        })
    }else {
        res.status(400);
        throw new Error("Either email or password is not matching")
    }
});

// http://localhost:3000/api/user?search=something
const allUsers = asyncHandler(async (req,res,next)=>{
    const keyword =req.query.search ? {
        $or : [
            {name : {$regex:req.query.search,$options:'i'}},
            {email: {$regex: req.query.search, $options:'i'}},
        ]
    }: {};
    const users = await User.find(keyword).find({_id:{$ne:req.user._id}}); // find all users belong to keyword section except current user which is logged in 
    res.send(users);   

})

module.exports={registerUser,loginUser,allUsers};