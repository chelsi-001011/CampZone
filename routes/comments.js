var express = require("express");
var router = express.Router({mergeParams : true});
//mergerParams makes the routes merge from app.js providing with id in following req
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");//this will automatically get the index.js file from middleware folder

//Comments new
router.get("/new",middleware.isLoggedIn,function(req,res){
	//find campground by if
	Campground.findById(req.params.id,(err,campground)=>{
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{campground:campground});
		}
	})
	// res.render("comments/new");
});

//Comments create
router.post("/",middleware.isLoggedIn,(req,res)=>{
	//lookup campground using ID
	Campground.findById(req.params.id,(err,campground)=>{
		if(err){
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment,(err,comment)=>{
				if(err){
					req.flash("error","Something went wrong");
					console.log(err);
				}else{
					//add username and id to comment
					comment.author.id =req.user._id;
					comment.author.username =req.user.username;
					//savecomment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					console.log(comment);
					req.flash("success","Successfully added comment");
					res.redirect('/campgrounds/' + campground._id);
				}
			});
	// create new comment
	//connect the new comment to campgrounds
	//redirect to campgrounds show page
		}
	});
});
//COMMENTS EDIT ROUTE
router.get("/:comment_id/edit",middleware.checkCommentOwnership,(req,res)=>{
	Comment.findById(req.params.comment_id,(err,foundComment)=>{
		if(err){
			res.redirect("back");
		}else{
		res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});	
		}
	});
	
});

//COMMENTS UPDATE ROUTE
router.put("/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,updatedComment)=>{
		if(err){
			res.redirect("back");
			console.log(err);
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DELETE COMMENT ROUTE
router.delete("/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success","Comment deleted");
			res.redirect("/campgrounds/"+ req.params.id);
		}
	});
});




module.exports = router;