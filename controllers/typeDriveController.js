'use strict';

var mongoose = require('mongoose'),
    TypeDrive = mongoose.model('TypeDrives');

exports.list_all_type_drive = function (req, res) {
    TypeDrive.find({}, function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};

exports.create_a_type_drive = function(req, res) {
    var new_task = new TypeDrive(req.body);
    new_task.save(function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};
