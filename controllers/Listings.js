
// const Listing = require("../models/Listing.js");

// // INDEX ROUTE (WITH SEARCH FILTER)
// // module.exports.index = async (req, res) => {
// //     try {
// //         let { search } = req.query;
// //         let allListings;

// //         if (search && search.trim() !== "") {
// //             search = search.trim();
// //             allListings = await Listing.find({
// //                 $or: [
// //                     { title: { $regex: search, $options: "i" } },
// //                     { location: { $regex: search, $options: "i" } },
// //                     { country: { $regex: search, $options: "i" } }
// //                 ]
// //             });
// //         } else {
// //             allListings = await Listing.find({});
// //         }

// //         res.render("listings/index", { allListings });
// //     } catch (err) {
// //         console.error("Error fetching listings:", err);
// //         req.flash("error", "Something went wrong!");
// //         res.redirect("/listings");
// //     }
// // };
// module.exports.index = async (req, res) => {
//     try {
//         let { search, category } = req.query;
//         let query = {};

//         if (search && search.trim() !== "") {
//             search = search.trim();
//             query.$or = [
//                 { title: { $regex: search, $options: "i" } },
//                 { location: { $regex: search, $options: "i" } },
//                 { country: { $regex: search, $options: "i" } }
//             ];
//         }

//         if (category) {
//             query.category = category;
//         }

//         let allListings = await Listing.find(query);
//         res.render("listings/index", { allListings });
//     } catch (err) {
//         console.error("Error fetching listings:", err);
//         req.flash("error", "Something went wrong!");
//         res.redirect("/listings");
//     }
// };
// module.exports.renderNewForm = (req, res) => {
//     res.render("listings/new.ejs");
// };

// module.exports.showListing = async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id)
//         .populate({
//             path: "reviews",
//             populate: {
//                 path: "author",
//             },
//         })
//         .populate("owner");

//     if (!listing) {
//         req.flash("error", "Listing you requested for does not exist!");
//         return res.redirect("/listings");
//     }

//     res.render("listings/show.ejs", { listing });
// };

// // CREATE LISTING (WITH LOCATIONIQ GEOCODING)
// module.exports.createListing = async (req, res) => {
//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;

//     // Image Handle
//     if (typeof req.file !== "undefined") {
//         let url = req.file.path;
//         let filename = req.file.filename;
//         newListing.image = { url, filename };
//     } else if (typeof req.body.listing.image === "string") {
//         newListing.image = {
//             filename: "listingimage",
//             url: req.body.listing.image,
//         };
//     }

//     // Geocoding via LocationIQ API
//     try {
//         const queryLocation = `${req.body.listing.location}, ${req.body.listing.country}`;
//         const mapToken = process.env.MAP_TOKEN;
//         const response = await fetch(
//             `https://api.locationiq.com/v1/search?key=${mapToken}&q=${encodeURIComponent(queryLocation)}&format=json`
//         );
//         const geoData = await response.json();

//         if (geoData && geoData.length > 0) {
//             newListing.geometry = {
//                 type: "Point",
//                 coordinates: [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)]
//             };
//         } else {
//             // Default: New Delhi
//             newListing.geometry = { type: "Point", coordinates: [77.2090, 28.6139] };
//         }
//     } catch (err) {
//         console.warn("Geocoding failed, setting default coordinates:", err);
//         newListing.geometry = { type: "Point", coordinates: [77.2090, 28.6139] };
//     }

//     await newListing.save();
//     req.flash("success", "New Listing Created!");
//     res.redirect("/listings");
// };

// module.exports.renderEditForm = async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     if (!listing) {
//         req.flash("error", "Listing you requested for does not exist!");
//         return res.redirect("/listings");
//     }
//     let originalImageUrl = listing.image.url;
//     originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
//     res.render("listings/edit", { listing, originalImageUrl });
// };

// // UPDATE LISTING (WITH GEOCODING UPDATE)
// module.exports.updateListing = async (req, res) => {
//     const { id } = req.params;

//     let listing = await Listing.findByIdAndUpdate(
//         id,
//         { ...req.body.listing },
//         { runValidators: true, returnDocument: "after" }
//     );

//     if (!listing) {
//         req.flash("error", "Listing not found!");
//         return res.redirect("/listings");
//     }

