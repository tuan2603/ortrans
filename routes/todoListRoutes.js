'use strict';

module.exports = function(app) {
    let todoList = require('../controllers/todoListController');
    let userHandles = require('../controllers/userController');
    let captcha = require('../controllers/captchaController');

    // todoList Routes
    app.route('/tasks')
        .get(todoList.list_all_tasks)
        .post(todoList.create_a_task);

    app.route('/captcha')
        .post(captcha.recaptcha_verify);

    app.route('/tasks/:taskId')
        .get(userHandles.loginRequired,todoList.read_a_task)
        .put(userHandles.loginRequired,todoList.update_a_task)
        .delete(userHandles.loginRequired,todoList.delete_a_task);

    app.route('/auth/register')
        .post(userHandles.register);

    app.route('/auth/verify')
        .post(userHandles.verify);

    app.route('/auth/avatar')
        .post(userHandles.loginRequired,userHandles.update_avatar);

    app.route('/auth/password/:id')
        .put(userHandles.loginRequired,userHandles.update_password);


    app.route('/auth/:email')
        .put(userHandles.update_active);

    app.route('/auth/profile/:id')
        .put(userHandles.loginRequired,userHandles.update_profile)
        .get(userHandles.loginRequired,userHandles.profile);
};
