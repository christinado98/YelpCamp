var mongoose = require("mongoose");

//Create a Schema for a campground
var campgroundShema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId, //embedding an ID
            ref: "Comment" //name of the model
        }
    ]
});

//Compile Schema into a model 
module.exports = mongoose.model("Campground", campgroundShema);
