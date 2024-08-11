const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const forgotPasswordModel = require("../models/forgotPasswordModel");
const contactUsModel = require("../models/contactUsModel");
const jwt = require("jsonwebtoken");
// const verificationModel = require("../models/verificationModel");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const validation = require("../validations/validation");
const bcrypt = require("bcrypt");
// const admin = require('../models/adminModel');

const userRegister = async function (req, res) {
  try {
    let userData = req.body;

    let { name, email, password, confirmPassword } = userData;

    if (Object.keys(userData).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "please provide required fields" });

    if (!name)
      return res
        .status(400)
        .send({ status: false, message: " name is mandatory" });

    if (typeof name != "string")
      return res
        .status(400)
        .send({ status: false, message: " name should be in string" });

    // regex
    name = userData.name = name.trim();

    if (name == "")
      return res
        .status(400)
        .send({ status: false, message: "Please Enter  name value" });

    //================================ email ======

    if (!email)
      return res
        .status(400)
        .send({ status: false, message: "email is mandatory" });

    if (typeof email != "string")
      return res
        .status(400)
        .send({ status: false, message: "email id  should be in string" });

    //=========== email =======

    email = userData.email = email.trim().toLowerCase();
    if (email == "")
      return res
        .status(400)
        .send({ status: false, message: "Please enter email value" });

    if (!validation.validateEmail(email))
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid email id" });

    //========= password ======

    // if (!password)
    //     return res.status(400).send({ status: false, message: "password is mandatory" });

    // if (typeof password != "string")
    //     return res.status(400).send({ status: false, message: "please provide password in string " });

    // password = userData.password = password.trim();
    // if (password == "")
    //     return res.status(400).send({ status: false, message: "Please provide password value" });

    // //regex password
    // if (!validation.validatePassword(password))
    //     return res.status(400).send({ status: false, message: "8-15 characters, one lowercase letter, one number and maybe one UpperCase & one special character" });

    // //Encrypting password
    // let hashing = bcrypt.hashSync(password, 10);
    // userData.password = hashing;

    if (!password)
      return res
        .status(400)
        .send({ status: false, message: "password is mandatory" });

    if (typeof password != "string")
      return res
        .status(400)
        .send({ status: false, message: "please provide password in string " });
    password = userData.password = password.trim();

    if (password == "")
      return res
        .status(400)
        .send({ status: false, message: "Please provide password value" });

    if (!validation.validatePassword(password))
      return res.status(400).send({
        status: false,
        message:
          "8-15 characters, one lowercase letter, one number and maybe one UpperCase & one special character",
      });

    //Encrypting password
    let hashingPassword = bcrypt.hashSync(password, 10);
    userData.password = hashingPassword;

    //___________________________________confirmPassword______________________________________

    if (!password)
      return res
        .status(400)
        .send({ status: false, message: "password is mandatory" });

    if (!confirmPassword)
      return res
        .status(400)
        .send({ status: false, message: "confirmPassword is mandatory" });

    if (typeof confirmPassword != "string")
      return res.status(400).send({
        status: false,
        message: "please provide confirmPassword in string ",
      });

    confirmPassword = userData.confirmPassword = confirmPassword.trim();

    if (confirmPassword == "")
      return res.status(400).send({
        status: false,
        message: "Please provide confirmPassword value",
      });

    if (!validation.validatePassword(confirmPassword))
      return res.status(400).send({
        status: false,
        message:
          "8-15 characters, one lowercase letter, one number and maybe one UpperCase & one special character",
      });

    let passwordCompare = await bcrypt.compare(
      confirmPassword,
      userData.password
    );
    console.log(passwordCompare);
    if (!passwordCompare)
      return res
        .status(404)
        .send({ status: false, message: "password doesn't match" });

    //Encrypting confirmpassword
    let hashingconfirmPassword = bcrypt.hashSync(password, 10);
    userData.confirmPassword = hashingconfirmPassword;

    const userExist = await userModel.findOne({ $or: [{ email: email }] });

    if (userExist) {
      if (userExist.email == email)
        return res.status(400).send({
          status: false,
          message: "email id  already exist, send another email",
        });
    }

    const userCreated = await userModel.create(userData);

    return res.status(201).send({
      status: true,
      message: "Your Account has been successfully Registered",
      data: userCreated,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ status: false, message: error.message });
  }
};

// *******************************

