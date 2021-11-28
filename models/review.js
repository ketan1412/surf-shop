/*
Review
-body-string
-author-object id (ref user)
*/
const mongoose=require('mongoose');
//const passportLocalMongoose=require('passport-local-mongoose');
const schema=mongoose.Schema;

const ReviewSchema=new schema({
    body: String,
    rating: Number,
    author:{
        type: schema.Types.ObjectId,
        ref: 'User'
    }
});
//UserSchema.plugin(passportLocalMongoose);


module.exports=mongoose.model('Review', ReviewSchema);
