const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../views/middleware");
const bookingController = require("../controllers/bookings");

router.post("/", isLoggedIn, wrapAsync(bookingController.createBooking));router.get("/", isLoggedIn, wrapAsync(async (req, res) => {
    let allBookings = await Booking.find({}).populate("listing");
    res.render("bookings/index.ejs", { allBookings });
}));

module.exports = router;