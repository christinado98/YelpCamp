// ALL MIDDLEWARE GOES HERE 

var Campground = require("../models/campground"),
    Comment     = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        // does user own the campground?
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err || !foundCampground){
                console.log(err);
                req.flass("error", "Campground not existed!");
                res.redirect("back");
            }   
            else {
                // does user own campground? 
                if (foundCampground.author.id.equals(req.user._id)){
                    next(); // if so then move on to the next logic
                }
                else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back"); // back to where user previously came from
    }  
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    // is user logged in?
    if (req.isAuthenticated()){
        // does user own the comment?
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err || !foundComment){
                console.log(err);
                req.flash("error", "Comment not existed!");
                res.redirect("back");
            }   
            else {
                // does user own comment? 
                if (foundComment.author.id.equals(req.user._id)){
                    next(); // if so then move on to the next logic
                }
                else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                } 
            }
        });
    }
    else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back"); // back to where user previously came from
    }  
}

middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    // flash message before redirect
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}

module.exports = middlewareObj;
