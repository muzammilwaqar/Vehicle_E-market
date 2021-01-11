const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema
({

 subject    : { type:String, required:true},
 rating    : { type:String, required:true},
 review    : { type:String, required:true},
 reviewed    : { type:String, required:true},
 reviewer    : { type:String, required:true}
});


module.exports = mongoose.model('review',reviewSchema);
