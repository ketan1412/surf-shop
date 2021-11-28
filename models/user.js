/*
User
-email-string
-password-string
-username-string
-image-string
-posts-array of objects ref post
*/

const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
const schema=mongoose.Schema;

const UserSchema=new schema({
    email: { type: String, unique: true, required: true },
    image: {
        path:{type:String, default:'/images/default-profile.jpg'},
        filename: String
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date

});
UserSchema.plugin(passportLocalMongoose);


module.exports=mongoose.model('User', UserSchema);
