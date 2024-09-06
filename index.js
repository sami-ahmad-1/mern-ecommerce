// const express = require('express');
// require('dotenv').config()
// const cors = require('cors');
// const server = express();
// const mongoose = require("mongoose");
// const { User } = require('./model/User');
// const passport = require('passport');
// const session = require('express-session');
// const LocalStrategy = require('passport-local').Strategy;
// const crypto = require('crypto');
// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
// const jwt = require('jsonwebtoken');
// const cookieExtractor = require('./services/Common');
// const { isAuth } = require('./services/Common');
// const { sanitizeUser } = require('./services/Common');
// const productRouter = require('./routes/Products');
// const userRouter = require("./routes/User");
// const authRouter = require("./routes/Auth");
// const cartRouter = require('./routes/Cart');
// const orderRouter = require('./routes/Order');
// const cookieParser = require('cookie-parser');
// const MongoStore = require('connect-mongo');
// const path = require('path');

// // PASSPORT 
// server.use(express.static(path.resolve(__dirname,'build')));
// server.use(cookieParser());

// server.use(session({
//     secret:process.env.SESSION_KEY ,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL}),
//     cookie: {
//         maxAge: 24 * 60 * 60 * 1000 // 24 hours
//     }
// }));

// server.use(passport.authenticate('session'));

// // JWT 


// var opts = {};
// opts.jwtFromRequest = cookieExtractor;
// opts.secretOrKey = process.env.JWT_SECRET_KEY;

// // Middleware
// server.use(cors());
// server.use(express.json());
// server.use('/products', productRouter.router);
// server.use('/users', userRouter.router);
// server.use('/auth', authRouter.router);
// server.use('/cart', cartRouter.router);
// server.use('/order', orderRouter.router);

// // PASSPORT STRATEGY
// passport.use('local', new LocalStrategy(
//     { usernameField: 'email' },
//     async function (email, password, done) {
//         try {
//             const user = await User.findOne({ email: email });
//             if (!user) {
//                 return done(null, false, { message: "No such user" });
//             }

//             const storedPasswordBuffer = Buffer.from(user.password, 'hex');
//             const saltBuffer = Buffer.from(user.salt, 'hex');

//             crypto.pbkdf2(password, saltBuffer, 310000, 32, 'sha256', function (err, hashedPassword) {
//                 if (err) {
//                     return done(err);
//                 }
//                 if (!crypto.timingSafeEqual(storedPasswordBuffer, hashedPassword)) {
//                     return done(null, false, { message: 'Invalid Credentials' });
//                 }
//                 const sanitizedUser = sanitizeUser(user);
//                 const token = jwt.sign(sanitizedUser, process.env.JWT_SECRET_KEY);
//                 return done(null, { ...sanitizedUser, token });
//             });
//         } catch (err) {
//             return done(err);
//         }
//     }
// ));

// passport.use('jwt', new JwtStrategy(opts, async function (jwt_payload, done) {
//     try {
//         const user = await User.findById(jwt_payload.id);
//         if (user) {
//             return done(null, sanitizeUser(user));
//         } else {
//             return done(null, false);
//         }
//     } catch (err) {
//         return done(err, false);
//     }
// }));

// passport.serializeUser(function (user, cb) {
//     process.nextTick(function () {
//         return cb(null, { id: user.id, role: user.role });
//     });
// });

// passport.deserializeUser(function (user, cb) {
//     process.nextTick(function () {
//         return cb(null, user);
//     });
// });

// // PAYMENT INSTANCE 
// const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);

// server.post("/create-payment-intent", async (req, res) => {
//     const { totalPrice } = req.body;
//     const paymentIntent = await stripe.paymentIntents.create({
//         amount: totalPrice * 100,
//         currency: "usd",
//         automatic_payment_methods: {
//             enabled: true,
//         },
//     });

//     res.send({
//         clientSecret: paymentIntent.client_secret,
//         dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
//     });
// });

// const main = async () => {
//     await mongoose.connect(process.env.MONGODB_URL);
//     console.log("Database Connected");
// }
// main().catch(err => console.log(err));

// server.get('/', (req, res) => {
//     res.json({ Status: "Success" });
// });
// server.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
//   });
// server.listen(process.env.PORT, () => {
//     console.log('Server Started');
// });



const express = require('express');
require('dotenv').config();
const cors = require('cors');
const server = express();
const mongoose = require('mongoose');
const { User } = require('./model/User');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const cookieExtractor = require('./services/Common');
const { isAuth } = require('./services/Common');
const { sanitizeUser } = require('./services/Common');
const productRouter = require('./routes/Products');
const userRouter = require('./routes/User');
const authRouter = require('./routes/Auth');
const cartRouter = require('./routes/Cart');
const orderRouter = require('./routes/Order');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const path = require('path');

// Static Files
server.use(express.static(path.resolve(__dirname, 'build')));
server.use(cookieParser());

// Session Configuration
server.use(
    session({
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
        cookie: {
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
    })
);

// Passport Authentication
server.use(passport.authenticate('session'));

// JWT Strategy Configuration
var opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;

// Middleware
server.use(cors());
server.use(express.json());
server.use('/products', productRouter.router);
server.use('/users', userRouter.router);
server.use('/auth', authRouter.router);
server.use('/cart', cartRouter.router);
server.use('/order', orderRouter.router);

// Passport Local Strategy for Login
passport.use(
    'local',
    new LocalStrategy({ usernameField: 'email' }, async function (email, password, done) {
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                return done(null, false, { message: 'No such user' });
            }

            const storedPasswordBuffer = Buffer.from(user.password, 'hex');
            const saltBuffer = Buffer.from(user.salt, 'hex');

            crypto.pbkdf2(password, saltBuffer, 310000, 32, 'sha256', function (err, hashedPassword) {
                if (err) {
                    return done(err);
                }
                if (!crypto.timingSafeEqual(storedPasswordBuffer, hashedPassword)) {
                    return done(null, false, { message: 'Invalid Credentials' });
                }
                const sanitizedUser = sanitizeUser(user);
                const token = jwt.sign(sanitizedUser, process.env.JWT_SECRET_KEY);
                return done(null, { ...sanitizedUser, token });
            });
        } catch (err) {
            return done(err);
        }
    })
);

// JWT Strategy
passport.use(
    'jwt',
    new JwtStrategy(opts, async function (jwt_payload, done) {
        try {
            const user = await User.findById(jwt_payload.id);
            if (user) {
                return done(null, sanitizeUser(user));
            } else {
                return done(null, false);
            }
        } catch (err) {
            return done(err, false);
        }
    })
);

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

// Payment Integration (Stripe)
const stripe = require('stripe')(process.env.STRIPE_SERVER_KEY);

server.post('/create-payment-intent', async (req, res) => {
    try {
        const { totalPrice } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalPrice * 100, // Stripe requires the amount in cents
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
            dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
        });
    } catch (err) {
        console.error('Error creating payment intent:', err);
        res.status(500).json({ message: 'Payment intent creation failed' });
    }
});

// Database Connection
const main = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database Connected');
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1); // Exit if database connection fails
    }
};

main();

// Root Route
server.get('/', (req, res) => {
    res.json({ Status: 'Success' });
});

// Catch-All Route for React Frontend
server.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

// Start the Server
server.listen(process.env.PORT || 8080, () => {
    console.log('Server Started on Port', process.env.PORT);
});
