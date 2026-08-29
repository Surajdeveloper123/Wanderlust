/*
const Joi = require("joi");
const mongoose = require("mongoose");
const Schema =mongoose.Schema;
const Review = require("./review.js");

const listingSchema =new Schema({
    title : { 
        type :String,
        required :true,
    },
    description : String,
    image : {
        type:Object,
        default:
           "https://unsplash.com/photos/giant-ocean-wave-crashing-with-distant-mount-fuji-WjECuRrxd_c", 
        set : (v)=>v ==="" ? "https://unsplash.com/photos/giant-ocean-wave-crashing-with-distant-mount-fuji-WjECuRrxd_c" : v,
    },
    price : Number,
    location : String,
    country :String,
    reviews:[{
        type: Schema.Types.ObjectId,
        ref:"Review",
    },
],
    owner :{
        type: Schema.Types.ObjectId,
        ref:"User",
    },

});
listingSchema.post("findOneAndDelete" , async(listing) =>{
    if(listing){
        await Review.deleteMany({_id :{$in:listing.review}});
    }

})

const Listing = mongoose.model("Listing" , listingSchema);
module.exports =Listing;

const Joi = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title : { 
        type : String,
        required : true,
    },
    description : String,
    image : {
        url: String,
        filename: String,
    },
    price : Number,
    location : String,
    country : String,
    reviews:[{
        type: Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner :{
        type: Schema.Types.ObjectId,
        ref:"User",
    },
});

listingSchema.post("findOneAndDelete" , async(listing) =>{
    if(listing){
        await Review.deleteMany({_id :{$in:listing.reviews}});
    }
});

const Listing = mongoose.models.Listings|| mongoose.model("Listing" , listingSchema);
module.exports = Listing;
    */
   const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: { 
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

module.exports = mongoose.models.Listing || mongoose.model("Listing", listingSchema);