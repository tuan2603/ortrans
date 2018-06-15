'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ReferralSchema = new Schema({
    typeId:{
        type:String,
        trim:true,
        required: true,
        lowercase: true,
    },
    typeName:{
        type:String,
        trim:true,
        required: true,
        lowercase: true,
    },
    create_at:{
        type: Number,
        default:Date.now
    },
    updated_at:{
        type: Number,
        default:Date.now
    }
});


module.exports = mongoose.model('Referrals', ReferralSchema);

