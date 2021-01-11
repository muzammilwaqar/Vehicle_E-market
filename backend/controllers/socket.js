const userModel = require('../models/user');


module.exports = {
  authUser: async function (socket, callback) {
      if (socket.userData != null) {
              handleUser(socket, callback);

      } else {
          console.log('invalid token!');
          socket.disconnect();
      }

  },
  disconnectUser: function (socket) {

          disconnectUser(socket);
  }
};



async function disconnectUser(socket) {

  const updatedUser = userModel.updateOne({ _id: socket.userData.userId }, {
      $set: {
          socket_status: false
      }
  }).exec();
  if (updatedUser) {
      console.log("disconnected user :" + socket.userData.userId);
  }
}

async function handleUser(socket,callback) {
  var userConnected = null;
  console.log("userId:" + socket.userData.userId);

      var userData = await userModel.findOne({ _id: socket.userData.userId });

      if (userData) {
          userConnected = await userModel.updateOne({ _id: socket.userData.userId }, {
              $set: {
                  socket_id: socket.id,
                  socket_status: true
              }
          }).exec();
      }


  if (userConnected) {
      console.log('user connected :' + socket.userData.userId);
      socket.emit('connected', { connected: true });
      if(callback)
      {
          callback({ message: "Successfully Connected tochat server" });
      }
  } else {
      socket.disconnect('unauthorized');
      console.log('disconnecting user socket:' + socket.userData.userId);
      if(callback)
      {
          callback({ message:"UnauthoriZed" });
      }
  }
}
