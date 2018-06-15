'use strict';

module.exports = function (app) {
    let todoList = require('../controllers/todoListController');
    let userHandles = require('../controllers/userController');
    let captcha = require('../controllers/captchaController');
    let typeDrive = require('../controllers/typeDriveController');
    let referral = require('../controllers/referralController');
    let codeVerify = require('../controllers/codeController');
    let shipping = require('../controllers/shippingController');

    // todoList Routes
    app.route('/api/tasks')
        .get(todoList.list_all_tasks)
        .post(todoList.create_a_task);

    app.route('/api/captcha')
        .post(captcha.recaptcha_verify);

    app.route('/api/verify_code')
        .get(codeVerify.list_all_verify);

    app.route('/api/type_drive')
        .get(typeDrive.list_all_type_drive)
        .post(typeDrive.create_a_type_drive);

    app.route('/api/referral')
        .get(referral.list_all_referral)
        .post(referral.create_a_referral);

    app.route('/api/tasks/:taskId')
        .get(userHandles.loginRequired, todoList.read_a_task)
        .put(userHandles.loginRequired, todoList.update_a_task)
        .delete(userHandles.loginRequired, todoList.delete_a_task);

    app.route('/api/auth/register')
        .post(userHandles.register);

    app.route('/api/auth/sign-in-pass-word')
        .post(userHandles.sign_in);

    app.route('/api/auth/register-web')
        .post(userHandles.register_old);

    app.route('/api/auth/sendsms')
        .post(userHandles.send_code_again);

    app.route('/api/auth/verify')
        .post(userHandles.verify);

    app.route('/api/auth/verifyweb')
        .post(userHandles.verify_web);

    app.route('/api/auth/avatar')
        .post(userHandles.loginRequired, userHandles.update_avatar);

    app.route('/api/auth/card')
        .post(userHandles.loginRequired, userHandles.update_identityCardFront);
    app.route('/api/auth/doccument')
        .post(userHandles.loginRequired, userHandles.update_userdoc);

    app.route('/api/auth/password/:id')
        .put(userHandles.loginRequired, userHandles.update_password);


    app.route('/api/auth/:email')
        .put(userHandles.update_active);

    app.route('/api/auth/profile/:id')
        .put(userHandles.loginRequired, userHandles.update_profile)
        .get(userHandles.loginRequired, userHandles.profile);

    app.route('/api/shipping/image')
        .post(userHandles.loginRequired,shipping.insert_image);
    app.route('/api/shipping/doc')
        .post(userHandles.loginRequired,shipping.insert_doc);
    app.route('/api/shipping/list')
        .post(userHandles.loginRequired,shipping.get_list);
    app.route('/api/shipping/one')
        .post(userHandles.loginRequired,shipping.get_one);


};