//     // Image Update Handle
//     if (typeof req.file !== "undefined") {
//         let url = req.file.path;
//         let filename = req.file.filename;
//         listing.image = { url, filename };
//     } else if (typeof req.body.listing.image === "string" && req.body.listing.image.trim() !== "") {
//         listing.image = {
//             filename: "listingimage",
//             url: req.body.listing.image,
//         };
//     }

//     // Update Geocoding Location
//     if (req.body.listing.location) {
//         try {
//             const queryLocation = `${req.body.listing.location}, ${req.body.listing.country || ''}`;
//             const mapToken = process.env.MAP_TOKEN;
//             const response = await fetch(
//                 `https://api.locationiq.com/v1/search?key=${mapToken}&q=${encodeURIComponent(queryLocation)}&format=json`
//             );
//             const geoData = await response.json();

//             if (geoData && geoData.length > 0) {
//                 listing.geometry = {
//                     type: "Point",
//                     coordinates: [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)]
//                 };
//             }
//         } catch (err) {
//             console.warn("Geocoding update failed:", err);
//         }
//     }

//     await listing.save();
//     req.flash("success", "Listing Updated!");
//     res.redirect(`/listings/${id}`);
// };

// module.exports.destroyListing = async (req, res) => {
//     const { id } = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);

//     if (!deletedListing) {
//         req.flash("error", "Listing not found!");
//         return res.redirect("/listings");
//     }

//     req.flash("success", "Listing Deleted!");
//     res.redirect("/listings");
// };
const Listing = require("../models/Listing.js");
const Booking = require("../models/booking.js"); // Booking model import karein

// INDEX ROUTE (WITH SEARCH FILTER)
module.exports.index = async (req, res) => {
    try {
        let { search, category } = req.query;
        let query = {};

        if (search && search.trim() !== "") {
            search = search.trim();
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } }
            ];
        }

        if (category) {
            query.category = category;
        }

        let allListings = await Listing.find(query);
        res.render("listings/index", { allListings });
    } catch (err) {
        console.error("Error fetching listings:", err);
        req.flash("error", "Something went wrong!");
        res.redirect("/listings");
    }
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// SHOW LISTING (FIXED: Populating Bookings and Users)
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    // Is listing ki saari bookings fetch karein aur user details populate karein
    const bookings = await Booking.find({ listing: id }).populate("user");

    res.render("listings/show.ejs", { listing, bookings });
};

// CREATE LISTING (WITH LOCATIONIQ GEOCODING)
module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    // Image Handle
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        newListing.image = { url, filename };
    } else if (typeof req.body.listing.image === "string") {
        newListing.image = {
            filename: "listingimage",
            url: req.body.listing.image,
        };
    }

    // Geocoding via LocationIQ API
    try {
        const queryLocation = `${req.body.listing.location}, ${req.body.listing.country}`;
        const mapToken = process.env.MAP_TOKEN;
        const response = await fetch(
            `https://api.locationiq.com/v1/search?key=${mapToken}&q=${encodeURIComponent(queryLocation)}&format=json`
        );
        const geoData = await response.json();

        if (geoData && geoData.length > 0) {
            newListing.geometry = {
                type: "Point",
                coordinates: [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)]
            };
        } else {
            // Default: New Delhi
            newListing.geometry = { type: "Point", coordinates: [77.2090, 28.6139] };
        }
    } catch (err) {
        console.warn("Geocoding failed, setting default coordinates:", err);
        newListing.geometry = { type: "Point", coordinates: [77.2090, 28.6139] };
    }

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit", { listing, originalImageUrl });
};

// UPDATE LISTING (WITH GEOCODING UPDATE)
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { runValidators: true, returnDocument: "after" }
    );

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // Image Update Handle
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    } else if (typeof req.body.listing.image === "string" && req.body.listing.image.trim() !== "") {
        listing.image = {
            filename: "listingimage",
            url: req.body.listing.image,
        };
    }

    // Update Geocoding Location
    if (req.body.listing.location) {
        try {
            const queryLocation = `${req.body.listing.location}, ${req.body.listing.country || ''}`;
            const mapToken = process.env.MAP_TOKEN;
            const response = await fetch(
                `https://api.locationiq.com/v1/search?key=${mapToken}&q=${encodeURIComponent(queryLocation)}&format=json`
            );
            const geoData = await response.json();

            if (geoData && geoData.length > 0) {
                listing.geometry = {
                    type: "Point",
                    coordinates: [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)]
                };
            }
        } catch (err) {
            console.warn("Geocoding update failed:", err);
        }
    }

    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};