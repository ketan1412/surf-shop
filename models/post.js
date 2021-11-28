/*
Post
-title-string
-price-string
-description-string
-images-array of strings
-location-strings
-coordinate-Array
-author-object id (ref User)
-reviews-array of objects
*/
const mongoose=require('mongoose');
//const passportLocalMongoose=require('passport-local-mongoose');
const schema=mongoose.Schema;
const Review=require('./review');
const mongoosePaginate=require('mongoose-paginate');

const PostSchema=new schema({
    title: String,
    price: Number,
    description: String,
    images: [ {path: String, filename: String} ],
    location: String,
    geometry:{
        type: {
        type: String,
        enum: ['Point'],
        required: true
        },
        coordinates:{
            type: [Number],
            required: true
        }
    },
    properties:{
        description: String
    },
    author:{
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: schema.Types.ObjectId,
        ref: 'Review'
    }],
    avgRating: { type : Number, default : 0 }
});

PostSchema.pre('remove', async function(){
    await Review.remove({
        _id:{
            $in:this.reviews
        }
    });
});
PostSchema.methods.calculateAvgRating=function(){
    let ratingsTotal=0;
    if(this.reviews.length){
    this.reviews.forEach(review=> {
        ratingsTotal+=review.rating;
    });
    this.avgRating=Math.round((ratingsTotal/this.reviews.length)*10)/10;
    }else{
        this.avgRating=ratingsTotal;
    }
    const floorRating=Math.floor(this.avgRating);
    this.save();
    return floorRating;
}
//UserSchema.plugin(passportLocalMongoose);
PostSchema.plugin(mongoosePaginate);
PostSchema.index({ geometry:'2dsphere' });

module.exports=mongoose.model('Post', PostSchema);
