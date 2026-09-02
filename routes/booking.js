const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../views/middleware");
const bookingController = require("../controllers/bookings");

// 1. View all bookings page
router.get("/bookings", isLoggedIn, wrapAsync(bookingController.index));

// 2. Create booking post route
router.post("/listings/:id/bookings", isLoggedIn, wrapAsync(bookingController.createBooking));

module.exports = router;
