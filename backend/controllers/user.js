const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
//const { findOne } = require("../models/user");
const crypto =require("crypto");
const Review = require("../models/review");
const Post = require("../models/post");
const express = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const ChatMessgae = require("../models/chat");
const nodemailer = require("nodemailer");
const userChatModel = require('../models/chat');
const user = require("../models/user");


exports.createUser =  (req,res,next)=>{
  const tempuserstatus = "user";
  const prof='';
  const url = req.protocol + '://' + req.get("host");
  bcrypt.hash(req.body.password, 10)
    .then(hash =>
      {
        const user = new User({
          fullName: req.body.fullName,
          email:req.body.email,
          password:hash,
          phoneNumber:req.body.phoneNumber,
          fullAddress: req.body.fullAddress,
          cnicNumber:req.body.cnicNumber,
          dob: req.body.dob,
          genderStatus:req.body.genderStatus,
          accountStatus: tempuserstatus,
          imagePath: url+"/images/" + req.file.filename,
          authorizedStatus: false,
          privateKey :crypto.createHash('sha256').update(req.body.cnicNumber).digest('hex'),
          profileimage:"dummy"
      });
      user.save().then(result =>
        {
          res.status(201).json({
            message: "User created sucesfully",
            result: result
          });
        })
          .catch(error => {
            res.status(500).json({
                message: "Invalid Authentication Credentials!",
                result: error
            });
          });
  });
}


//admin Create

exports.createAdmin =  (req,res,next)=>{

  //const privatek = crypto.createHash('sha256').update(req.body.cnicNumber).digest('hex');
  //console.log(privatek);
  const tempuserstatus = "admin";
  const url = req.protocol + '://' + req.get("host");
  bcrypt.hash(req.body.password, 10)
    .then(hash =>
      {
        const user = new User({
          fullName: req.body.fullName,
          email:req.body.email,
          password:hash,
          phoneNumber:req.body.phoneNumber,
          fullAddress: req.body.fullAddress,
          cnicNumber:req.body.cnicNumber,
          dob: req.body.dob,
          genderStatus:req.body.genderStatus,
          imagePath: "dummy",
          //imagePath: req.body.imagePath,
          accountStatus: tempuserstatus,
          authorizedStatus: true,
          privateKey :crypto.createHash('sha256').update(req.body.cnicNumber).digest('hex'),
          profileimage:"dummy"
      });

      user.save().then(result =>
        {
          res.status(201).json({
            message: "User created sucesfully",
            result: result
          });
        }).catch(error => {
            res.status(500).json({
                message: "Invalid Authentication Credentials!",
                result: error
            });
          });
  }).catch(error =>
    {
      res.status(500).json({
        message: "Error creating Admin",
        result: error

    });
  })
}


