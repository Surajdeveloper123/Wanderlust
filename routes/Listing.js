
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/Listing.js");
const {isLoggedIn, isOwner,validateListings}= require("../views/middleware.js");
const listingController = require("../controllers/Listings.js");

// ✅ SAHI
const multer = require("multer"); 
const { storage } = require("../cloudConfig.js"); // (ya jo bhi aapka path ho)
const upload = multer({ storage });

router
.route("/")
.get( wrapAsync( listingController.index))
.post( isLoggedIn ,upload.single('listing[image]'),validateListings,
wrapAsync(listingController.createListing));



// ==========================================
// 2. New Route h
// ==========================================
router.get("/new", isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(
    
    wrapAsync(listingController.showListing) 
)
.put(
     isLoggedIn,isOwner,upload.single('listing[image]'),
    validateListings,
    wrapAsync(listingController.updateListing)
)
.delete(
     isLoggedIn,isOwner,
    wrapAsync(listingController.destroyListing)
);


// ==========================================
// 5. Edit Route
// ==========================================
router.get(
    "/:id/edit",isLoggedIn,isOwner,
    wrapAsync(listingController.renderEditForm)
);



module.exports = router;