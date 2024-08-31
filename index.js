const express = require('express')
const cors = require('cors');
const server = express()
const mongoose = require("mongoose")
const { User } = require('./model/User')
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken');
const cokkieExtractor = require('./services/Common')
const { isAuth } = require('./services/Common')
const { sanitizeUser } = require('./services/Common')
const productRouter = require('./routes/Products')
const userRouter = require("./routes/User")
const authRouter = require("./routes/Auth")
const cartRouter = require('./routes/Cart');
const orderRouter = require('./routes/Order');
const cookieParser = require('cookie-parser');


//PASSPORT 
server.use(express.static('build'))
server.use(cookieParser())


server.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
server.use(passport.authenticate('session'));

//JWT 
const SECRET_KEY = 'SECRET_KEY'

var opts = {}
opts.jwtFromRequest = cokkieExtractor
opts.secretOrKey = SECRET_KEY;



//Middleware

server.use(cors());
server.use(express.json())
server.use('/products', productRouter.router)
server.use('/users', userRouter.router)
server.use('/auth', authRouter.router)
server.use('/cart', cartRouter.router);
server.use('/order', orderRouter.router);


// PASSPORT STRATEGY
passport.use('local', new LocalStrategy(
    { usernameField: 'email' },
    async function (email, password, done) {
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                return done(null, false, { message: "No such user" });
            }

            const storedPasswordBuffer = Buffer.from(user.password, 'hex');
            const saltBuffer = Buffer.from(user.salt, 'hex');

            crypto.pbkdf2(password, saltBuffer, 310000, 32, 'sha256', 
                function (err, hashedPassword) {
                    if (err) {
                        return done(err);
                    }
                    if (!crypto.timingSafeEqual(storedPasswordBuffer, hashedPassword)) {
                        return done(null, false, { message: 'Invalid Credentials' });
                    }
                    const sanitizedUser = sanitizeUser(user);
                    const token = jwt.sign(sanitizedUser, SECRET_KEY);
                    return done(null, { ...sanitizedUser, token }); // Return both the user and token
                });
        } catch (err) {
            return done(err);
        }
    }
));



// JWT STRATEGY
passport.use('jwt', new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
        const user = await User.findById(jwt_payload.id);  // Ensure this matches how you store the user's ID
        if (user) {
            return done(null, sanitizeUser(user));
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
}));



passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, { id: user.id, role: user.role });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});





const main = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log("Database Connected")
}
main().catch(err => console.log(err))

server.get('/', (req, res) => {
    res.json({ Status: "Success" })
})


server.listen(8080, () => {
    console.log('Server Started')
})