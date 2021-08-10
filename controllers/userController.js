const User = require('../models/user')
module.exports.getSignup = (req,res)=>{
    res.render('users/register')
};

module.exports.createUser = async(req,res)=>{
    try{
    const{email,username,password}=req.body
    const newUser = new User({
        username,
        email
    })

   const user =  await User.register(newUser,password)
    req.login(user,()=>{
    req.flash('success','Congrats! You are registered')
    res.redirect('/campgrounds')

   })

   //console.log(regUser)
}catch(e){
    req.flash('error',e.message);
    res.redirect('/register')
}

}

module.exports.getLogin = (req,res)=>{
    res.render('users/login')
}

module.exports.allowLogin =(req,res)=>{
    const redirectUrl = req.session.returnTo || '/campgrounds'
    req.flash('success',"Welcome Back")
    //console.log(redirectUrl)
    delete req.session.returnTo
    res.redirect(redirectUrl)

}

module.exports.logout = (req,res)=>{
    req.logout()
    req.flash("success",'Goodbye !')
    res.redirect('/campgrounds')
}