
const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../views/middleware.js"); // ध्यान दें: अगर middleware का रास्ता सही है
const userController = require("../controllers/users.js");

router
.route("/signup")
.get( userController.renderSignForm)
.post( wrapAsync(userController.signup));

// Login Routes
router.route("/login")
.get(userController.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    userController.login
);

// Logout Route
router.get("/logout",userController.logout);


module.exports = router;