const userLogin = async function (req, res) {
  try {
    let data = req.body;
    let { email, password } = data;

    if (Object.keys(data).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Please send data" });

    if (!email)
      return res
        .status(400)
        .send({ status: false, message: "Please enter Email" });

    if (email != undefined && typeof email != "string")
      return res.status(400).send({
        status: false,
        message: "Please enter Email in string format",
      });

    email = data.email = email.trim();
    if (email == "")
      return res
        .status(400)
        .send({ status: false, message: "Please enter Email value" });

    if (!validation.validateEmail(email))
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid Email" });

    if (!password)
      return res
        .status(400)
        .send({ status: false, message: "Please enter password" });

    if (password != undefined && typeof password != "string")
      return res.status(400).send({
        status: false,
        message: "Please enter password in string format",
      });

    password = data.password = password.trim();

    if (password == "")
      return res
        .status(400)
        .send({ status: false, message: "Please enter password" });

    if (!validation.validatePassword(password))
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid password" });

    //

    let isUserExist = await userModel.findOne({ email: email });

    if (!isUserExist)
      return res
        .status(404)
        .send({ status: false, message: "No user found with given Email" });

    let passwordCompare = await bcrypt.compare(password, isUserExist.password);

    if (!passwordCompare)
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid password" });

    let token = jwt.sign(
      { userId: isUserExist._id, exp: Math.floor(Date.now() / 1000) + 86000 },
      "NITIN"
    );

    let tokenInfo = {
      userId: isUserExist._id,
      token: token,
      email: email,
      name: isUserExist.name,
      isDeleted: isUserExist.isDeleted,
      choosenPlan: isUserExist.choosenPlan,
      isPaidUser: isUserExist.isPaidUser,
    };

    res.setHeader("x-api-key", token);

    return res
      .status(200)
      .send({ status: true, message: "Login Successful", data: tokenInfo });

    // ************************

    // ************************
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

// ******************Login Ends*************

// **************Nodemailer work****************************

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "karan.connect09@gmail.com", // Replace with your email
    pass: "wooocmulolpfzujp", // Replace with your email password or app password if 2FA is enabled
  },
});

