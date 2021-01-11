const mongoose = require('mongoose');

// const chatSchema = mongoose.Schema({
//   //title = name

//   //basic car info
//   portno: { type:Number, required:true},
//   sendercnicNumber: { type:Number, required:true },
//   recievercnicNumber: { type:Number, required:true},
//   message:{type:String, required:true}
// });



const chatSchema = mongoose.Schema({

  // user1: {type:String, required:true},
  // user2: {type:String, required:true},


  users: [{
    _id: false,
    user_id: { type: String }
}],

  msg_list: [{
      from: String,
      to: String,
      message: String,
      created_at: Date
  }],

  created_at: { type: Date, default: new Date },
  updated_at: { type: Date, default: new Date }
});



module.exports = mongoose.model('chat',chatSchema);
