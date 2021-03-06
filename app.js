var express       = require("express"),
	app           = express(),
	bodyParser    = require("body-parser"),
	mongoose      = require("mongoose"),
	methodOverride= require("method-override"),
	Campground    = require("./models/campground"),
	Comment       = require("./models/comment");
	seedDB        = require("./seeds"),
	passport      = require("passport"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User                  = require("./models/user"),
	flash                = require("connect-flash");

//requiring routes
var commentRoutes    = require('./routes/comments'),
	campgroundRoutes = require('./routes/campgrounds'),
	indexRoutes 	 = require('./routes/index')

//mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect("mongodb+srv://dbUser:VFJa2GNW5!eURTi@cluster0-ud2ax.mongodb.net/yelp_camp?retryWrites=true&w=majority",{
	useNewUrlParser: true, useCreateIndex: true 
}).then(() =>{
	console.log('Connected to DB!');
}).catch(err =>{
	console.log('ERROR:',err.message);
});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // seed the database

//PASSPORT CONFIG
app.use(require("express-session")({
	secret:"Good Health Good Life",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error     = req.flash("error");
	res.locals.success   = req.flash("success");
	next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT ||  1331,()=>
{
	console.log("Yelp Camp Server Running on PORT: 1331");
});