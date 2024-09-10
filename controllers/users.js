const User = require("../models/user");

//signupform
module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

//signup
module.exports.signup = async(req,res)=>{
    try{
        let { username, email, password} = req.body;
        const newUser = new User({ email, username});
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser,(err)=>{
            if(err){
                return next(err);
            }req.flash("success", "welcome to your journey");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

//loginform//
module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
};

//login//
module.exports.login = async(req,res)=>{
    req.flash("success",'welcome back to your-journey ');
    let redirectUrl = res.locals.redirectUrl || "/listings"  //redirect listings page
    res.redirect(redirectUrl)
};

//logout//
module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
          return next(err);
        }req.flash("succes", "You are logged out!");
        res.redirect("/listings");
    })
}