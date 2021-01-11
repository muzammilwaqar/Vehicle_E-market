const mongoose = require('mongoose');

const smartContractSchema = mongoose.Schema
({

 postID:     {type:String,required:true},
 SellerName   : { type:String, required:true},
 SellerCNIC    : { type:String, required:true},
 sellerid    : { type:String, required:true},
 SellerPK    : { type:String, required:true},
 BuyerName    : { type:String, required:true},
 BuyerCNIC    : { type:String, required:true},
 buyerid    : { type:String, required:true},
 BuyerPK    : { type:String, required:true},
 make    : { type:String, required:true},
 model    : { type:String, required:true},
 registrationnumber:{ type:String, required:true},
 registrationcity    : { type:String, required:true},
 exteriorcolor    : { type:String, required:true},
 price    : { type:String, required:true},
 enginetype    : { type:String, required:true},
 enginecapacity    : { type:String, required:true},
 transmission    : { type:String, required:true},
 assembly    : { type:String, required:true},
 //features    : { type:String, required:true},
 imagePath : { type:String, required:true }
});


module.exports = mongoose.model('smartContract',smartContractSchema);
