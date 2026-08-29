const mongoose =require("mongoose");
const initData =require("./Data.js");
const Listing =require("../models/Listing.js");

 const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";


main()
.then(() =>{
    console.log("connect to DB");

})
.catch((err) =>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}
    const initDB =async () =>{
        await Listing.deleteMany({});
        initData.data=initData.data.map((obj)=>({...obj,owner: "6a7eb736d04e12a87e8e8ce6"}));
        await Listing.insertMany(initData.data);
        console.log("data was initialization");
    };
    initDB();
