'use strict';
const mongoose = require('mongoose');
const UserDocSchema = new mongoose.Schema({
    accountID:{
        type:String
    },
    cityDrive:{
        type:String
    },
    typeDrive:{
        type:Number
    },
    address:{
        type:String
    },
    referral:{
        type:String
    },
    referralCode:{
        type:String
    },
    identityCardFront:{
        type:String,
        lowercase: true,
    },
    identityCardBehind:{
        type:String,
        lowercase: true,
    },
    identityCardNumber:{
        type:Number
    },
    identityCardDateIssued:{
        type: Date
    },
    create_at:{
        type: Date,
        default:Date.now
    },
    updated_at:{
        type: Date,
        default:Date.now
    }
});


module.exports = mongoose.model('userdocs', UserDocSchema);

