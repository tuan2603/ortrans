'use strict';

var mongoose = require('mongoose'),
    Code = mongoose.model('VerifyCode');

exports.list_all_verify = function (req, res) {
    Code.find({}, function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};

