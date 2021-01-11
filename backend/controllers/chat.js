const userModel = require('../models/user');
const userChatModel = require('../models/chat');


module.exports.sendChatMessage = async (data, socket, callback) => {

  //console.log("inside send chat");

 // console.log("CALLBACK ",callback);

 // console.log("sending Chat...");
 // console.log("socket of this user" + socket.id);
  // socket.emit(recieveChatMessage, data);

  var [toUserData, fromUserData] = await Promise.all([
      userModel.findOne({ _id: data.to_id }),
      userModel.findOne({ _id: socket.userData.userId })
  ]);

  //console.log("data.to_id: ",data.to_id );
  //console.log("socket.userData.userId: ",socket.userData.userId);

  var updatedChat = null;

  console.log("toUserData: ",toUserData);

  if (toUserData) {
     // console.log("Inside toUserData check");
     let userChatData = await userChatModel.findOne( { 'users.user_id': { $all: [ socket.userData.userId, data.to_id] } });


     //console.log("userChatData======: ",userChatData);


     if (userChatData) {
          var created_at = new Date();
          var obj = {
              from: socket.userData.userId ,
              to: data.to_id,
              message: data.message,
              created_at: created_at
          };
          data.created_at = created_at;
          updatedChat = await userChatModel.updateOne({ _id: userChatData._id }, {
              $set: {
                  updated_at: created_at
              },
              $push: {
                  msg_list: obj
              }
          }).exec();
      }
      else {
          var created_at = new Date();
          var obj = {

              users:[{user_id:socket.userData.userId},{user_id:data.to_id}],
              msg_list: [{
                  from: socket.userData.userId,
                  to: data.to_id,
                  message: data.message,
                  created_at: created_at
              }],
              created_at: created_at,
              updated_at: created_at
          };
          data.created_at = created_at;
          updatedChat = await userChatModel.create(obj).then(result => { return result }).catch(err => { console.log(err); return null; });
          // console.log(updatedChat);
      }

      //console.log("2");
      if (updatedChat) {
          //console.log("3");
          //console.log(toUserData);
          if (toUserData.socket_status) {

            data.from_id = socket.userData.userId;

             // console.log("SENDING DATA to other user");
             // console.log(data);

              //console.log("toUserData.socket_id: ",toUserData.socket_id);

              socket.broadcast.to(toUserData.socket_id).emit("recieveChatMessage", data);
          }

          // callback({ status: true, message: "message sent successfully!" });
      }
      else {
          //console.log("4");
          // callback({ status: false, message: "something went wrong!" });
      }
  }
  else {
      // callback({ status: false, message: "requested user not found!" });
  }
}
