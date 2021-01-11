const User = require('../models/user');
const Contract = require('../models/smartcontract');
const Post = require('../models/post');


exports.inititatecontract = (req,res) =>
{
 // console.log('inititatecontract');
  const url = req.protocol + '://' + req.get("host");
   const temp =null;
  const contract = new Contract(
    {
      postID : req.body.postID,
      SellerName   : req.body.SellerName ,
      SellerCNIC    : req.body.SellerCNIC ,
      sellerid: req.body.sellerid,
      SellerPK    : "tobefilled" ,
      BuyerName    : req.body.BuyerName ,
      BuyerCNIC    : req.body.BuyerCNIC ,
      buyerid: req.body.buyerid,
      BuyerPK    : req.body.BuyerPK ,
      make    : req.body.make ,
      model    : req.body.model ,
      registrationnumber    : req.body.registrationnumber ,
      registrationcity    : req.body.registrationcity ,
      exteriorcolor    : req.body.exteriorcolor ,
      price    : req.body.price ,
      enginetype    : req.body.enginetype ,
      enginecapacity    : req.body.enginecapacity ,
      transmission    : req.body.transmission ,
      assembly    : req.body.assembly ,
      //features    : req.body.features ,
      imagePath: url+"/images/" + req.file.filename
    });
    contract.save().then(result =>
      {
        console.log("sucess");
        res.status(201).json({
          message: "contract created sucesfully",
          result: result
        });
      })
        .catch(error => {
          console.log("eror"+error)
          res.status(500).json({
              message: "Error creating Contract!",
              result: error
          });
        });

}


exports.getallsellercontracts =(req,res) =>
{
  Contract.find({SellerCNIC:req.params.cnicNumber}).then(result =>
    {
      if(result)
      {
        res.status(200).send(result);
      }
      else
      {
        res.status(404).json({message:"No Contracts available"})
      }
    }).catch(err =>
      {
        console.log(err);
        res.status(500).send(err.message);
      });
}

exports.getallbuyercontracts =(req,res) =>
{
  Contract.find({BuyerCNIC:req.params.cnicNumber}).then(result =>
    {
      if(result)
      {
        res.status(200).send(result);
      }
      else
      {
        res.status(404).json({message:"No Contracts available"})
      }
    }).catch(err =>
      {
        console.log(err);
        res.status(500).send(err.message);
    });
}

exports.getcontractdetails =(req,res) =>
{
  Contract.findOne({_id: req.params.contractid}).then(result =>
    {
      if(result)
      {
        res.status(200).send(result);
      }
      else
      {
        res.status(404).json({message:"No Contracts available"})
      }
    }).catch(err =>
      {
        console.log(err);
        res.status(500).send(err.message);
    });
}

exports.deleteContract =(req,res) =>
{
  console.log("delete params cpntract id:"+ req.params.contractid );
  console.log("delete body cpntract id:"+ req.body.contractid );

  Contract.deleteOne({_id: req.params.contractid}).then(result =>
    {
      //console.log(req.params.cnicNumber);
      if(result.n > 0)
      {
        res.status(200).json({message:"Contract deleted successfully"});
      }
      else
      {
        res.status(401).json({message:"error deleting Contract"});
      }
    }).catch(error =>{res.status(500).json({message:"error deleting Contract"});
  });


}

exports.getpendingcontracts = (req,res) => 
{
  Contract.countDocuments().then(result => 
    {
      if(result)
      {
        res.status(200).json(result);
      }
      else
      {
        res.status(404).json({message:"no contracts found"})
      }
    });
}