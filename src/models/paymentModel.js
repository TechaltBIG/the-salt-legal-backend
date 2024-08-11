const mongoose = require('mongoose');

const paymentCard = new mongoose.Schema({
  
  
  title:{
    type:String,
    required:true
  },
  price:{
    type:String,
    required:true
  },
  
  isDeleted:{
    type:Boolean,
    default:false
  },
},{timestamps:true});

module.exports  = mongoose.model('paymentCard', paymentCard);
