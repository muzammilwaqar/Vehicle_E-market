const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  //title = name

  //basic car info
  city: { type:String, required:true},
  make:{ type:String, required:true},
  model:{ type:String, required:true},
  registrationcity:{ type:String, required:true},
  mileage:{ type:String, required:true},
  exteriorcolor:{ type:String, required:true},
  description: { type:String, required:true },

  //car price
  price: { type:Number, required:true },

  //images
  imagePath : { type:String, required:true },
  imagePath1 : { type:String },
  imagePath2 : { type:String},

  //addtional information
  enginetype: { type:String, required:true},
  enginecapacity: { type:String, required:true},
  transmission: { type:String, required:true},
  month:{type: Number, required:true},
  assembly: { type:String, required:true},
  features: { type:String, required:true},

  //contacts information
  mobilenumber: { type:String, required:true},
/*
  title: { type:String, required:true },
  engine: { type:String, required:true},
  location: { type:String, required:true},
  */

  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" , require: true }
});


module.exports = mongoose.model('Post',postSchema);
