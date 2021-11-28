const express=require('express');
const router=express.Router({mergeParams:true});
const { asyncErrorHandler, isReviewAuthor }=require('../middleware');
const { reviewCreate, reviewUpdate, reviewDestroy }=require('../controllers/reviews');

// /*Get reviews index /posts/:id/reviews */
// router.get('/', (req,res,next)=>{
//     res.send('/reviews');
// });

// /*Get reviews new /reviews/new */
// router.get('/new', (req,res,next)=>{
//     res.send('/reviews/new');
// });

/*Post reviews create /reviews */
router.post('/', asyncErrorHandler(reviewCreate));

// /*Get reviews show /posts/:id/reviews/:review_id */
// router.get('/:id', (req,res,next)=>{
//     res.send('SHOW /reviews');
// });

// /*Get reviews edit /posts/:id/reviews/:review_id/edit */
// router.get('/:id/edit', (req,res,next)=>{
//     res.send('EDIT /reviews/:id/edit');
// });

/*Put reviews uddate /posts/:id/reviews/:review_id */
router.put('/:review_id', isReviewAuthor, asyncErrorHandler(reviewUpdate));

/*Delete reviews destroy /posts/:id/reviews/:review_id */
router.delete('/:review_id', isReviewAuthor ,asyncErrorHandler(reviewDestroy));

module.exports=router; 