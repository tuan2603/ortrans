'use strict';
const Shipping = require('../models/shippingModel'),
    User = require("../models/userModel"),
    config = require("../config"),
    path = require('path'),
    multer = require('multer'),
    fs = require('fs');


let FindShipping = (id) => {
    return new Promise((resolve, reject) => {
        Shipping.find({accountID: id}, function (err, Shipping) {
            if (err) return reject(err);
            resolve(Shipping);
        });
    });
}

let FindOneShipping = (id) => {
    return new Promise((resolve, reject) => {
        Shipping.findOne({_id: id}, function (err, Shipping) {
            if (err) return reject(err);
            resolve(Shipping);
        });
    });
}

let createShipping = (obj) => {
    return new Promise((resolve, reject) => {
        Shipping.create(obj, function (err, Shipping) {
            if (err) return reject(err);
            resolve(Shipping);
        });
    });
}

exports.get_list = function (req, res) {
    FindShipping(req.body.id)
        .then(
            Shipping => {
                if (Shipping) {
                    return res.json({
                        value: Shipping,
                        response: true
                    });
                } else {
                    return res.json({
                        value: "Not find",
                        response: false
                    });
                }
            },
            err => {
                return res.json({
                    value: err,
                    response: false
                });
            }
        );
}

exports.get_one = function (req, res) {
    FindOneShipping(req.body.id)
        .then(
            Shipping => {
                if (Shipping) {
                    return res.json({
                        value: Shipping,
                        response: true
                    });
                } else {
                    return res.json({
                        value: "Not find",
                        response: false
                    });
                }
            },
            err => {
                return res.json({
                    value: err,
                    response: false
                });
            }
        );
}
// xoa image cũ trước khi update
let deleteImage = (body) => {
    return new Promise((resolve, reject) => {
        User.findOne({_id: body.accountID}, function (err, user) {
            if (err) console.log(err);
            if (user) {
                Shipping.findOne({_id: body.id}, function (err, shipping) {
                    if (err) reject(err);
                    if (shipping) {
                        try {
                            fs.unlinkSync(uploadDir + user.phone + "/" + shipping.s_linkimage);
                            resolve(shipping);
                        } catch (err) {
                            resolve(true);
                        }
                    }
                })
            }
        })
    })
}

//xóa image nếu cập nhật dữ liệu thất bại
let deleteImageNew = (body, filename) => {
    User.findOne({_id: body.accountID}, function (err, user) {
        if (err) console.log(err);
        if (user) {
            try {
                fs.unlinkSync(uploadDir + user.phone + "/" + filename);
            } catch (err) {
                console.log(err);
            }
        }
    })
}

let updateShipping = (body, filename) => {
    return new Promise((resolve, reject) => {
        Shipping.findOneAndUpdate({_id: body.id}, {s_linkimage: filename}, {new: true}, function (err, shipping) {
            if (err) reject(err);
            resolve(shipping);
        });
    });
}

let DelAndUpdateImange = (body, filename) => {
    return new Promise((resolve, reject) => {
        deleteImage(body)
            .then(
                Del=> {
                    updateShipping(body, filename).then(
                        Shipping => {
                            if (Shipping) {
                                resolve(Shipping)
                            } else {
                                reject("update image shipping fail")
                            }
                        }, err => reject(err)
                    );
                },err => {reject(err)}
            );

    });
}
//function will check if a directory exists, and create it if it doesn't
let checkDirectory = (directory, callback) => {
    fs.stat(directory, function (err, stats) {
        //Check if error defined and the error code is "not exists"
        if (err && err.errno === 34) {
            //Create the directory, call the callback.
            fs.mkdir(directory, callback);
        } else {
            //just in case there was a different error:
            callback(err)
        }
    });
}

//upload file
let uploadDir = 'public/uploads/';
let Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        checkDirectory(uploadDir + req.user.phone, function (error) {
            if (error) {
                try {
                    fs.statSync(uploadDir + req.user.phone);
                } catch (e) {
                    fs.mkdirSync(uploadDir + req.user.phone);
                }
                cb(null, uploadDir + req.user.phone);
            } else {
                cb(null, uploadDir + req.user.phone);
            }
        });
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + ".jpg");
    }
});


let upload = multer({
    storage: Storage,
    fileFilter: function (req, file, callback) {
        let ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.png'
            && ext !== '.jpg'
            && ext !== '.jpeg'
        ) {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
    limits: {
        fileSize: 6000000
    }
}).single('s_linkimage'); //Field name and max count

exports.insert_image = function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.json({
                "response": err,
                "value": false
            });
        } else {
            //console.log(req.file);
            if (req.file) {
                if (req.body.accountID) {
                    if (req.body.id) {
                        DelAndUpdateImange(req.body, req.file.filename).then(
                            Shipping => {
                                if (Shipping) {
                                    return res.json({
                                        "response": true,
                                        "value": Shipping
                                    });
                                } else {
                                    deleteImageNew(req.body, req.file.filename);
                                    return res.json({
                                        "response": false,
                                        "value": "Tạo lưu data không thành công"
                                    });
                                }
                            },
                            err => {
                                return res.json({
                                    "response": false,
                                    "value": err
                                });
                            }
                        )
                    } else {
                        createShipping({
                            accountID: req.body.accountID,
                            s_linkimage: req.file.filename,
                        })
                            .then(
                                Shipping => {
                                    if (Shipping) {
                                        return res.json({
                                            "response": true,
                                            "value": Shipping
                                        });
                                    } else {
                                        deleteImageNew(req.body, req.file.filename);
                                        return res.json({
                                            "response": false,
                                            "value": "Tạo lưu data không thành công"
                                        });
                                    }
                                },
                                err => {
                                    return res.json({
                                        "response": false,
                                        "value": err
                                    });
                                }
                            )
                    }

                } else {
                    deleteImageNew(req.body, req.file.filename);
                    return res.json({
                        "response": false,
                        "value": "Tạo lưu data không thành công"
                    });
                }
            } else {
                return res.json({
                    "response": false,
                    "value": "not find id"
                });
            }
        }
    });
};

exports.insert_doc = function (req, res) {
    if (req.body && req.body.accountID !== undefined) {
        if (req.body.id) {
            Shipping.findOneAndUpdate({_id: req.body.id}, req.body, {new: true}, function (err, shipping) {
                if (err) return res.json({
                    "response": false,
                    "value": err
                });
                if (shipping) {
                    return res.json({
                        "response": true,
                        "value": shipping
                    });
                } else {
                    return res.json({
                        "response": false,
                        "value": "Tạo lưu data không thành công"
                    });
                }
            });
        } else {
            createShipping(req.body)
                .then(
                    Shipping => {
                        if (Shipping) {
                            return res.json({
                                "response": true,
                                "value": Shipping
                            });
                        } else {
                            return res.json({
                                "response": false,
                                "value": "Tạo lưu data không thành công"
                            });
                        }
                    },
                    err => {
                        return res.json({
                            "response": false,
                            "value": err
                        });
                    }
                )
        }

    } else {
        return res.json({
            "response": false,
            "value": "not find id"
        });
    }

}
