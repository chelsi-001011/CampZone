var express = require("express");
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require("../middleware");//this will automatically get the index.js file from middleware folder

router.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});
//INDEX - show all campgrounds
router.get("/",(req,res)=>{
	
	//GET all campgrounds from DB
	Campground.find({},function(err,allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			 res.render("campgrounds/index",{campgrounds:allCampgrounds});
		}
	});
});
//CREATE - add new campgrounds to DB
router.post("/",middleware.isLoggedIn,(req,res)=>{
	var author ={
		id:req.user._id,
		username:req.user.username
	}
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var price = req.body.price;
	var newCampground = {name:name,price:price, image:image,description:desc,author:author};

router.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
});

	//Create a new campground and save to DB
	Campground.create(newCampground,(err,newlyCreated)=>{
		if(err){
			console.log(err);
		}
		else{
			//redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
});


//NEW - show form to create new campground
router.get("/new",middleware.isLoggedIn,(req,res)=>{
	res.render("campgrounds/new");
});
//SHOW - shows more info about one campground
router.get("/:id",(req,res)=>{
	//find the campground with the provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}
		else{
			//render show template with that campground
	res.render("campgrounds/shows",{campground:foundCampground});
		}
	});
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,(req,res)=>{
	
	Campground.findById(req.params.id,(err,foundCampground)=>{
		res.render("campgrounds/edit",{campground:foundCampground});
	});
});
//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,updatedCampground)=>{
		if(err){
			console.log("/campgrounds");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
	Campground.findByIdAndRemove(req.params.id,(err)=>{
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds");
		}
	});
});



module.exports = router;