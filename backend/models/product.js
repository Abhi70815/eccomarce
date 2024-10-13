const mongoose = require('mongoose')

const productSchema= new mongoose.Schema({
    title:{
        type: String,
        required:true,
    },
    discPrice:{
       type: Number,
       required:true,
    },
    realPrice:{
        type:Number,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    }
})

const Products= mongoose.model('Products',productSchema);

module.exports= Products;