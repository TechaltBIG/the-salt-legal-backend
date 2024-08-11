

const razorpay = require("razorpay");
const crypto = require('crypto');
const userModel = require("../models/userModel");
const paymentCardModel = require("../models/paymentModel")

const payment = async (req, res) => {
    try {
        const instance = new razorpay({
            key_id: "rzp_test_UH0rkDW0Rkm44R",
			key_secret: "aYGP4XMtWqxJZy33SNDtbqlm",
        });
        let requestedData = req.body;
        let{cardId}=requestedData;
        if(!cardId) return res.status(400).send({status:false, message:"please send cardId"});
        let cardDetails = await paymentCardModel.findOne({_id:cardId});
        if(!cardDetails) return res.status(404).send({status:false, message:"Card Details not Found"});
        console.log("carddetials",cardDetails);
        const options = {
            amount: cardDetails.price * 100,
            currency: "INR",
            receipt: crypto.randomBytes(10).toString('hex'),
        };

        instance.orders.create(options, (error, order) => {
            if(error){
                console.log("Error while creating order: ", error);
                return res.status(500).send({status:false, message:"something went wrong!!!"})
            }
            res.status(200).send({status:true, data:order})
        })
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).send({ status: false, error: error.message });
    }
}

const verify = async (req, res) => {
    try{
        let userId = req.params.userId;
        let cardId = req.params.cardId;
        let data = req.body;
        let {razorpay_order_id, razorpay_payment_id, razorpay_signature} = data;
        console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature)
        const sign  = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto.createHmac('sha256', "aYGP4XMtWqxJZy33SNDtbqlm").update(sign.toString()).digest('hex');
        const cardDetails = await paymentCardModel.findById(cardId);
        if(!cardDetails) return res.status(404).send({status:false, message:"card details not found"})
        console.log("cardDetia",cardDetails)
        const user = await userModel.findById(userId);
        const updatedChoosePlan = user.choosenPlan ? [...user.choosenPlan , cardDetails]:[cardDetails];
        if(razorpay_signature === expectedSign){
            const userUpdated= await userModel.findOneAndUpdate({_id:userId},{$set:{isPaidUser:true, choosenPlan:updatedChoosePlan}},{new:true})
            console.log("userUpdated",userUpdated)
            return res.status(200).send({ status: true , message: "Payment verified successfully!" });
        }
        else return res.status(400).send({ status: false, message: "Invalid signature sent!" });
    }
    catch (error) {
        console.log("Error: ", error);
        return res.status(500).send({ status: false, error: err.message });
    }
}

module.exports={payment, verify};