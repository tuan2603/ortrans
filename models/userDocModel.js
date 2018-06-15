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
    drivingLicenseFront: {
        type: String,
        lowercase: true,
    },
    drivingLicenseBehind: {
        type: String,
        lowercase: true,
    },
    drivingLicenseNumber: {
        type: String,
        lowercase: true,
    },
    drivingLicenseIssueDate: {
        type: Date
    },
    drivingLicenseClass: {
        type: String,
        lowercase: true,
    },
    vehicleInsuranceFront: {
        type: String,
        lowercase: true,
    },
    vehicleInsuranceBehind: {
        type: String,
        lowercase: true,
    },
    vehicleInsuranceDate: {
        type: Date
    },
    deviceInformationModel: {
        type: String,
        lowercase: true,
    },
    deviceInformationIMEI: {
        type: String,
        lowercase: true,
    },
    studentCardClearanceFront: {
        type: String,
        lowercase: true,
    },
    studentCardClearanceBehind: {
        type: String,
        lowercase: true,
    },
    registrationBookClearance1: {
        type: String,
        lowercase: true,
    },
    registrationBookClearance2: {
        type: String,
        lowercase: true,
    },
    registrationBookClearance3: {
        type: String,
        lowercase: true,
    },
    cvClearance1: {
        type: String,
        lowercase: true,
    },
    cvClearance2: {
        type: String,
        lowercase: true,
    },
    cvClearance3: {
        type: String,
        lowercase: true,
    },
    cvClearance4: {
        type: String,
        lowercase: true,
    },
    cvClearance5: {
        type: String,
        lowercase: true,
    },
    emergencyContactName: {
        type: String,
        lowercase: true,
    },
    emergencyContactRelationship: {
        type: String,
        lowercase: true,
    },
    emergencyContactPhone: {
        type: String,
        lowercase: true,
    },
    emergencyContactAddress: {
        type: String,
        lowercase: true,
    },
    create_at: {
        type: Number,
        default: Date.now
    },
    updated_at: {
        type: Number,
        default: Date.now
    }
});


module.exports = mongoose.model('userdocs', UserDocSchema);

