const passport = require('passport')

exports.isAuth = (req, res, done) =>  {
    return passport.authenticate('jwt')
}


exports.sanitizeUser = (user) => {
    return({id:user.id ,  email: user.email, role:user.role})
}

exports.cokkieExtractor = function(req){
    let token = null ; 
    if(req && req.cookies)
    {
        token = req.cookies['jwt']
    }
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Yzk5YmFkMmQ1MjNlNThhNDI1ZTQ1OSIsImVtYWlsIjoicm9uQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzI0OTEwNjkwfQ.gDCSmR2P1KnCv5zol01AdC73E-eU0l5VN_iTU3MyoI8"
    return token
}