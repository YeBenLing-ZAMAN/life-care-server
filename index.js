const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5050;
const connectDB = require("./DB/Config");

/* get all routers */
const doctorRoutes = require("./routes/doctors.js");
const donationRoutes = require("./routes/donations.js");
const donorsRoutes = require("./routes/donors.js");
const requestBloodRoutes = require("./routes/requestBlood.js");
const userRoutes = require("./routes/users.js");



const { notFound, errorHandler } = require("./middleware/errorMiddleware");

/* cors error handle */
const corsOptions = {
  origin: ["http://localhost:3000"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

/* middleware */
app.use(cors(corsOptions));
app.use(express.json());

/* mongoDB connection */
connectDB();

/* link router  */
app.use('/user', userRoutes);
app.use('/donors', donorsRoutes);
app.use('/donation', donationRoutes);
app.use('/request-blood', requestBloodRoutes);
app.use('/consult', consultRoutes);
app.use('/doctors', doctorRoutes);


// base API
app.get("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.send("Hello server is ready !");
});

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
