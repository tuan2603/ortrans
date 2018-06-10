'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Code = require('../models/codeModel');
const UserDoc = require('../models/userDocModel');
const config = require("../config");
const passwordValidator = require('password-validator');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
// Create a schema
const checkPass = new passwordValidator();
const nodemailer = require('nodemailer');
const rp = require('request-promise');


// Add properties to it
checkPass
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits()                                 // Must have digits
    .has().symbols()                                 // Must have symbols
    .has().not().spaces();                           // Should not have spaces
//.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

// completely pointless, but whatever
const rn = require('random-number');
const options = {
    min: 1000,
    max: 9999
    , integer: true
}

const Nexmo = require('nexmo');
const nexmo = new Nexmo({
    apiKey: config.API_KEY,
    apiSecret: config.API_SECRET,
}, {debug: true});

let Send_mail = async (mail, Verification) => {

    let transporter = await nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mailfortest32018@gmail.com',
            pass: 'TrinhVM@1'
        }
    });

    await console.log("email " + mail);

    let mailOptions = await {
        from: 'mailfortest32018@gmail.com',
        to: mail,
        subject: 'Account Verification',
        text: 'Your confirmation code: ' + Verification,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return false
        } else {
            return true
        }
    });

}

let SendMessage = (toNumber, CONTENT) => {
    return new Promise((resolve, reject) => {
        nexmo.message.sendSms(
            config.NUMBER, toNumber, CONTENT, {type: 'unicode'},
            (err, responseData) => {
                if (err) reject(err);
                resolve(responseData);
            }
        );
    });
}

