const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main()
   .then(() => {
      console.log("connection sucessful");
   })
   .catch((err) => {
      console.log(err);
   });
async function main() {
   await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

//Root Route
app.get("/", (req, res) => {
   res.send("Hi i am root");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.all("*", (req, res, next) => {
   next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
   let { status = "500", message = "Something Went Wrong." } = err;
   res.status(status).render("listings/error.ejs", { message });
});

app.listen("8080", () => {
   console.log("server is listinig to port at 8080");
});
