require("dotenv").config();

const Joi = require("joi");
const UserRepository = require("../repositories/user.repository");
const jwt = require("jsonwebtoken");
const {
  createHashPassword,
  comparePassword,
} = require("../modules/cryptoUtils.js");
const Boom = require("boom");
const logger = require("../middlewares/logger.js");

const re_email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const re_password = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(re_password).required(),
});

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * @param {String} email
   * @param {String} password
   */
  //로그인
  userLogin = async (email, password) => {
    try {
      const user = await this.userRepository.findByID(email);

      if (!user) {
        throw Boom.notFound("존재하지 않는 이메일 주소입니다");
      }

      const comparePw = await comparePassword(password, user.password);

      if (!comparePw) {
        throw Boom.unauthorized("패스워드를 확인해주세요.");
      }
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  };

  /**
   * @param {String} email
   */
  //토큰 생성
  generateToken = async (email) => {
    const token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "60m",
    });

    return token;
  };

  /**
   * @param {String} email
   * @param {String} password
   */
  //회원가입
  userSignup = async (email, password) => {
    try {
      await userSchema.validate({ email, password });

      if (email.search(re_email) === -1) {
        throw Boom.badRequest("유효하지 않은 이메일 주소 입니다.");
      }

      if (password.search(re_password) === -1) {
        throw Boom.badRequest("유효하지 않은 패스워드 입니다.");
      }

      const existingUser = await this.userRepository.findByID(email);
      if (existingUser) {
        throw Boom.conflict("중복된 이메일 주소 입니다");
      }

      const hashedPassword = await createHashPassword(password);

      await this.userRepository.userSignup(email, hashedPassword);
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  };

  //모든 유저 조회
  getAllusers = async () => {
    const allUsers = await this.userRepository.getAllusers();
    allUsers.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    return allUsers.map((user) => {
      return {
        email: user.email,
        passwd: user.password,
        status: user.status,
        userIdx: user.userIdx,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });
  };
}
module.exports = UserService;