let SendMessageVN = (toNumber, CONTENT) => {
    return new Promise((resolve, reject) => {
        var option = {
            uri: 'http://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_get',
            qs: {// -> uri + '?access_token=xxxxx%20xxxxx'
                Phone: "0" + toNumber + "",
                Content: CONTENT,
                ApiKey: 'FE1612D2F42AE5FA207D92A8C41273',
                SecretKey: '4E8A4B9C4C578DBB803120B4F78BD5',
                SmsType: 6,
            },
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };

        rp(option)
            .then(function (repos) {
                resolve(repos);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

let comparePassword = function (password, user) {
    return bcrypt.compareSync(password, user.password);
}

let findUserBody = (body) => {
    return new Promise((resolve, reject) => {
        User.findOne({phone: body.phone, roleType: body.roleType}, function (err, user) {
            if (err) reject(err);
            resolve(user);
        });
    });
}

let findUserPhone = (phone) => {
    return new Promise((resolve, reject) => {
        User.findOne({phone: phone}, function (err, user) {
            if (err) reject(err);
            resolve(user);
        });
    });
}

let findUserId = (id) => {
    return new Promise((resolve, reject) => {
        User.findOne({_id: id}, function (err, user) {
            if (err) reject(err);
            resolve(user);
        });
    });
}

let SaveCoseVerify = (newCode) => {
    newCode.save(function (err, user) {
        if (err) console.log(err);
    });
}


let Register = (newUser, res) => {
    newUser.save(function (err, user) {
        if (err) {
            console.log(Messages, err);
            return res.status(400).send({
                message: Messages,
                value: 3
            });
        } else {
            if (user) {
                return SingIN(user, res);
            }
            else {
                return res.status(400).send({
                    message: Messages,
                    value: 2
                });
            }
        }
    });
}

let RegisterWeb = (newUser, res, req) => {
    newUser.save(function (err, user) {
        if (err) {
            console.log(Messages, err);
            return res.status(400).send({
                message: Messages,
                value: 3
            });

        } else {
            if (user) {
                if (user.roleType === 2) {
                    let newDoc = new UserDoc(req.body);
                    newDoc.accountID = user._id;
                    newDoc.save(function (err, docuser) {
                        if (err) console.log(err);
                    });
                }
                return SingIN(user, res);
            }
            else {
                return res.status(400).send({
                    message: Messages,
                    value: 2
                });
            }
        }
    });
}

let SingIN = (user, res) => {
    let Verification = rn(options);
    let newCode = new Code({
        accountId: user._id,
        phone: user.phone,
        code: Verification,
    });
    if (user.verifyType === 0) {
        // veify code mail
        if (Send_mail(user.email, Verification)) {
            SaveCoseVerify(newCode);
            return res.json({
                value: 6,
                message: Messages,
                code: Verification
            });
        } else {
            return res.json({
                value: 1,
                "message": Messages
            });
        }
    } else if (user.verifyType === 1) {
        //verify code sen message
        SaveCoseVerify(newCode);
        SendMessageVN(user.phoneb, Verification)
            .then((repos) => {
                return res.json({
                    value: 7,
                    message: Messages,
                    code: Verification
                });
            })
            .catch(function (err) {
                return res.json({
                    value: 1,
                    "message": Messages
                });
            });

        // SendMessage("+"+user.countryCode + user.phone, Verification)
        //     .then(
        //         responseData => {
        //             console.log(responseData);
        //             return res.json({
        //                 value: 7,
        //                 message: Messages
        //             });
        //         },
        //         err => {
        //             return res.json({
        //                 value: 1,
        //                 "message": Messages
        //             });
        //         })

    } else {
        return res.json({
            value: 8,
            message: Messages
        });
    }
}

let Messages = {
    1: "Send mail or message code vefrify fail",
    2: "Register user fail",
    3: "Register user error",
    4: "Find user fail",
    5: "User exits but not active",
    6: "Check mail code verify",
    7: "Check message code verify",
    8: "Type password to sign in",
};

exports.register = function (req, res) {
    //lưu thông tin người dùng bảng chính
    let newUser = new User(req.body);
    if (req.body.roleType === 2) {
        findUserPhone(req.body.phone)
            .then(
                user => {
                    if (user) {
                        return SingIN(newUser, res);
                    } else {
                        return RegisterWeb(newUser, res, req);
                    }
                },
                err => {
                    return res.status(400).send({
                        message: Messages,
                        value: 4
                    });
                });
    } else {
        findUserBody(req.body)
            .then(
                user => {
                    if (user) {

                        if (user.activeType === 0) {
                            return res.json({
                                value: 5,
                                "message": Messages
                            });
                        } else {
                            SingIN(user, res);
                        }

                    } else {
                        return Register(newUser, res);
                    }
                },
                err => {
                    return res.status(400).send({
                        message: Messages,
                        value: 4
                    });
                });
    }

}
// gui lai code
exports.send_code_again = function (req, res) {
    //lưu thông tin người dùng bảng chính
    findUserPhone(req.body.phone)
        .then(
            user => {
                if (user) {
                    return SingIN(user, res);
                } else {
                    return res.status(400).send({
                        message: Messages,
                        value: 4
                    });
                }
            },
            err => {
                return res.status(400).send({
                    message: Messages,
                    value: 4
                });
            });

}

let mesVerify = {
    1: 'Authentication failed. User not found.',
    2: 'Authentication failed. code not right.',
    3: 'Authentication failed. paramas not enought.',
    4: 'Authentication failed. User not active.',
    5: 'Authentication failed. password not right.',
};


let findCode = (id) => {
    return new Promise((resolve, reject) => {
        Code.find({
            accountId: id
        }, function (err, code) {
            console.log(code);
            if (err) reject(err);
            resolve(code[0]);
        })
            .sort({
                create_at: -1
            })
            .limit(1)
    });
}

exports.verify = function (req, res) {
    if (req.body.verifyType) {
        if (req.body.verifyType === 2) {
            findUserBody(req.body)
                .then(user => {
                        if (!user) {
                            return res.json({
                                message: mesVerify,
                                value: 1
                            })
                        } else if (user) {
                            if (user.active_type < 1) {
                                return res.json({
                                    message: mesVerify,
                                    value: 4
                                })
                            } else if (!comparePassword(req.body.code, user)) {
                                return res.json({
                                    message: mesVerify,
                                    value: 5
                                })
                            } else {
                                user.password = undefined;
                                return res.json({
                                    message: jwt.sign({
                                            phone: user.phone,
                                            create_at: user.create_at,
                                            email: user.email,
                                            _id: user._id
                                        },
                                        config.secret),
                                    value: 0,
                                    id: user._id,
                                });
                            }
                        }
                    },
                    err => {
                        return res.json({
                            value: 1,
                            message: mesVerify
                        })
                    });
        } else {
            findUserBody(req.body)
                .then(user => {
                        if (!user) {
                            return res.json({
                                value: 1,
                                message: mesVerify
                            })
                        } else {
                            findCode(user._id)
                                .then(
                                    codes => {
                                        if (codes) {
                                            if (codes.code === req.body.code) {
                                                if (user.activeType === 0) {
                                                    User.findOneAndUpdate(
                                                        {_id: user._id},
                                                        {activeType: 1}, {new: true}, function (err, useOne) {
                                                            console.log(err);
                                                        })
                                                }
                                                Code.deleteMany({
                                                    phone: user.phone
                                                }, function (err, re) {
                                                    if (err) console.log(err);
                                                })
                                                user.password = undefined;
                                                return res.json({
                                                    message: jwt.sign({
                                                        phone: user.phone,
                                                        create_at: user.create_at,
                                                        email: user.email,
                                                        _id: user._id
                                                    }, config.secret),
                                                    value: 0,
                                                    id: user._id,
                                                });
                                            } else {
                                                return res.json({
                                                    value: 2,
                                                    message: mesVerify
                                                })
                                            }
                                        }
                                        else {
                                            return res.json({
                                                value: 2,
                                                message: mesVerify
                                            })
                                        }
                                    },
                                    err => {
                                        return res.json({
                                            value: 2,
                                            message: mesVerify
                                        })
                                    }
                                )
                        }
                    },
                    err => {
                        return res.json({
                            value: 1,
                            message: mesVerify
                        })
                    });
        }
    }
    else {
        return res.json({
            value: 3,
            message: mesVerify
        })
    }

}

// verify cho code
exports.verify_web = function (req, res) {
    findUserPhone(req.body.phone)
        .then(user => {
                if (!user) {
                    res.status(401).json({
                        value: 1,
                        message: mesVerify
                    })
                } else {
                    findCode(user._id)
                        .then(
                            codes => {
                                if (codes) {
                                    if (codes.code === req.body.code) {
                                        Code.deleteMany({
                                            phone: user.phone
                                        }, function (err, re) {
                                            if (err) console.log(err);
                                        });

                                        if (user.activeType === 0) {
                                            User.findOneAndUpdate(
                                                {_id: user._id},
                                                {activeType: 2}, {new: true}, function (err, useOne) {
                                                    useOne.password = undefined;
                                                    return res.status(200).json({
                                                        message: jwt.sign({
                                                            phone: useOne.phone,
                                                            create_at: useOne.create_at,
                                                            email: useOne.email,
                                                            _id: useOne._id
                                                        }, config.secret),
                                                        value: 0,
                                                        id: useOne._id,
                                                        activeType: useOne.activeType,
                                                    });
                                                })
                                        } else {
                                            user.password = undefined;
                                            return res.status(200).json({
                                                message: jwt.sign({
                                                    phone: user.phone,
                                                    create_at: user.create_at,
                                                    email: user.email,
                                                    _id: user._id
                                                }, config.secret),
                                                value: 0,
                                                id: user._id,
                                                activeType: user.activeType,
                                            });
                                        }

                                    } else {
                                        res.status(401).json({
                                            value: 2,
                                            message: mesVerify
                                        })
                                    }
                                }
                                else {
                                    res.status(401).json({
                                        value: 2,
                                        message: mesVerify
                                    })
                                }
                            },
                            err => {
                                res.status(401).json({
                                    value: 2,
                                    message: mesVerify
                                })
                            }
                        )
                }
            },
            err => {
                res.status(401).json({
                    value: 1,
                    message: mesVerify
                })
            });

}


exports.register_old = function (req, res) {
    if (checkPass.validate(req.body.password)) {
        let newUser = new User(req.body);
        newUser.password = bcrypt.hashSync(req.body.password, saltRounds);
        newUser.save(function (err, user) {
            if (err) {
                return res.status(400).send({
                    message: err,
                    value: false
                });
            } else {
                if (user) {
                    let Verification = rn(options);
                    if (Send_mail(newUser.email, Verification)) {
                        return res.json({
                            value: true,
                            message: Verification
                        });
                    } else {
                        return res.json({
                            value: false,
                            "message": "Send mail failed !"
                        });
                    }

                }
                else {
                    return res.status(400).send({
                        message: 'Register fail',
                        value: false
                    });
                }
                // user.password = undefined;
                // return res.json(user);
            }
        });
    } else {
        return res.status(400).send({
            message: 'Minimum length 8, ' +
            'Maximum length 100, ' +
            'Must have uppercase letters, ' +
            'Must have lowercase letters, ' +
            'Must have digits, ' +
            'Must have symbols, ' +
            'Should not have spaces'

        });
    }
}

exports.update_active = function (req, res) {
    User.findOneAndUpdate({email: req.params.email}, req.body, {new: true}, function (err, User) {
        if (err)
            return res.status(400).send({
                response: 'Update fail',
                value: false
            });
        User.password = undefined;
        res.json({
            value: true,
            response: User
        });
    });
}

let FindOneUserDoc = (id) => {
    return new Promise((resolve, reject) => {
        UserDoc.findOne({accountID: id}, function (err, Profile) {
            if (err) return reject(err);
            resolve(Profile);
        });
    });
}

exports.profile = function (req, res) {
    User.findOne({_id: req.params.id}, function (err, User) {
        if (err) {
            return res.status(400).send({
                response: 'get profile fail',
                value: false
            });
        } else {
            if (User) {
                FindOneUserDoc(req.params.id)
                    .then(Profile => {
                        console.log(Profile);
                        User.password = undefined;
                        res.json({
                            value: true,
                            response: Object.assign(JSON.parse(JSON.stringify(User)), JSON.parse(JSON.stringify(Profile)))
                        });
                    }, err => {
                        console.log(err);
                        User.password = undefined;
                        res.json({
                            value: true,
                            response: User
                        });
                    });
            } else {
                return res.status(400).send({
                    response: 'get profile fail',
                    value: false
                });
            }
        }
    });
}

exports.update_profile = function (req, res) {
    User.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function (err, User) {
        if (err)
            return res.status(400).send({
                response: 'Update fail',
                value: false
            });
        User.password = undefined;
        res.json({
            value: true,
            response: User
        });
    });
}

exports.update_password = function (req, res) {
    if (checkPass.validate(req.body.password)) {
        let password = bcrypt.hashSync(req.body.password, saltRounds);
        User.findOneAndUpdate({_id: req.params.id}, {
            password: password,
            verifyType: 2
        }, {new: true}, function (err, User) {
            if (err)
                return res.status(400).send({
                    response: 'Update fail',
                    value: false
                });
            User.password = undefined;
            User.activeType = undefined;
            User.verifyType = undefined;
            res.json({
                value: true,
                response: User
            });
        });
    } else {
        return res.status(400).send({
            message: 'Minimum length 8, ' +
            'Maximum length 100, ' +
            'Must have uppercase letters, ' +
            'Must have lowercase letters, ' +
            'Must have digits, ' +
            'Must have symbols, ' +
            'Should not have spaces',
            value: false

        });
    }
}


let deleteAvatar = (id) => {
    User.findOne({_id: id}, function (err, user) {
        if (err) console.log(err);
        if (user) {
            try {
                fs.unlinkSync(uploadDir + user.phone + "/" + user.avatarLink);
            } catch (err) {
                console.log(err);
            }
        }
    })
}

let updateAvatarUser = (id, filename, res) => {
    User.findOneAndUpdate({_id: id}, {avatarLink: filename}, {new: true}, function (err, User) {
        if (err)
            return res.status(400).send({
                response: err,
                value: false
            });
        User.password = undefined;
        User.activeType = undefined;
        User.verifyType = undefined;
        res.json({
            value: true,
            response: User
        });
    });
}

let DelAndUpdateAvatar = async (id, filename, res) => {
    await deleteAvatar(id);
    updateAvatarUser(id, filename, res);
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
var Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        checkDirectory('public/uploads/' + req.user.phone, function (error) {
            if (error) {
                try {
                    fs.statSync('public/uploads/' + req.user.phone);
                } catch (e) {
                    fs.mkdirSync('public/uploads/' + req.user.phone);
                }
                cb(null, 'public/uploads/' + req.user.phone);
            } else {
                cb(null, 'public/uploads/' + req.user.phone);
            }
        });
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + ".jpg");
    }
});


var upload = multer({
    storage: Storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname).toLowerCase();
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
}).single('avatar'); //Field name and max count

