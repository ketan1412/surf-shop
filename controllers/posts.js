const Post=require('../models/post');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary }=require('../cloudinary');

module.exports={
    async postIndex(req,res,next){
        const { dbQuery }=res.locals;
        delete res.locals.dbQuery;
        let posts=await Post.paginate(dbQuery, {
            page: req.query.page || 1,
            limit: 10,
            sort: '-_id'
        });
        posts.page=Number(posts.page);
        if(!posts.docs.length && res.locals.query){
            res.locals.error='No results match that query';
        }
        res.render('posts/index',{ posts, mapBoxToken: mapBoxToken, title:'Post Index'});
    },

    postNew(req,res,next){
        res.render('posts/new');
    },

    async postCreate(req,res,next){
        req.body.post.images=[];
        for(const file of req.files){
//            let image=await cloudinary.v2.uploader.upload(file.path);
            req.body.post.images.push({
                path: file.path,
                filename:file.filename
            });
        }
        let response= await geocodingClient.forwardGeocode({
            query: req.body.post.location,
            limit: 1
        })
        .send();
    
        req.body.post.geometry=response.body.features[0].geometry;
        req.body.post.author=req.user._id;
        let post = new Post(req.body.post);
		post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
		await post.save();
        req.session.success='Post created successfully!';
        res.redirect(`/posts/${post.id}`);
    },

    async postShow(req,res,next){
        let post=await Post.findById(req.params.id).populate({
            path: 'reviews',
            options: { sort:{ '_id': -1} },
            populate: {
                path: 'author',
                model: 'User'
            }
        });
        //const floorRating=post.calculateAvgRating();
        const floorRating=post.avgRating;
        res.render('posts/show', { post, mapBoxToken: mapBoxToken, Rating: floorRating });
    },

    postEdit(req,res,next){
        res.render('posts/edit');
    },

    async postUpdate(req,res,next){

        const { post }= res.locals;

        if(req.body.deleteImages && req.body.deleteImages.length){
            let deleteImages=req.body.deleteImages;
            for(const filename of deleteImages){
                await cloudinary.uploader.destroy(filename);

                for(const image of post.images){
                    if(image.filename===filename){
                        let index=post.images.indexOf(image);
                        post.images.splice(index,1);
                    }
                }
            }
        }
        if(req.files){
            for(const file of req.files){
//                let image=await cloudinary.v2.uploader.upload(file.path);
                post.images.push({
                    path: file.path,
                    filename: file.filename
                });
            }
        }
        if(req.body.post.location!==post.location){
            let response= await geocodingClient.forwardGeocode({
                query: req.body.post.location,
                limit: 1
            })
            .send();
            post.geometry=response.body.features[0].geometry;
            post.location=req.body.post.location;
        }

        post.title=req.body.post.title;
        post.description=req.body.post.description;
        post.price=req.body.post.price;
        post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
        
        await post.save();

        res.redirect(`/posts/${post.id}`);
    },

    async postDestroy(req,res,next){
        const { post }=res.locals;
        for(const image of post.images){
            await cloudinary.uploader.destroy(image.filename);
        }
        await post.remove();
        req.session.success='Post deleted successfully';
        res.redirect('/posts');
    }
}