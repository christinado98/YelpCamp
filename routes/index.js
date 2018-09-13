var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user"),
    async       = require("async"),
    nodemailer  = require("nodemailer"),
    crypto      = require("crypto");

router.get("/", function(req, res){
    res.render("landing");
});

// Show register form
router.get("/register", function(req, res){
    res.render("register", {page: "register"});
})

// Handling sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username + "!");
            res.redirect("/campgrounds");
        })
    });
})

// Show login form
router.get("/login", function(req, res){
    res.render("login", {page: "login"});
});

// Handing login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// LOG OUT ROUTE
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged You Out!");
    res.redirect("/campgrounds");
});

// FORGOT PASSWORD ROUTE
// Show the form when forgetting login password
router.get("/forgot", function(req, res){
    res.render("forgot");
});

// Handling forgotting password logic
router.post("/forgot", function(req, res, next){
    async.waterfall([
        // Create a random token sent as part of url 
        // for user that will expire
        function(done){
            crypto.randomBytes(20, function(err, buf){
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done){
            User.findOne({email: req.body.email}, function(err, user){
                if (!user){
                    req.flash("error", "No account with that email address exists.");
                    return res.redirect("/forgot");
                }
                
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000 // token will expirt in 1 hour
                
                user.save(function(err){
                    done(err, token, user);
                })
            })
        },
        function(token, user, done){
            // Creating servie to send an email to the user 
            var smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "christjna.do98@gmail.com",
                    pass: process.env.GMAILPW
                }
            });
            
            // Creating the body of the email being sent
            var mailOptions = {
                to: user.email,
                from: "christjna.do98@gmail.com",
                Subject: "YelpCamp Password Reset",
                text: "You are receiving this because you (or someone else) have requested the reset of your account password. " +
                        "Please click on the following link, or paste this into your browser to complete the process: " +
                        "http://" + req.headers.host + "/reset/" + token + "\n\n" +
                        "If you did not request this, please ignore this email and your password will remail unchanged."
            };
            
            // Finally send the email
            smtpTransport.sendMail(mailOptions, function(err){
                console.log("mail sent");
                req.flash("success", "An e-mail has been sent to " + req.body.email + " with further instructions.");
                done(err, "done");
            });
        }
    ], function(err){ // finally check for any error from the async waterfall
        if (err) return next(err);
        res.redirect("/forgot");
    });
});

module.exports = router;