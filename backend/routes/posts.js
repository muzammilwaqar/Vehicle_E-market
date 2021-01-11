const express  = require("express");
//const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const multiupload = require('../middleware/upload');
//const { title } = require("process");
const router = express.Router();
const PostController = require("../controllers/posts");
const SearchController = require("../controllers/posts");





router.post("",checkAuth,  PostController.createPost);
//router.post("",checkAuth, PostController.createPost);

router.get('/',PostController.getPosts);



//multiple image sequence
router.post("/image1",extractFile,PostController.image1);
router.post("/image2",extractFile,PostController.image2);
router.post("/image3",extractFile,PostController.image2);


//router.patch can also be used to patch only updated data and put can be used to full change data

router.put("/:id",checkAuth,extractFile,PostController.updatePost);

router.get("/cnic/:id",PostController.getcnicNumber);
router.delete("/delete/:id",PostController.deletePost)
router.get('/:id',PostController.getPost);
router.post('/view/:id',PostController.getPost);

router.post('/search', SearchController.searchPosts);

router.get('/searchAll', PostController.searchAllPosts);

router.post('/searchPost', SearchController.searchSinglePost);

router.post('/searchPostByCond', SearchController.searchPostsByCond);

router.get('/userposts/:userid',PostController.getuserposts);

module.exports = router;
