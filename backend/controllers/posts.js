const Post = require('../models/post');
const Busboy = require('busboy');
//const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const User = require('../models/user');
ObjectID = require('mongodb').ObjectID;

exports.deletePost = (req, res, next) => {
  //console.log(req.params.id);
  //to check it in console
  Post.deleteOne({ _id: req.params.id})
    .then(result => {
      // console.log(result);
      if (result.n > 0) {
        res.status(200).json({   message: "Post Deleted Sucessfully!" });
      }
      else {
        res.status(401).json({ message: "Not Authorized!" });
      }

    }).catch(error => {
      res.status(500).json({
        message: "Deleting Post Failed!"
      });
    });
}


//createpost
exports.createPost = (req, res, next) => {

  //console.log("image : ",req.body.image0 );
  //console.log("image 1: ",req.body.image1);
  //console.log("image 2: ",req.body.image2 );
  const url = req.protocol + '://' + req.get("host");
      const post = new Post({
        //basic car info
        city: req.body.city,
        make: req.body.make,
        model: req.body.model,
        registrationcity: req.body.registrationcity,
        mileage: req.body.mileage,
        exteriorcolor: req.body.exteriorcolor,
        description: req.body.description,
    
        //price
        price: req.body.price,
    
        //images
        imagePath: req.body.image0,
        imagePath1: req.body.image1,
        imagePath2: req.body.image2,
        //imagePath1:url + "/images/" + req.file.filename,
        //imagePath2:url + "/images/" + req.file.filename,
    
        month: new Date().getMonth(),
        //addition information
        enginetype: req.body.enginetype,
        enginecapacity: req.body.enginecapacity,
        transmission: req.body.transmission,
        assembly: req.body.assembly,
        features: req.body.features,
    
        //contact authInformation
        mobilenumber: req.body.mobilenumber,
        creator: req.userData.userId
      });

      post.save().then(createdPost => {
      console.log("here3")
    
        res.status(201).json({
          messgae: "Post Added Sucessfully",
    
    
          post:
          {
            ...createdPost,
            id: createdPost._id,
          }
        });
      }).catch(error => {
        //console.log("error:"+error)
        console.log("error msg"+error.message)
        res.status(500).json({
          
          messgae: "Creating Post Failed!"
        });
      }
      //);
   // }
    );

}


//update post

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post(
    {
      _id: req.body.id,
      city: req.body.city,
      make: req.body.make,
      model: req.body.model,
      registrationcity: req.body.registrationcity,
      mileage: req.body.mileage,
      exteriorcolor: req.body.exteriorcolor,
      description: req.body.description,
      price: req.body.price,
      imagePath: imagePath,
      enginetype: req.body.enginetype,
      enginecapacity: req.body.enginecapacity,
      transmission: req.body.transmission,
      assembly: req.body.assembly,
      features: req.body.features,
      mobilenumber: req.body.mobilenumber,
      creator: req.userData.userId
    });

  //console.log(post);
  Post.updateOne(
    {
      _id: req.params.id,
      creator: req.userData.userId
    },
    post).then(result => {
      //console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "update successfull!" });
      }
      else {
        res.status(401).json({ message: "Not Authorized" });
      }

    }).catch(error => {
      res.status(500).json(
        {
          message: "Couldn't Update Post "
        });
    });
}

//fetch single post
exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    //console.log(post);
    if (post) {
      res.status(200).json(post);
        }
    else {
      res.status(404).json({ message: 'Post not Found!' });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching Post Failed!"
    });
  });
}

//fetch all posts
exports.getPosts = (req, res, next) =>
 {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  Post.find()
  postQuery.then(documents => {
    fetchedPosts = documents
    return Post.count();

  }).then(count => {
    res.status(200).json(
      {
        messgae: "Posts Fetched Successfully",
        posts: fetchedPosts,
        maxPosts: count
      });
  }).catch(error => {
    res.status(500).json({
      message: "Fetching Post Failed!"
    })
  });
}

