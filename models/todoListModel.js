'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    name: {
        type: String,
        Required: 'Kindly enter the name of the task'
    },
    created_date: {
        type: Number,
        default: Date.now
    },
    status: {
        type: Number,
        default: 'pending'
    }
});


module.exports = mongoose.model('Tasks', TaskSchema);
