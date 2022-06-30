const mongoose=require("mongoose");
const bcrypt = require("bcrypt");

const userModel=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    pic:{
        type:String,
        default:"https://assets.leetcode.com/users/avatars/avatar_1650277737.png"
    },
},{
    timestamps:true
});

userModel.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password,this.password);
}

//middleware
userModel.pre('save',async function (next){
    if(!this.isModified) {
        next();
    }
    const salt = await bcrypt.genSalt(10);

        // Hash password
    this.password =  await bcrypt.hash(this.password, salt);
})

const User=mongoose.model("User",userModel);
module.exports=User;