const express = require('express');
const router = express.Router();
const authLoginMiddleware = require('../middlewares/auth-login-middleware');

const UserController = require('../controllers/user.controller');
const userController = new UserController();

// 회원가입
router.post('/signup', userController.userSignup);
// 회원 조회
router.get('/allUsers', userController.getAllusers)
// 로그인
router.post('/login', authLoginMiddleware, userController.userLogin);

module.exports = router;