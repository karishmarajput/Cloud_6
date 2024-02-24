const mongoose = require('mongoose');
const DataSchema = mongoose.Schema({
    data : {
        type : String,
        required : true
    }
})
const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    totaldata : [DataSchema]
});

module.exports = mongoose.model('User', UserSchema);