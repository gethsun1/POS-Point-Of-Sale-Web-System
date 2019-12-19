var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    firstname:String,
    lastname:String,
    username:String,
    role:String,
    EmployeeNo:String,
   password:String
});
var User = mongoose.model('User',userSchema);
module.exports  = User