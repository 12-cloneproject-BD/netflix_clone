const UserService = require('../services/user.service');

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  /**
   * @param {import("express").Request} req - express Request
   * @param {import("express").Response} res - express Response
   * @param {import("express").NextFunction} next - express Response
   * **/

  userLogin = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      await this.userService.userLogin( email, password);

      const token = await this.userService.generateToken(email);

      let expires = new Date();
      expires.setMinutes(expires.getMinutes() + 60);

      // authorization 헤더 설정
      res.set('Authorization', `Bearer ${token}`);

      return res.status(201).json({
        success: true,
        message: '로그인에 성공했습니다',
      });
    } catch (error) {
      next(error);
    }
  };

  userSignup = async (req, res, next) => {
    try {
      const { email, nickname, password } = req.body;

      await this.userService.userSignup( email, nickname, password);

        return res
          .status(201)
          .json({ success: true, message: '회원 가입에 성공하였습니다.'});

    
  } catch (error) {
      next(error);
    }
  };
  getAllusers = async (req, res, next) => {
    try {
      const users = await this.userService.getAllusers(); // QuizService의 getAllQuiz 함수 실행

      res.status(200).json({ allUsers: users }); // 가져온 퀴즈를 JSON 형태로 반환
    } catch (error) {
      next(error);
    }
  };

  
}
module.exports = UserController;