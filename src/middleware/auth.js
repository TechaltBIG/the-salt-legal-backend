const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const userModel = require("../models/userModel");
// const adminModel = require('../models/adminModel');

const authentication = (req, res, next) => {
  try {
    // Log for debugging
    console.log("sssssssssss", req.params.userId);

    // Retrieve token from the request header
    let token = req.headers["authorization"];
    console.log("authjs", token, req.body);

    // If token is not present, send a 400 status code with an error message
    if (!token) {
      return res
        .status(400)
        .send({ status: false, message: "Token not present" });
    }

    // Split the token (assuming it's in the form "Bearer <token>")
    token = token.split(" ");
    console.log("token", token[1]);

    // Verify the token using the secret key "NITIN"
    jwt.verify(token[1], "NITIN", function (err, decoded) {
      if (err) {
        // If verification fails, send a 401 status code with an error message
        return res.status(401).send({
          status: false,
          message: "Invalid or expired token",
          error: err.message,
        });
      } else {
        // If verification is successful, attach the userId to the request object
        req.userId = decoded.userId;
        console.log("User ID:", req.userId);
        next(); // Proceed to the next middleware or route handler
      }
    });
  } catch (error) {
    // Handle any unexpected errors
    return res.status(500).send({ status: false, message: error.message });
  }
};

const authorization = async (req, res, next) => {
  try {
    let tokenId = req.userId; // The userId from the authenticated token
    let paramUserId = req.params.userId; // The userId from the request parameters

    console.log(paramUserId);
    console.log(tokenId);

    if (paramUserId) {
      // Validate the format of paramUserId
      if (!isValidObjectId(paramUserId)) {
        return res
          .status(400)
          .send({ status: false, message: "invalid user id" });
      }

      // Fetch user data from the database
      let userData = await userModel.findById(paramUserId);
      console.log("userdata ", userData);

      // If no user is found, send a 404 status code with an error message
      if (!userData) {
        return res
          .status(404)
          .send({ status: false, message: "No user found for this UserId" });
      }

      // Check if the authenticated user has permission to access this resource
      if (paramUserId != tokenId) {
        return res
          .status(403)
          .send({ status: false, message: "Unauthorised User Access" });
      }
    }

    console.log("final");
    req.userId = paramUserId; // Attach the paramUserId to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Handle any unexpected errors
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { authentication, authorization };
