//====================
// CAMPGROUND ROUTES
//====================

var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware");

// INDEX: show all the campgrounds from DB 
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        }
        else{ 
            res.render("campgrounds/index", {campgrounds: allCampgrounds, page: "campgrounds"}); 
        }
    });
});

// CREATE: create a new campground
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
        var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: description, author: author};
    //Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if (err){
            console.log(err);
        }
        else{ // redirect back to campgrounds page
            res.redirect("/campgrounds"); 
        }
    });
});

// NEW: show the form to create a new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
})

// SHOW: show more info about one campground
router.get("/:id", function(req, res){
    //Find the campground with the provided ID, populate all the comments associated
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if (err || !foundCampground){
           console.log(err);
           req.flassh("error", "Campground not existed!");
           return res.redirect("/campgrounds");
       } 
       else{
            //Render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
       }
    });
});

// EDIT ROUTE: show the form to edit
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err || !foundCampground){
            req.flash("error", "Campground not existed!");
        }
        res.render("campgrounds/edit", {campground: foundCampground});
        });
});

// UPDATE ROUTE: update the correct campground and redirect to its showpage
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if (err || !updatedCampground){
            req.flash("error", "Campground not existed!");
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// DESTROY ROUTE: Deleting a campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    })
});

module.exports = router;