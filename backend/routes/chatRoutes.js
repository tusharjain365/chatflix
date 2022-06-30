const express= require("express");
const { accessChat, fetchChat, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../controllers/chatControllers");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();
//operations in chat
router.route("/").post(protect,accessChat); // for creating one to one chat
router.route('/').get(protect, fetchChat);
router.route('/group').post(protect,createGroupChat);
router.route("/rename").put(protect,renameGroup);
router.route("/groupadd").put(protect,addToGroup);
router.route("/groupremove").put(protect,removeFromGroup);
module.exports=router;