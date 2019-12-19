var mongoose = require('mongoose');
var categorySchema = mongoose.Schema({
    name:String,
    parent:String

});
var Category = mongoose.model('Category',categorySchema);
module.exports  = Category