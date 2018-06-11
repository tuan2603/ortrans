'use strict';
const mongoose = require('mongoose');
const UserDocSchema = new mongoose.Schema({
    accountID: {
        type: String
    },
    cityDrive: {
        type: String
    },
    typeDrive: {
        type: Number
    },
    address: {
        type: String
    },
    referral: {
        type: String
    },
    referralCode: {
        type: String
    },
    identityCardFront: {
        type: String,
        lowercase: true,
    },
    identityCardBehind: {
        type: String,
        lowercase: true,
    },
    identityCardNumber: {
        type: Number
    },
    identityCardDateIssued: {
        type: Date
    },
    vehicleImage1: {
        type: String,
        lowercase: true,
    },
    vehicleImage2: {
        type: String,
        lowercase: true,
    },
    vehicleImage3: {
        type: String,
        lowercase: true,
    },
    vehicleImage4: {
        type: String,
        lowercase: true,
    },
    vehicleLogFront: {
        type: String,
        lowercase: true,
    },
    vehicleLogBehind: {
        type: String,
        lowercase: true,
    },
    vehicleLogSerialNumber: {
        type: String,
        lowercase: true,
    },
    vehicleLogRegistrationDate: {
        type: Date
    },
    vehicleLogPlateNumber: {
        type: String,
        lowercase: true,
    },
    create_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('userdocs', UserDocSchema);

