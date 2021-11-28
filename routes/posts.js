const express=require('express');
const router=express.Router();
const multer=require('multer');
//const upload=multer({'dest':'uploads/'});
const { storage }=require('../cloudinary');
const upload=multer({ storage });
const { asyncErrorHandler, isLoggedIn, isAuthor, searchAndFilterPosts }=require('../middleware');
const { postIndex, postNew, postCreate, postShow, postEdit, postUpdate, postDestroy }=require('../controllers/posts');

/*Get posts page */
router.get('/', asyncErrorHandler(searchAndFilterPosts), asyncErrorHandler(postIndex));

/*Get posts new /posts/new */
router.get('/new', isLoggedIn, postNew);

/*Post posts create /posts */
router.post('/', isLoggedIn, upload.array('images',4), asyncErrorHandler(postCreate));

/*Get posts show /posts/:id */
router.get('/:id', asyncErrorHandler(postShow));

/*Get posts edit /posts/edit/:id */
router.get('/:id/edit', isLoggedIn, asyncErrorHandler(isAuthor), postEdit);

/*Put posts update /posts/:id */
router.put('/:id', isLoggedIn, asyncErrorHandler(isAuthor), upload.array('images',4), asyncErrorHandler(postUpdate));

/*Delete posts destroy /posts/:id */
router.delete('/:id', isLoggedIn, asyncErrorHandler(isAuthor), asyncErrorHandler(postDestroy));

module.exports=router; 