exports.userLogin= (req,res,next) =>
{
  //console.log("sucesfully");
  let fethcedUser;
  User.findOne({cnicNumber:req.body.cnicNumber})
    .then(user =>
    {
      if(!user)
      {
        return res.status(401).json(
        {
          message: "Authentication Failed"
        });
      }
      fethcedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
      .then(result =>
          {
            if(!result)
            {
              return res.status(401).json(
                {
                  message: "Invalid Authentication Credentials"
                });
            }
            //the second parameter "'secret_this_should_be_longer'" this would be changed in our real application for security purpose...and it is used in self created middleware check-auth
            const token = jwt.sign({cnicNumber: fethcedUser.cnicNumber, userId: fethcedUser._id, accountStatus: fethcedUser.accountStatus},
              process.env.JWT_KEY,
              {expiresIn: "1h"});
            res.status(200).json(
              {
                token : token,
                expiresIn: 3600,
                userId: fethcedUser._id,
                accountStatus: fethcedUser.accountStatus
                //message: "Succesfull"
              });
          })
          .catch(error =>
            {
              return res.status(401).json(
                {
                  message: "Authentication Failed"
                });
            });
    }





exports.userdetails = (req,res,next) =>
{

User.findOne({cnicNumber: req.userData.cnicNumber}).then(result =>{

  if(result)
  {
    res.status(200).json({
      message:"Fetched sucesfully",
      user:result,
      });
  }
  else
  {
    res.status(404).json({message:"error finding user"})
  }

}).catch(error =>res.status(500).send(error.message))
}

exports.userstats = (req,res,next) =>
{

User.findOne({cnicNumber: req.userData.cnicNumber}).then(result =>{

  if(result)
  {   //console.log("resultinto",result._id);
      let condition = {"creator": result._id}
      //console.log("con", condition);

    Post.find(condition).count().then(count => {
   // console.log("results", count);
    return count;
  }).then(count => {
   // console.log("count", count)
    Post.aggregate([
      { $match: { 'creator' : result._id } },
      { $group: {
        _id: "$month",
        count: { $sum: 1 }
      }
}]).then(result => {
     // console.log("results", result);
      return result;
    }).then(result => {
     // console.log("resulttzzz", result)
      res.status(200).json(
        {
          userPosts: count,
          barData: result
        });
    }).catch(error => {
     // console.log(error);
      res.status(500).json({
        message: "Fetching Post Failed!"
      })
    });
    // res.status(200).json(
    //   {
    //     userPosts: count
    //   });
  }).catch(error => {
    //console.log(error);
    res.status(500).json({
      message: "Fetching Post Failed!"
    })
  });
  }
  else
  {
    res.status(404).json({message:"error finding user"})
  }

}).catch(error =>res.status(500).send(error.message))
}




exports.deleteUser = (req,res,next) =>
{

  User.deleteOne({cnicNumber: req.body.cnicNumber}).then(result =>
    {
      //console.log(req.params.cnicNumber);
      if(result.n > 0)
      {
        res.status(200).json({message:"User deleted successfully"});
      }
      else
      {
        res.status(401).json({message:"error deleting user"});
      }
    }).catch(error =>{res.status(500).json({message:"error deleting user"});
  });

}



exports.deleteAccount = (req,res,next) =>
{
  //console.log("id: " + req.params.id);
  User.deleteOne({_id: req.params.id}).then(result =>
    {
      //console.log(req.params.cnicNumber);
      if(result.n > 0)
      {
        res.status(200).json({message:"User deleted successfully"});
      }
      else
      {
        res.status(401).json({message:"error deleting user"});
      }
    }).catch(error =>{res.status(500).json({message:"error deleting user"});
  });

}



exports.findUnverifiedUsers = (req,res) =>
{

  User.find({authorizedStatus:false})
  .then(results => {

    res.status(200).json(
      {
        message:"Unverified Users Fetched Sucessfully",
        users:results

      })

    })
  .catch(error => console.error(error))

}


exports.findVerifiedUsers = (req,res) =>
{

  User.find({authorizedStatus:true})
  .then(results => {

     res.status(200).json(
      {
        message:"Verified Users Fetched Sucessfully",
        users:results
      })
    })
  .catch(error => console.error(error))

}

exports.findallusers = (req,res) =>
{
  User.find().then(results=>
    {
      res.status(200).json({
        message : " All users fethced sucessful",
        users : results  });
    })
    .catch(error => console.error(error))
}





exports.approveuser =  (req,res,next) =>
{
const a = {"authorizedStatus": true};
  User.findOne({cnicNumber: req.body.cnicNumber}, function(err, foundobject)
  {
    //console.log(req.params.cnicNumber + " found");
    if(err)
    {
      //console.log(err);
      res.status(500).send(err.message);
    }
    else
    {
      if(!foundobject)
      {
        res.status(404).send();
      }
      else
      {
          foundobject.authorizedStatus = true;


        //can apply as many fields as we can like above

        foundobject.save(function(err,updateObject)
        {
          if(err)
          {
           // console.log(err);
            res.status(500).send();
          }
          else
          {
            res.send(updateObject);
          }
        })
      }
    }
  })
}





exports.disableuser =  (req,res,next) =>
{
const a = {"authorizedStatus": true};
  User.findOne({cnicNumber: req.body.cnicNumber}, function(err, foundobject)
  {
    //console.log(req.params.cnicNumber + " found");
    if(err)
    {
     // console.log(err);
      res.status(500).send(err.message);
    }
    else
    {
      if(!foundobject)
      {
        res.status(404).send();
      }
      else
      {
        foundobject.authorizedStatus = false;
        foundobject.save(function(err,updateObject)
        {
          if(err)
          {
           // console.log(err);
            res.status(500).send();
          }
          else
          {
            res.send(updateObject);
          }
        })
      }
    }
  })
}


exports.authorizedStatus = (req,res,next) =>
{
  User.findOne({cnicNumber: req.params.cnicNumber}).then(result =>
    {
      res.status(200).json({userstatus:result});
    })
}





exports.forgotpassword= (req,res,next) =>
{
  User.findOne({cnicNumber: req.body.cnicNumber,privateKey:req.body.privateKey}, function(err, foundobject)
  {
    //console.log(req.params.cnicNumber + " found");
    if(err)
    {
     // console.log(err);
      res.status(500).send(err.message);
    }
    else
    {
      if(!foundobject)
      {
        res.status(404).send();
      }
      else
      {
         //here
         var newpass="";
         for(let i=0; i<6;i++)
         {
           const temp = Math.floor(Math.random() * 26);
           //console.log(temp);
           switch(temp)
           {
             case 0: newpass=newpass.concat("A") ;  break;
             case 1: newpass=newpass.concat("B");  break;
             case 2: newpass=newpass.concat("C");  break;
             case 3: newpass=newpass.concat("D");  break;
             case 4: newpass=newpass.concat("E"); break;
             case 5: newpass=newpass.concat("F"); break;
             case 6: newpass=newpass.concat("G"); break;
             case 7: newpass=newpass.concat("H"); break;
             case 8: newpass=newpass.concat("I"); break;
             case 9: newpass=newpass.concat("J"); break;
             case 10: newpass=newpass.concat("K");  break;
             case 11: newpass=newpass.concat("L");break;
             case 12: newpass=newpass.concat("M");break;
             case 13: newpass=newpass.concat("N");break;
             case 14: newpass=newpass.concat("O");break;
             case 15: newpass=newpass.concat("P");break;
             case 16: newpass=newpass.concat("Q");break;
             case 17: newpass=newpass.concat("R");break;
             case 18: newpass=newpass.concat("S");break;
             case 19: newpass=newpass.concat("T");break;
             case 20: newpass=newpass.concat("U");break;
             case 21: newpass=newpass.concat("V");break;
             case 22: newpass=newpass.concat("W");break;
             case 23: newpass=newpass.concat("X");break;
             case 24: newpass=newpass.concat("Y");break;
             case 25: newpass=newpass.concat("Z");break;
           }

         }
          for(j=0;j<4;j++)
          {
            const temp = Math.floor(Math.random() * 10);
            newpass = newpass.concat(temp);
          }

          var seprate = newpass.slice(2, 4);
          var lower = seprate.toLowerCase();
          newpass = newpass.replace(seprate,lower);

          //var cncryptedpass =crypto.createHash('sha1').update(newpass).digest('hex');

          bcrypt.hash(newpass, 10, function(err, hash)
          {
            foundobject.password=hash;
            foundobject.save(function(err,updateObject)
        {
          if(err)
          {
            //console.log(err);
            res.status(500).send(err);
          }
          else
          {
           // console.log(updateObject);
            res.status(200).json
            ({
              message:"Successfully updated password",
              result:newpass});


              async function main() {

                let testAccount = await nodemailer.createTestAccount();


                let transporter = nodemailer.createTransport({
                  //host: "smtp.ethereal.email",
                   host: "smtp.gmail.com",
                  port: 587,
                  secure: false, // true for 465, false for other ports
                  auth: {
                    user: 'muzammilwaqar02@gmail.com ', // generated ethereal user
                    pass: 'leomuzi6894', // generated ethereal password
                  },
                })

                const msg ={
                  from: "muzammilwaqar02@gmail.com", /*muzammilwaqar02@gmail.com*/// if not working send through this
                  to: foundobject.email, // list of receivers
                  subject: "New Password" , // Subject line
                  text:"Your New Password is : "+"  -  "+ newpass // plain text body
                };

                // send mail with defined transport object
                const info = await transporter.sendMail(msg);


            }

              main().catch(console.error);



          }
        })
          });


      }
    }
  })
}


exports.resetpassword = (req,res,next) =>
{
  User.findOne({cnicNumber: req.body.cnicNumber}, function(err, foundobject)
  {
    //console.log(req.params.cnicNumber + " found");
    if(err)
    {
      //console.log(err);
      res.status(500).send(err.message);
    }
    else
    {
      if(!foundobject)
      {
        res.status(404).send();
      }
      else
      {
        bcrypt.hash(req.body.password, 10, function(err, hash)
        {
          foundobject.password=hash;
          //console.log(hash);
          foundobject.save(function(err,updateObject)
          {
            if(err)
            {
              //console.log(err);
              res.status(500).send(err);
            }
            else
            {
            // console.log(updateObject);
              res.status(200).json
              ({
                message:"Successfully updated password",
                result:req.body.password});
            }
          })
        });
      }
    }
  }  )
}

exports.updateuserdetails =  (req,res,next) =>
{
  const url = req.protocol + '://' + req.get("host");
  User.findOne({cnicNumber: req.body.cnicNumber}, function(err, foundobject)
  {
    //console.log(req.params.cnicNumber + " found");
    if(err)
    {
      //(err);
      res.status(500).send(err.message);
    }
    else
    {
      if(!foundobject)
      {
        res.status(404).send();
      }
      else
      {
        if(req.body.email)
        {
          foundobject.email = req.body.email;
        }
        if(req.body.phoneNumber)
        {
          foundobject.phoneNumber = req.body.phoneNumber;
        }
        if(req.body.fullAddress)
        {
          foundobject.fullAddress = req.body.fullAddress;
        }
        if(req.body.password)
        {
          bcrypt.hash(req.body.password, 10, function(err, hash)
          {
            foundobject.password=hash;
          });
        }
        if(req.body.image)
        {
          foundobject.imagePath = url+"/images/" + req.file.filename;
        }
        //can apply as many fields as we can like above

        foundobject.save(function(err,updateObject)
        {
          if(err)
          {
            //console.log(err);
            res.status(500).send();
          }
          else
          {
            res.send(updateObject);
          }
        })
      }
    }
  })
}


exports.getcnicNumber = (req,res) =>
{

  User.find({_id:req.body.id}).then(result =>
  {
      if(result)
      {
      res.status(200).json(result);
      }
      else
      {
        res.status(404).json({message: 'User not found'});
      }
    })
    .catch(error =>res.status(500).send())
}


///////////////

exports.startchat = (req,res) =>
{
  var portno;
  test = [];
  var portid1;
  var portid2;


  User.findById(req.body.creatorid).then(user =>
    {
      var portno1;
      var port1 = req.body.cnicNumber;
      var temp1 = port1.toString().slice(11,13);
      var port2 = user.cnicNumber;
      var temp2 = port2.toString().slice(11,13);
      var portno1 = temp1.concat(temp2);
      http.listen(portno1, () =>
        {
       //console.log('listening on *'+portno1);

        });
      io.on('connection', (socket) => {
        //console.log('a user connected');

        const chat =new ChatMessgae
          ({
            portno:portno1,
            sendercnicNumber:req.body.cnicNumber,
            recievercnicNumber:port2,
            message:req.body.message,

          });
      chat.save().then(result =>
        {
          res.status(201).json({
            message: "messsage saved Sucessfully",
            result: result
          });
        })
          .catch(error => {
            res.status(500).json({
                message: "Couldnt save message",
                result: error
            });
          });
        var bodymsg = req.body.message;
        socket.on('message', (bodymsg ) => {
          //console.log(msg);
          socket.broadcast.emit('message-broadcast', bodymsg );
        });
      });
      res.status(200).send(portno1);

    })



    app.get('/', (req, res) => res.send('hello!'));


}


exports.sendemail = (req,res,next) =>
{
  let user =req.body;

 async function main() {

    let testAccount = await nodemailer.createTestAccount();


    let transporter = nodemailer.createTransport({
      //host: "smtp.ethereal.email",
       host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'muzammilwaqar02@gmail.com ', // generated ethereal user
        pass: 'leomuzi6894', // generated ethereal password
      },
    })

    const msg ={
      from: "muzammilwaqar02@gmail.com", /*muzammilwaqar02@gmail.com*/// if not working send through this
      to: "muzammilawan0@gmail.com,obaid6968@gmail.com janelle.bednar@ethereal.email", // list of receivers
      subject: user.subject , // Subject line
      text:user.email+"  -  "+ user.message // plain text body
    };

    // send mail with defined transport object
    const info = await transporter.sendMail(msg);


}

  main().catch(console.error);
  res.status(200).send("Email Sent");
}




exports.getChatBox = async (req,res,next) =>
{
  var userids=[];
  var usernames=[];
  //console.log(req.params._id);
  //console.log(req.body._id);
  var currentuser = req.params._id;
  let userChatData = await userChatModel.find( { 'users.user_id':  req.params._id });
  let count =userChatData.length;
  //console.log(count)
  var users=[];
  for (let i=0;i<userChatData.length;i++)
  {
    if(currentuser != userChatData[i].users[1].user_id)
    {
      userids[i] = userChatData[i].users[1].user_id;
    }
    else if(currentuser != userChatData[i].users[0].user_id)
    {
      userids[i] = userChatData[i].users[0].user_id;
    }
  }
  for (let j=0;j<userids.length;j++)
  {
    //console.log("length of id"+userids.length)
    let a = await User.findById(userids[j]);
    users.push(a);
  }
  if(users){
    res.status(200).send(users);
  }else{
    res.status(400).send({message: "No chat found"});
  }


}

exports.accountdetails = (req,res,next) =>
{
  //console.log("body"+req.body.id);
  //console.log("params"+req.params.id);
  User.findById(req.params.id).then(result =>{

    if(result)
    {
      res.status(200).send(result);
    }
    else
    {
      res.status(404).json({message:"error finding user"})
    }

  }).catch(error =>res.status(500).send(error.message))
}


exports.checkkey =(req,res) =>
{
  User.findOne({privateKey:req.params.key}).then(result =>
    {
      if(result)
      {
        res.status(200).send(true);
      }
      else
      {
        res.status(404).send(false);
      }
    }).catch(error => res.status(500).send(error));

}

exports.inboxmessage = (req,res,next) =>
{

 // console.log("current user id: "+req.body.currentuserid);
 // console.log("chat user id: "+req.body.chatuserid);
  var userinbox;

userChatModel.findOne({ 'users.user_id': { $all: [ req.body.currentuserid, req.body.chatuserid] } })
  .then(result2 =>
    {
      userinbox = result2;
      //console.log( "Curretn usre chats : "+result2);

      res.status(200).send(result2.msg_list);

    });


}



exports.updateprofileimage =(req,res) =>
{
 /// console.log("controller start:"+ req.body.id);
  const url = req.protocol + '://' + req.get("host");
  //console.log("file path: "+ url+"/images/"+req.file.filename);
  //User.findById(req.params.id).then(result =>{
  User.findById(req.body.id).then(result =>
    {
      if(result)
      {
       // console.log("user found");

      //  console.log("found and editing");
        result.profileimage = url+"/images/"+req.file.filename;

              //can apply as many fields as we can like above
      result.save(function(err,updateObject)
      {
          //console.log("saving object");
          if(err)
          {
           // console.log(err);
            res.status(500).send();
          }
          else
          {
            res.send(updateObject);
          }
        })


        //end
      }
      else
      {
        //console.log("user not found");
      }
    })



}

/*-
-/
/
/
/
/
/
/
/
/
/
/Un finsihed work
/
/
/
/
/
/
/
/
/
*/

//user chat inbox controller







exports.deleteChat = (req,res) =>
{
  userChatModel.deleteOne({ 'users.user_id': { $all: [ req.param.currentuserid, req.body.chatuserid] } })
  .then(result2 =>
    {
     // console.log("delete chat in:");
      userinbox = result2;
      //console.log( "Curretn usre chats : "+result2);
      res.status(200).send(result2.msg_list);

    });

}

exports.accountstatus = (req,res) =>
{/*console.log("here")
  console.log("id:"+req.params.id);
  console.log("body id:"+req.body.id);
  User.findById(req.params.id).then(result =>
    {
      console.log("1 one");
      if(result)
      {
        console.log("inside if")
      }
      else
      {
        console.log("inside else")
      }
    })*/
  User.findOne({_id: req.params.id}).then( result =>
    {
      //console.log(result);
      if(result)
      {
        //console.log(result.accountStatus);
        res.status(200).send(result.accountStatus);
      }
      else
      {
        res.status(404).json({message:"No User Found"});
      }

    }
  ).catch(err => res.status(500).json({message:"Server Error"}));
}



exports.createreview = (req,res) =>
{
  let q= Object.entries(req.body);
  /*console.log("inside review.js"+q);
  console.log("Subject : "+req.params.subject);
  console.log("Rating : "+req.params.rating);
  console.log("Review : "+req.params.review);
  console.log("Reviewed : "+req.params.reviewed);
  console.log("Reviewer : "+req.params.reviewer);*/
  const newreview = new Review(
    {
      subject:req.params.subject,
      rating:req.params.rating,
      review: req.params.review,
      reviewed: req.params.reviewed,
      reviewer: req.params.reviewer
    });

    newreview.save().then(result =>
      {
        res.status(200).json({
          message: "review created sucesfully",
          result: result
        });
      })
        .catch(error => {
          res.status(500).json({
              message: "Invalid Authentication Credentials!",
              result: error
          });
        })
}

exports.getreviews = (req,res) =>
{
  Review.find({reviewed:req.params.id}).then((result) =>
  {
    if(result)
    {
     // console.log(result);
      res.status(201).send(result);
    }
    else
    {
      res.status(404).jason({message:"No reviews Found"});
    }
    }).catch(err =>
      {
        res.status(500).jason({message:"Server Error"});
      });
}

exports.userposts = (req,res) =>
{
  Post.find({creator:req.params.id}).then((result) =>
  {
    if(result)
    {
      res.status(200).send(result);
    }
    else
    {
      res.status(404).jason({message:"No posts found"});
    }
  }).catch(err =>
    {
      res.status(500).send(err.message);
    })
}

exports.unverifieduserscount = (req,res) => 
{
  User.countDocuments({authorizedStatus: false}).then(result => 
    {
      if(result)
      {
        res.status(200).json(result);
      }
      else
      {
        res.status(404).json({message:"No record found"});
      }
    }).catch(err => {res.status(500).send(err.message)});
}

exports.verifieduserscount = (req,res) =>
{
  User.countDocuments({authorizedStatus: true}).then(result => 
    {
      if(result)
      {
        res.status(200).json(result);
      }
      else
      {
        res.status(404).json({message:"No record found"});
      }
    }).catch(err => {res.status(500).send(err.message)});
}

exports.alluserscount = (req,res) =>
{
  User.countDocuments().then(result => 
    {
      if(result)
      {
        res.status(200).json(result);
      }
      else
      {
        res.status(404).json({message:"No record found"});
      }
    }).catch(err => {res.status(500).send(err.message)});
}

exports.getautroizedstatus = (req,res) => 
{
  User.findById(req.params.id).then(result => 
    {
      if(result)
      {
        res.status(200).json(result.authorizedStatus)
      }
      else
      {
        res.status(404).json({message:"no user found"})
      }
    });
}