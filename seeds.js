var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");

// Define an array of sample campgrounds   
var data = [
    {
        name: "Cloud's Rest", 
        image: "https://images.unsplash.com/photo-1533414417583-f0ab99151186?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9d51581db2684ded44ce707c3b86fc5c&auto=format&fit=crop&w=500&q=60",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
    },
    
    {
        name: "Dessert Mesa", 
        image: "https://images.unsplash.com/photo-1467357689433-255655dbce4d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e3a52ebf4c24dc78e2af5bd8ab31ef5c&auto=format&fit=crop&w=500&q=60",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
    },
    
    {
        name: "The Canyon Floor", 
        image: "https://images.unsplash.com/photo-1517807289433-f0282e362596?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a93e785ae9dbb13f0b20f0c8ecfb294a&auto=format&fit=crop&w=500&q=60",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
    }
]
    
function seedDB(){
    // Remove all campgrounds
    Campground.remove({}, function(err){
        if (err){
            console.log(err);
        }
        else{
            console.log("removed campgrounds");
            // Add a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if (err){
                        console.log(err);
                    }
                    else{
                        console.log("added a campground!");
                        // Create a comment for each campground
                        Comment.create(
                            {
                                text: "This place is great but I wish there's Wifi",
                                author: "Homer"
                            }, function(err, comment){
                                if (err){
                                    console.log(err);
                                }
                                else{
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment")
                                }
                            })
                    }
                })
            })
        }
    }) 
}

module.exports = seedDB; //send function out  