exports.getPosts = (req, res, next) =>
 {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  Post.find()
  postQuery.then(documents => {
    fetchedPosts = documents
    return Post.count();

  }).then(count => {
    res.status(200).json(
      {
        messgae: "Posts Fetched Successfully",
        posts: fetchedPosts,
        maxPosts: count
      });
  }).catch(error => {
    res.status(500).json({
      message: "Fetching Post Failed!"
    })
  });
}
exports.searchPosts = (req, res, next) => {
  //console.log("received", req.body);
  let count = 0;
  let condition;
  let index;
  let conditionMapping = {
    model: { model: new RegExp(req.body.model) },
    make: { make: new RegExp(req.body.make) },
    city: { city: new RegExp(req.body.city) },
    exteriorcolor: { exteriorcolor: new RegExp(req.body.exteriorcolor) },
  }
  if(req.body.price !== null) {
    conditionMapping = Object.assign({price : { price: { $lte: req.body.price.max === null ? 192910399392: req.body.price.max , $gte: req.body.price.min  }}}, conditionMapping);
  }
  //console.log("request", conditionMapping);
  Object.values(req.body).forEach((element, ind) => {
   // console.log("insidefirstloop", element);
    if(element !== null) {
     // console.log("elem", element);
      index = ind;
     // console.log("elemind", index);
      count++;
    }
  });


  if(count < 2) {
      condition = conditionMapping[Object.keys(req.body)[index]];
   //   console.log("iii", condition);
  } else if (count >= 2) {
    //console.log("insideelseif",count);
    let condArray = [];
    Object.values(req.body).forEach((element, ind) => {
      if(element !== null) {
        condArray.push(conditionMapping[Object.keys(req.body)[ind]])
      }
    //  console.log(condArray);
    });
    condition = {$and: condArray}
  }
 // console.log("final", { price: { $lte: req.body.price.max === null ? 192910399392: req.body.price.max , $gte: req.body.price.min }});
  Post.find(condition).then(documents => {
   // console.log("results", documents);
    fetchedPosts = documents
    return Post.count();
  }).then(count => {
    res.status(200).json(
      {
        messgae: "Posts Fetched Successfully",
        posts: fetchedPosts,
        maxPosts: count
      });
  }).catch(error => {
    //console.log(error);
    res.status(500).json({
      message: "Fetching Post Failed!"
    })
  });
}

exports.searchAllPosts = (req, res, next) => {
 // console.log("insideapi", req);
 // console.log("final", { price: { $lte: req.body.price.max === null ? 192910399392: req.body.price.max , $gte: req.body.price.min }});
  Post.find().then(documents => {
   // console.log("results", documents);
    fetchedPosts = documents
    return Post.count();
  }).then(count => {
    res.status(200).json(
      {
        messgae: "Posts Fetched Successfully",
        posts: fetchedPosts,
        maxPosts: count
      });
  }).catch(error => {
    //console.log("errttt", error);
    res.status(400).json({
      message: "Fetching Post Failed!"
    })
  });
}
exports.searchPostsByCond = (req, res, next) => {
  let condition;
  let conditionMapping = ['model', 'make', 'registrationcity', 'exteriorcolor'];

  const keys = Object.keys(req.body);
 // console.log("keys", keys);
  conditionMapping.forEach((element) => {
 // console.log("elem", element);
    if(keys.includes(element)){
 // console.log("value", req.body[element]);
      condition = { [element] : new RegExp(req.body[element])  }
    }
  });

  if(!condition) {
    res.status(400).json({
      message: "Bad Request Condition not found!"
    })
  }
 console.log("condition", condition);
 // console.log("final", { price: { $lte: req.body.price.max === null ? 192910399392: req.body.price.max , $gte: req.body.price.min }});
  Post.find(condition).then(documents => {
  //  console.log("results", documents);
    fetchedPosts = documents
    return Post.count();
  }).then(count => {
    res.status(200).json(
      {
        messgae: "Posts Fetched Successfully",
        posts: fetchedPosts,
        maxPosts: count
      });
  }).catch(error => {
   console.log("errttt", error);
    res.status(400).json({
      message: "Fetching Post Failed!"
    })
  });
}

    //fetch all posts
exports.getcnicNumber = (req,res) =>
{
  Post.findById(req.params.id).then(post => {
    //console.log(post);
    if (post) {
     // console.log(post);
      //res.status(200).json(post);
      User.find({_id: post.creator}).then(result =>
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
        }
      }).catch(error => {
        res.status(500).json({
          message: "Fetching Failed!"
        });
      });
    }

    exports.searchSinglePost = (req, res, next) => {
      Post.findById(req.body.searchId).then(post => {
        //console.log(post);
        if (post) {
          res.status(200).json(post);
            }
        else {
          res.status(404).json({ message: 'Post not Found!' });
        }
      }).catch(error => {
        res.status(500).json({
          message: "Fetching Post Failed!"
        });
      });
    }

    //this method was not pulled completely in the pull request thats why it was giving error next pull main complete pull ho jayega ye 
    //ni to code dy dun ga main ye connect ho gia hai and post single dekh rha hun thek hai yahan sy single fetch kr k ly gia agy kdr masla
    
    exports.getuserposts = (req,res) => 
    {
      Post.find({creator:req.params.id}).then((result) =>
  {
    if(result)
    {
      console.log("posts js :"+ result)
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


exports.image1 = (req,res) => 
{
  const url = req.protocol + '://' + req.get("host");
  const imagePath = url + "/images/" + req.file.filename;
  res.status(200).json(imagePath);
}

exports.image2 = (req,res) => 
{
  const url = req.protocol + '://' + req.get("host");
  const imagePath = url + "/images/" + req.file.filename;
  res.status(200).json(imagePath);
}

exports.image3 = (req,res) => 
{
  const url = req.protocol + '://' + req.get("host");
  const imagePath = url + "/images/" + req.file.filename;
  res.status(200).json(imagePath);
}