exports.update_avatar = function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.json({
                "response": err,
                "value": false
            });
        } else {
            //console.log(req.file);
            if (req.file) {
                if (req.body.id) {
                    DelAndUpdateAvatar(req.body.id, req.file.filename, res);
                } else {
                    deleteAvatar(req.body.id);
                    return res.status(401).json({
                        "response": false,
                        "value": req.file.filename
                    });
                }
            } else {
                return res.status(401).json({
                    "response": false,
                    "value": "not find id"
                });
            }
        }
    });
}


let deleteIdentityCardFront = (body) => {
    UserDoc.findOne({accountID: body.id}, function (err, doc) {
        if (err) console.log(err);
        if (doc) {
            try {
                switch (body.expression) {
                    case "identityCardFront":
                        fs.unlinkSync(uploadDir + body.folder + "/" + doc.identityCardFront);
                        break;

                    case "identityCardBehind":
                        fs.unlinkSync(uploadDir + body.folder + "/" + doc.identityCardBehind);
                        break;

                    default:
                }

            } catch (err) {
                console.log(err);
            }
        }
    })
}

// dung để update thông tin user phụ
exports.update_userdoc = (req ,res) =>{
   return updateUserDoc(req.body,res);
}

let updateUserDoc = (obj, res) => {
    UserDoc.findOneAndUpdate({accountID: obj.id}, obj , {new: true}, function (err, User) {
        if (err)
            return res.status(400).send({
                response: err,
                value: false
            });
        findUserId(obj.id)
            .then(Profile => {
                Profile.password = undefined;
                return  res.json({
                    value: true,
                    response: Object.assign(JSON.parse(JSON.stringify(User)), JSON.parse(JSON.stringify(Profile)))
                });
            }, err => {
                console.log(err);
                return   res.json({
                    value: true,
                    response: User
                });
            });
    });

}

