const express = require("express");
const app = express();
const mongoose = require("mongoose"); // Ensure there are no extra spaces
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverRide= require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");

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

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverRide("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req,res) =>{
    res.send('hi am root');

});

//index-Route//
app.get("/listings",wrapAsync(async (req,res)=>{
  const allListings= await Listing.find({});
  res.render("listings/index.ejs",{allListings});
}));

//New Route//
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//Show-route//
app.get("/listings/:id" , wrapAsync(async(req,res)=>{
   let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));

//Create-route//

// app.post("/listings",
//  wrapAsync(async (req,res,next)=>{
//     let result = listingSchema.validate(req.body);
//      console.log(result);

//       const newListing= new Listing(req.body.listing);
//    await newListing.save();
//        res.redirect("/listings");

// }));

app.post("/listings",
    wrapAsync(async (req,res,next)=>{
        
          let { error } = listingSchema.validate(req.body);
       if (error) {
   
           //if there is an error, extract details and throw ExpressError.
           let errMsg = error.details.map(el => el.message).join(", ");
           throw new ExpressError(400, errMsg);
       }
   
         const newListing= new Listing(req.body.listing);
      await newListing.save();
          res.redirect("/listings");
   
   }));

//Edit-route//
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

//Update-ROUTE//
app.put("/listings/:id", wrapAsync(async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400, "Send valid data for listing")
    }
    let { id }= req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
}));

//Delete-Route//
app.delete("/listings/:id", wrapAsync(async (req, res) =>{
    let{ id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect('/listings');
}));


// app.get("/testListing", async (req,res)=>{
//    let sampleListing = new Listing({
//     title: " My New Vilaa",
//     description: "Sun roof beach",
//     price: 1200,
//     location: "West america" ,
//     county: " America"
//    });

//  await sampleListing.save();
//  console.log('sample was saved');
// res.send(" successful testing");
// });

app.all("*", (req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next)=>{
    let { statusCode=404, message="Not found by browser" } = err;
res.status(statusCode).render("error.ejs",{ message });
    // res.status(statusCode).send(message);
    })

app.listen(3000, () => {
    console.log('Server is listening to port 3000');
});
