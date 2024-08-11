const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const route = require("./route/routes");
const cors = require("cors");

dotenv.config();
const port = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/TSL-DB", {
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
