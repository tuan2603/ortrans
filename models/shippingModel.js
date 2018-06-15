'use strict';
const mongoose = require('mongoose');
const ShipingSchema = new mongoose.Schema({
    accountID:String,
    s_linkimage : {
        type: String
    },
    s_description : {
        type: String
    },
    s_isSubmit : {
        type: Boolean,
        default:false,
    },
    s_status : {
        type: Number,
        default:0,
    },
    s_distance: {
        type: Number,
        default:0.0,
    },
    // size
    s_length : {
        type: Number,
        default:0,
    },
    s_width  : {
        type: Number,
        default:0,
    },
    s_height   : {
        type: Number,
        default:0,
    },
    s_weight    : {
        type: Number,
        default:0,
    },
    // FROM
    s_from_location_lat : {
        type: Number,
        default:0,
    },
    s_from_location_long : {
        type: Number,
        default:0,
    },
    s_from_address : {
        type: String,
        default:"",
    },
    s_from_time : {
        type: Number,
        default: Date.now,
    },
    // TO
    s_to_location_lat : {
        type: Number,
        default: 0,
    },
    s_to_location_long : {
        type: Number,
        default: 0,
    },
    s_to_address : {
        type: String,
        default: "",
    },
    s_to_time : {
        type: Number,
        default: 0,
    },
    // PRICE
    e_price : {
        type: Number,
        default: 0,
    },
    a_price : {
        type: Number,
        default: 0,
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

module.exports = mongoose.model('Shipping', ShipingSchema);

