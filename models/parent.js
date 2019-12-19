var mongoose = require('mongoose');
var parentSchema = mongoose.Schema({
    name:String,
    count:Number

});
var Parent = mongoose.model('Parent',parentSchema);
module.exports  = Parent