let updateIdentityCardFront = (body, filename, res) => {

    switch (body.expression) {
        case "identityCardFront":
             return updateUserDoc({identityCardFront:filename},res);
        case "identityCardBehind":
            return updateUserDoc({identityCardBehind:filename},res);
        default:
    }
}

let DelAndUpdateIdentityCardFront = async (body, filename, res) => {
    await deleteIdentityCardFront(body);
    updateIdentityCardFront(body, filename, res);
}

exports.update_identityCardFront = function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.json({
                "response": err,
                "value": false
            });
        } else {
            //console.log(req.file);
            if (req.file) {
                if (req.body.id) {
                    DelAndUpdateIdentityCardFront(req.body, req.file.filename, res);
                } else {
                    deleteIdentityCardFront(req.body);
                    return res.status(401).json({
                        "response": false,
                        "value": req.file.filename
                    });
                }
            } else {
                return res.status(401).json({
                    "response": false,
                    "value": "not find id"
                });
            }
        }
    });
}


exports.sign_in = function (req, res) {
    User.findOne({
        email: req.body.email,
    }, function (err, user) {
        if (err) throw err;
        if (!user) {
            res.status(401).json({
                message: 'Authentication failed. User not found.'
            })
        } else if (user) {
            if (user.active_type < 1) {
                res.status(401).json({
                    message: 'Authentication failed. User not active.'
                })
            } else if (!comparePassword(req.body.password, user)) {
                res.status(401).json({
                    message: 'Authentication failed. Wrong password.'
                })
            } else {
                return res.json({
                    token: jwt.sign({
                            phone: user.phone,
                            create_at: user.create_at,
                            email: user.email,
                            _id: user._id
                        },
                        config.secret)
                });
            }
        }
    })
}

exports.loginRequired = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({message: 'Unauthorized user!'});
    }
};
