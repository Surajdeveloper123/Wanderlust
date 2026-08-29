
require("dotenv").config();

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


// ==========================================
// MongoDB
// ==========================================

//const MONGO_URL =
  //  "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl= process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dbUrl);
}


main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error(
            "MongoDB Connection Error:",
            err
        );
    });


// ==========================================
// App Configuration
// ==========================================

app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);

app.engine("ejs", ejsMate);


// ==========================================
// Middleware
// ==========================================

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json());

app.use(
    methodOverride("_method")
);

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);



const store =   MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: " mysupersecretcode",
    },
    touchAfter: 24*3600,
});

store.on("error", ()=>{
    console.log("ERROR in mongo session store", err);
});

const sessionOptions = {
         store,
    secret:
        process.env.SESSION_SECRET ||
        "mysupersecretcode",

    resave: false,

    saveUninitialized: true,

    cookie: {

        expires:
            new Date(
                Date.now() +
                7 * 24 * 60 * 60 * 1000
            ),

        maxAge:
            7 * 24 * 60 * 60 * 1000,

        httpOnly: true
    }
};



app.use(
    session(sessionOptions)
);

app.use(flash());


// ==========================================
// Passport
// ==========================================

app.use(
    passport.initialize()
);

app.use(
    passport.session()
);


passport.use(
    new LocalStrategy(
        User.authenticate()
    )
);


passport.serializeUser(
    User.serializeUser()
);

passport.deserializeUser(
    User.deserializeUser()
);


// ==========================================
// Global Locals
// ==========================================

app.use(
    (req, res, next) => {

        res.locals.success =
            req.flash("success");

        res.locals.error =
            req.flash("error");

        res.locals.currUser =
            req.user || null;

        next();
    }
);


// ==========================================
// Root
// ==========================================

//app.get("/", (req, res) => {

 //   res.send(
   //     "Hi, I am Root"
 //   );

//});


// ==========================================
// Routes
// ==========================================

app.use(
    "/listings",
    listings
);


app.use(
    "/listings/:id/reviews",
    reviews
);


app.use(
    "/",
    userRouter
);


// ==========================================
// 404
// ==========================================

app.use(
    (req, res, next) => {

        if (
            req.originalUrl ===
            "/favicon.ico" ||

            req.originalUrl.endsWith(
                ".map"
            )
        ) {

            return res
                .status(204)
                .end();
        }


        next(
            new ExpressError(
                404,
                "Page Not Found!"
            )
        );
    }
);


// ==========================================
// Error Handler
// ==========================================

app.use(
    (err, req, res, next) => {

        const {
            statusCode = 500,
            message =
                "Something went wrong!"
        } = err;


        console.error(
            `${statusCode}: ${message}`
        );


        res
            .status(statusCode)
            .send(message);
    }
);


// ==========================================
// Server
// ==========================================

const PORT =
    process.env.PORT || 8080;


app.listen(
    PORT,
    () => {

        console.log(
            `Server is listening on port ${PORT}`
        );

    }
);