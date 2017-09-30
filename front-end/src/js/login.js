import $ from 'jquery';

$(function() {

    var $loginForm = $('#login-form');
    var $loginLink = $('#login-form-link');

    var $registerForm = $('#register-form');
    var $registerLink = $('#register-form-link');

    var LoginModule = {
        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            $loginLink.on('click', this.loginClickEvent.bind(this));
            $registerLink.on('click', this.registerClickEvent.bind(this));
        },

        loginClickEvent: function(e) {
            e.preventDefault();
            $loginForm.delay(100).fadeIn(100);
            $registerForm.fadeOut(100);
            $registerLink.removeClass('active');
            $(this).addClass('active');
        },

        registerClickEvent: function(e) {
            e.preventDefault();
            $registerForm.delay(100).fadeIn(100);
            $loginForm.fadeOut(100);
            $loginLink.removeClass('active');
            $(this).addClass('active');
        },

        submitLoginForm: function(e) {
            var inputData = this.getFormData($loginForm);
            if (inputData.username === '' || inputData.password === '') {
                alert('아이디와 비밀번호를 입력해 주세요');
            }
        },

        submitRegisterForm: function(e) {
            const {username, password, confirmPassword} = this.getFormData($registerForm);
            if (username === '' || password === '' || confirmPassword === '') {
                alert('아이디와 비밀번호를 입력해 주세요');
                if (password !== confirmPassword) {
                    alert('동일한 비밀번호를 입력해 주세요');
                }
            }
        },

        getFormData: function ($formData) {
            return $formData.serializeArray().reduce(function (obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
        }
    }

    LoginModule.init();

});