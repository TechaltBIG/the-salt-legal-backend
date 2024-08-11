

 
const mongoose = require('mongoose');

const userDetails = new mongoose.Schema({
  
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  confirmPassword: {
    type:String,
    required:true
  },
  name:{
    type:String,
    required:true
  },
  isPaidUser:{
    type:Boolean,
    default:false
  },
  choosenPlan:{
    type: Array
  },
  isDeleted:{
    type:Boolean,
    default:false
  },
},{timestamps:true});

module.exports  = mongoose.model('userDetails', userDetails);