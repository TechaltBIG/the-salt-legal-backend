const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const userController = require("../controllers/userController");
const categoryController = require("../controllers/categoryController.js");
const subCategoryController = require("../controllers/subCategoryController.js");
const paymentController = require("../controllers/paymentController.js");
const paymentCardController = require("../controllers/paymentCardController.js");
const auth = require("../middleware/auth.js");

//USER
router.post("/register", userController.userRegister);
router.post("/login", userController.userLogin);
router.post("/sendMail", userController.forgotPasswordClient);
router.post("/updatePassword/:token", userController.resetPasswordClient);

// Category
router.post("/create/category", categoryController.createCategory);
router.get("/get/category", categoryController.getCategory);
router.put("/update/category/:categoryId", categoryController.updateCategory);
router.delete(
  "/delete/category/:categoryId",
  categoryController.deleteCategory
);

// Nodemailer work
router.post("/sendContactEmail", userController.sendContactEmail);

// SubCategory

router.post("/create/subcategory", subCategoryController.createSubCategory);
router.get("/get/subcategory", subCategoryController.getAllSubCategory);
router.put(
  "/update/subcategory/:subCategoryId",
  subCategoryController.updateSubCategory
);
router.delete(
  "/delete/subcategory/:subCategoryId",
  subCategoryController.deleteSubCategory
);

//contact Us
router.post("/contactUs", userController.contactUs);
router.get("/getContactUs", userController.getContactUs);

// Payment route
router.post("/orders", paymentController.payment);
router.post(
  "/verify/:userId/:cardId",
  auth.authentication,
  auth.authorization,
  paymentController.verify
);

//payment Cards
router.post("/paymentCard", paymentCardController.createPaymentCard);
router.get("/getPaymentCard", paymentCardController.getCard);

// router.post("/orders", async (req, res) => {
// 	try {
//         console.log(process.env.KEY_ID)

// 		const instance = new Razorpay({

// 			key_id: "rzp_test_UH0rkDW0Rkm44R",
// 			key_secret: "aYGP4XMtWqxJZy33SNDtbqlm",
// 		});

// 		const options = {
// 			amount: req.body.amount * 100,
// 			currency: "INR",
// 			receipt: crypto.randomBytes(10).toString("hex"),
// 		};

// 		instance.orders.create(options, (error, order) => {
// 			if (error) {
// 				console.log(error);
// 				return res.status(500).json({ message: "Something Went Wrong!" });
// 			}
// 			res.status(200).json({ data: order });
// 		});
// 	} catch (error) {
// 		res.status(500).json({ message: "Internal Server Error!" });
// 		console.log(error);
// 	}
// });

// router.post("/verify", async (req, res) => {
// 	try {
// 		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
// 			req.body;
// 		const sign = razorpay_order_id + "|" + razorpay_payment_id;
// 		const expectedSign = crypto
// 			.createHmac("sha256", process.env.KEY_SECRET)
// 			.update(sign.toString())
// 			.digest("hex");

// 		if (razorpay_signature === expectedSign) {
// 			console.log("Payment verified successfully");
// 			return res.status(200).json({ message: "Payment verified successfully" });
// 		} else {
// 			return res.status(400).json({ message: "Invalid signature sent!" });
// 		}
// 	} catch (error) {
// 		res.status(500).json({ message: "Internal Server Error!" });
// 		console.log(error);
// 	}
// });

// router.post("/verification/:userId", userController.emailVerification);
// router.post("/verification2", userController.emailVerification);
// router.post("/verifyOTP", userController.verifyOTP);
// router.post("/reset-password", userController.changePassword);

router.all("*/", function (req, res) {
  return res.status(400).send({ status: false, message: "Invalid Path" });
});

module.exports = router;
