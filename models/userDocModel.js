'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const UserDocSchema = new Schema({
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
    portrait:{
        type:String,
        trim:true,
        lowercase: true,
    },
    identityCardFront:{
        type:String,
        trim:true,
        lowercase: true,
    },
    identityCardBehind:{
        type:String,
        trim:true,
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


module.exports = mongoose.model('UserDocs', UserDocSchema);

