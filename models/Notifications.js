var mongoose = require('mongoose');
var notificationSchema = mongoose.Schema({
    name:String,
    details:String,
    

});
var Notification = mongoose.model('Notification',notificationSchema);
module.exports  = Notification