const Post=require('../models/post');
const Review=require('../models/review');

module.exports={
    //Reviews Create
    async reviewCreate(req,res,next){
        let post=await (await Post.findById(req.params.id)).populate('reviews').execPopulate();
        let haveReviewed=post.reviews.filter(review=>{
            return review.author.equals(req.user._id);
        }).length;
        if(haveReviewed){
            req.session.error='Sorry, you can only create one review per post';
            return res.redirect(`/posts/${post.id}`);
        }
        //create the review
        req.body.review.author=req.user._id;
        let review=await Review.create(req.body.review);
        post.reviews.push(review);
        await post.save();
        req.session.success="Review created successfully";
        res.redirect(`/posts/${post.id}`);
    },
    //Review Update
    async reviewUpdate(req,res,next){
        await Review.findByIdAndUpdate(req.params.review_id, req.body.review);
        req.session.success='Review updated successfully';
        res.redirect(`/posts/${req.params.id}`);
    },
    //Review Destroy
    async reviewDestroy(req,res,next){
        await Post.findByIdAndUpdate(req.params.id,{
            $pull:{reviews:req.params.review_id}
        });
        await Review.findByIdAndRemove(req.params.review_id);
        req.session.success='Review deleted successfully';
        res.redirect(`/posts/${req.params.id}`);
    }
}