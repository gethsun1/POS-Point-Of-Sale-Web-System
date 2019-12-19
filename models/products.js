var mongoose = require('mongoose');
var productSchema = mongoose.Schema({
    name:String,
    quantityReceived:Number,
    quantityIssued:Number,
    balance:Number,
    date:String,
    category:String,
    parent:String,
    created_on:Date,
    price:Number,
    cart:Boolean
});
productSchema.index( { name: "text", parent: "text" , category: "text"} )
var Product = mongoose.model('Product',productSchema);
module.exports  = Product