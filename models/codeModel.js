'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const CodeSchema = new Schema({
    accountId:{
        type:String,
        required: true,
        trim:true,
        lowercase: true,
    },
    code:{
        type:String,
        trim:true,
        required: true,
        lowercase: true,
    },
    phone:{
        type:String,
        lowercase: true,
    },
    create_at:{
        type: Number,
        default:Date.now
    }
});


module.exports = mongoose.model('VerifyCode', CodeSchema);

