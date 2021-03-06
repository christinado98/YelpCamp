var express     = require("express"),
    router      = express.Router({mergeParams: true}), // access :id
    Campground  = require("../models/campground"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");

// Show the comment form, check if user is logged in before let user comment
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err || !foundCampground){
            req.flash("error", "Campground not existed!");
            console.log(err);
        }
        else{
            res.render("comments/new", {campground: foundCampground});
        }
    })
})

// Create a comment
router.post("/", middleware.isLoggedIn, function(req, res){
    // lookup camground using ID
    Campground.findById(req.params.id, function(err, campground){
        if (err || !campground){
            console.log(err);
            req.flash("error", "Campground not existed!");
            res.redirect("/camgrounds");
        }
        else{
            // create new comment
            Comment.create(req.body.comment, function(err, comment){
                if (err){
                    req.flash("error", "Something went wrong!");
                    console.log(err);
                }
                else{
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Sucessfully added a comment!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
});

// Show the comment edit form 
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err || !foundComment){
            req.flash("error", "Comment not existed!");
            res.render("back");
        }
        else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    })
});

// Update found comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err || !updatedComment){
            req.flash("error", "Comment not existed!");
            res.redirect("back");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// DELETE ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err){
            res.redirect("back");
        }
        else{
            req.flash("success", "Comment deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

module.exports = router;