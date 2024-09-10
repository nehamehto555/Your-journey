const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL ="mongodb://127.0.0.1:27017/Your-journey";

main().then(()=>{
    console.log('connected to DB');
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}


const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "66b48344d9c9ae3efac19ebb"})); // ye owner ki id database me initialized karne ke liye karte hai //
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}
initDB();