const sendContactEmail = async (req, res) => {
  const { name, email, phone, message } = req.body;

  const mailOptions = {
    from: "karan.connect09@gmail.com", // Replace with your email
    to: "nitintanwar1510@gmail.com", // Replace with recipient email
    subject: "ContactUs Form Leads",
    text: `New mail created at ${name} (${email})`,
    html: `
      <h2>New Mail Created</h2>
      <p>Name : ${name}</p>
      <p>Email : ${email}</p>
      <p>Other Details : ${JSON.stringify({ phone, message }, null, 2)}</p>
    `,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email Sent: " + info.response);
    res.status(200).json({ message: "Mail created successfully", status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", status: 500 });
  }
};

// *********************************************************
const sendForgotPasswordEmail = (email, token) => {
  const mailOptions = {
    from: "anmolkadam369@gmail.com",
    to: email,
    subject: "Password Reset",
    text: `Click the link to reset your password: https://the-salt-legal.vercel.app/#/reset-password/${token}`,
    // http://localhost:3001/administration/resetPassword/${token}
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

const forgotPasswordClient = async (req, res) => {
  console.log(process.env.PASS);

  let forgotPassword = req.body;
  let { email, resetToken, resetTokenExpires } = forgotPassword;
  const foundforgotPassword = await userModel.findOne({ email: email });
  console.log("fondform", foundforgotPassword);
  if (!foundforgotPassword) {
    return res.status(404).json({ message: "user not found" });
  }

  const token = crypto.randomBytes(20).toString("hex");
  console.log("token:", token);

  email = forgotPassword.email = email;
  resetToken = forgotPassword.resetToken = token;
  console.log("resetToken:", resetToken);

  resetTokenExpires = forgotPassword.resetTokenExpires = Date.now() + 6000000;
  console.log("resetTokenExpires:", resetTokenExpires);
  console.log("forgotPassword:      ", forgotPassword);
  let allInfo = await forgotPasswordModel.create(forgotPassword);
  res.status(200).send({ status: true, message: allInfo });
  req.token = token;
  console.log(req.token);
  sendForgotPasswordEmail(email, token);
};

const resetPasswordClient = async (req, res) => {
  let data = req.body;
  let { newPassword, confirmPassword } = data;
  let token = req.params.token;

  if (!newPassword)
    return res
      .status(400)
      .send({ status: false, message: "newPassword is mandatory" });

  if (typeof newPassword != "string")
    return res.status(400).send({
      status: false,
      message: "please provide newPassword in string ",
    });
  newPassword = data.newPassword = newPassword.trim();

  if (newPassword == "")
    return res
      .status(400)
      .send({ status: false, message: "Please provide newPassword value" });

  if (!validation.validatePassword(newPassword))
    return res.status(400).send({
      status: false,
      message:
        "8-15 characters, one lowercase letter, one number and maybe one UpperCase & one special character",
    });

  //Encrypting newPassword
  let hashingnewPassword = bcrypt.hashSync(newPassword, 10);
  newPassword = data.newPassword = hashingnewPassword;

  //___________________________________confirmPassword______________________________________

  if (!confirmPassword)
    return res
      .status(400)
      .send({ status: false, message: "confirmPassword is mandatory" });

  if (typeof confirmPassword != "string")
    return res.status(400).send({
      status: false,
      message: "please provide confirmPassword in string ",
    });

  confirmPassword = data.confirmPassword = confirmPassword.trim();

  if (confirmPassword == "")
    return res
      .status(400)
      .send({ status: false, message: "Please provide confirmPassword value" });

  if (!validation.validatePassword(confirmPassword))
    return res.status(400).send({
      status: false,
      message:
        "8-15 characters, one lowercase letter, one number and maybe one UpperCase & one special character",
    });

  let passwordCompare = await bcrypt.compare(confirmPassword, data.newPassword);
  console.log(passwordCompare);
  if (!passwordCompare)
    return res
      .status(404)
      .send({ status: false, message: "password doesn't match" });

  //Encrypting confirmpassword
  let hashingconfirmPassword = bcrypt.hashSync(confirmPassword, 10);
  confirmPassword = data.confirmPassword = hashingconfirmPassword;

  const user = await forgotPasswordModel.findOne({ resetToken: token });
  console.log(user);
  if (!user)
    return res.status(400).send({ status: false, message: "Invalid token" });
  if (user.resetTokenExpires < Date.now())
    return res.status(400).send({ status: false, message: "Token expired" });
  // if (user.resetTokenExpires < Date.now())
  // return res.status(400).send({ status: false, message: "Token expired" });

  let some = await userModel.findOneAndUpdate(
    { email: user.email },
    { $set: { password: newPassword, confirmPassword: confirmPassword } },
    { new: true }
  );
  console.log(some);
  return res.json({ message: "Password reset successful" });
};

// *****************************

const contactUs = async (req, res) => {
  try {
    let contactUsData = req.body;

    // Validate presence of fields
    const requiredFields = ["name", "email", "phone", "message"];
    for (const field of requiredFields) {
      if (!contactUsData[field]) {
        return res
          .status(400)
          .send({ status: false, message: `${field} is mandatory` });
      }
    }

    // Validate name
    if (typeof contactUsData.name !== "string" || !contactUsData.name.trim()) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid name" });
    }
    contactUsData.name = contactUsData.name.trim();

    // Validate email
    if (
      typeof contactUsData.email !== "string" ||
      !contactUsData.email.trim()
    ) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid email" });
    }
    contactUsData.email = contactUsData.email.trim().toLowerCase();

    if (!validation.validateEmail(contactUsData.email)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide a valid email id" });
    }

    // Validate phone
    if (
      typeof contactUsData.phone !== "string" ||
      !contactUsData.phone.trim()
    ) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid phone number" });
    }

    if (!validation.validateNumber(contactUsData.phone)) {
      return res.status(400).send({
        status: false,
        message: "Please provide a valid phone number",
      });
    }

    // Validate message
    if (
      typeof contactUsData.message !== "string" ||
      !contactUsData.message.trim()
    ) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid message" });
    }

    // Set queryDate and queryTime
    contactUsData.queryDate = new Date(); // Store as Date object
    contactUsData.queryTime = new Date().toLocaleTimeString();

    // Create entry in the database
    let createdData = await contactUsModel.create(contactUsData);

    // Send email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // or 'STARTTLS'
      auth: {
        user: "karan.connect09@gmail.com",
        pass: "wooocmulolpfzujp",
      },
    });

    const mailOptions = {
      from: contactUsData.email,
      to: "karan.connect09@gmail.com",
      subject: "Query Submitted Successfully",
      text: `Dear ${contactUsData.name} ,${contactUsData.email},\n\nThank you for contacting us. Your query has been submitted successfully.\n\nBest Regards,\nYour Company`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Email sent: " + info.response);
    });

    return res.status(201).send({
      status: true,
      message: "Query submitted successfully!",
      data: createdData,
    });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const getContactUs = async (req, res) => {
  try {
    let contactUsDetails = await contactUsModel.find();

    return res.status(200).send({
      // Changed to 200 for success response
      status: true,
      message: "All data retrieved successfully!",
      data: contactUsDetails,
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

// ******************************

module.exports = {
  userRegister,
  userLogin,
  forgotPasswordClient,
  resetPasswordClient,
  contactUs,
  getContactUs,
  sendContactEmail,
};
