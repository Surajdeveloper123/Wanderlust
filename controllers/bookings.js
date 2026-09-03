const Booking = require("../models/booking");
const Listing = require("../models/Listing");

// MY BOOKINGS INDEX ROUTE
module.exports.index = async (req, res) => {
    try {
        const allBookings = await Booking.find({ user: req.user._id }).populate("listing");
        res.render("bookings/index.ejs", { allBookings });
    } catch (err) {
        console.error("Error fetching user bookings:", err);
        req.flash("error", "Could not load your bookings!");
        res.redirect("/listings");
    }
};

// CREATE BOOKING
module.exports.createBooking = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    let { fromDate, toDate } = req.body.booking;
    let start = new Date(fromDate);
    let end = new Date(toDate);

    let diffTime = end - start;
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0 || isNaN(diffDays)) {
        req.flash("error", "Invalid check-in or check-out dates!");
        return res.redirect(`/listings/${id}`);
    }

    let totalPrice = diffDays * listing.price;

    let newBooking = new Booking(req.body.booking);
    newBooking.user = req.user._id;
    newBooking.listing = id;
    newBooking.totalPrice = totalPrice;

    listing.bookings.push(newBooking._id);

    await newBooking.save();
    await listing.save();

    req.flash("success", "New booking confirmed!");
    res.redirect(`/listings/${id}`);
};
