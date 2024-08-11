const mongoose = require('mongoose');
const paymentCardModel = require('../models/paymentModel');

const createPaymentCard = async function (req, res) {
    try {
        let cardData = req.body;

        let { title, price } = cardData;

        if (Object.keys(cardData).length == 0)
            return res.status(400).send({ status: false, message: "please provide required fields" });


        if (!title)
            return res.status(400).send({ status: false, message: " title is mandatory" });

        if (typeof title != "string")
            return res.status(400).send({ status: false, message: " title should be in string" });

        
        title = cardData.title = title.trim();

        if (title == "")
            return res.status(400).send({ status: false, message: "Please Enter  title" });

          if (!price)
          return res.status(400).send({ status: false, message: "price is mandatory" });


      
        const cardCreated = await paymentCardModel.create(cardData);

        return res.status(201).send({ status: true, message: "card created succesfully", data: cardCreated });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ status: false, message: error.message });
    }
};

const getCard = async (req, res) =>{
    try {
        const card = await paymentCardModel.find();
        return res.status(200).send({ status: true, message: "card fetched succesfully", data: card });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = {createPaymentCard,getCard}