'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullName:{
        type:String,
        trim:true,
    },
    countryCode: {
        type: String,
        required: true,
    },
    phone:{
        type:String,
        unique:true,
        required: true,
        trim:true,
        lowercase: true,
    },
    email:{
        type:String,
        trim:true,
        unique:true,
        required: true,
        lowercase: true,
    },
    password:{
        type:String
    },
    activeType:{
        type:Number,
        default:0
    },
    roleType:{
        type:Number, // 1 user, 2 driver, 0 admin
        default:1
    },
    verifyType:{
        type:Number,
        default:0 // 0: mail, 1 phone, 2 password
    },
    avatarLink:{
        type:String,
        lowercase: true
    },
    location:{
        type:String
    },
    onlineStatus:{
        type:Boolean
    },
    offlineTime:{
        type:Number
    },
    create_at:{
        type: Date,
        default:Date.now
    }
});


module.exports = mongoose.model('User', UserSchema);

