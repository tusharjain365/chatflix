const express = require("express");
const router = express.Router();
const {registerUser, loginUser,allUsers} = require("../controllers/userControllers");
const {protect} = require("../middlewares/authMiddleware");

router.route("/").post(registerUser).get(protect,allUsers); // first check protect then come to allusers
router.route("/login").post(loginUser);
module.exports=router;