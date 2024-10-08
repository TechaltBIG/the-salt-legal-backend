const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const route = require("./route/routes");
const cors = require("cors");

dotenv.config();
const port = process.env.PORT || 10000;

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb+srv://nehajaiswal:neha123@nehadb.pcorgpc.mongodb.net/legalbackend", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

app.use("/", route);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
