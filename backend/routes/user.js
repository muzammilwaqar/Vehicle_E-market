const express  = require("express");
//const bcrypt = require("bcrypt");
//const jwt = require("jsonwebtoken");
const extractFile = require('../middleware/file');
const UserController = require("../controllers/user");
const app = express();
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const smartContractController = require("../controllers/smartcontract");
//const ReviewController = require("../controllers/review");

//sign up post router
router.post("/signup",extractFile,UserController.createUser);
router.post("/createadmin",extractFile,UserController.createAdmin);

//contract
router.post("/createcontract",extractFile,smartContractController.inititatecontract);
router.get("/sellercontract/:cnicNumber",smartContractController.getallsellercontracts);
router.get("/buyercontract/:cnicNumber",smartContractController.getallbuyercontracts);
router.get("/contractdetails/:contractid",smartContractController.getcontractdetails);
router.post("/deletecontract/:contractid",smartContractController.deleteContract);
//login post router
router.post("/login",UserController.userLogin);
router.post("/updateprofileimage",extractFile,UserController.updateprofileimage);

//reviews
router.post("/createreview/:subject/:rating/:review/:reviewed/:reviewer",UserController.createreview);
router.get("/getreviews/:id",UserController.getreviews);
//unverified users
router.get("/unverifiedusers",UserController.findUnverifiedUsers);
router.get("/verifiedusers",UserController.findVerifiedUsers);
router.get("/allusers",UserController.findallusers);
router.get("/accstatus/:id",UserController.accountstatus);
router.get("/getcnicnum",UserController.getcnicNumber);
router.get("/getauthorizedstatus/:id",UserController.getautroizedstatus);
//router.post("/dummy",UserController.dummy);
//deletecontract


//admin routes
router.get("/alluserscount",UserController.alluserscount);
router.get("/verifieduserscount",UserController.verifieduserscount );
router.get("/unverifieduserscount",UserController.unverifieduserscount);
router.get("/pendingcontracts",smartContractController.getpendingcontracts)

//router.put("/approve/:cnicNumber",UserController.approveuser);
router.post("/approve",UserController.approveuser);
router.post("/disable",UserController.disableuser);
router.get("/userdetails",checkAuth,UserController.userdetails);
router.get("/userstats",checkAuth,UserController.userstats);
router.get("/accountdetails/:id",UserController.accountdetails);
router.post("/deleteuser",UserController.deleteUser);
router.post("/deleteaccount/:id",UserController.deleteAccount);
//router.delete("/delete/:cnicNumber",UserController.deleteUser);

router.post("/deleteChat/:id",UserController.deleteChat);

router.post("/chat",UserController.startchat);
router.post("/updateuserdetails",UserController.updateuserdetails);
router.put("/forgotpassword",UserController.forgotpassword);
router.post("/reset",UserController.resetpassword);
router.post("/mail",UserController.sendemail);
router.get("/key/:key",UserController.checkkey);
router.get("/userposts/:id",UserController.userposts);


//chat app
router.get("/getChatBox/:_id",UserController.getChatBox);
router.post("/inboxmessage",UserController.inboxmessage);
module.exports = router;
