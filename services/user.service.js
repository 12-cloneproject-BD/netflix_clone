require('dotenv').config();

const Joi = require('joi');
const UserRepository = require('../repositories/user.repository');
const jwt = require('jsonwebtoken');
const { createHashPassword, comparePassword } = require('../modules/cryptoUtils.js');
const Boom = require('boom');
const logger = require('../middlewares/logger.js')

const re_email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const re_password = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(re_password).required()
});

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }
  userLogin = async (email, password) => {

    const user = await this.userRepository.findByID(email);
      
    if (!user) {
        throw Boom.notFound('존재하지 않는 회원입니다', false);
    }

    const comparePw = await comparePassword(password, user.password);

    if (!comparePw) {
        throw Boom.unauthorized('패스워드를 확인해주세요.', false);
    }
  };

  generateToken = async (email) => {
    const token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: '60m',
    });

    return token;
  };

  userSignup = async (email, nickname, password) => {
    try {
    await userSchema.validate({ email, password });
    
    if (email.search(re_email) === -1) {
      throw Boom.badData('유효하지 않은 이메일 주소 입니다.', false);
    }

    if (password.search(re_password) === -1) {
      throw Boom.badData('유효하지 않은 패스워드 입니다.', false);
    }

    const existingUser = await this.userRepository.findByID( email );
    if (existingUser) {
      throw Boom.badData('중복된 아이디 입니다', false);
    }

    const existNickname = await this.userRepository.findBynickname( nickname );

    if (existNickname) {
      throw Boom.badData('중복된 닉네임 입니다', false);
    }

    const hashedPassword = await createHashPassword(password);

    await this.userRepository.userSignup(
      email,
      nickname,
      hashedPassword,
    );
    } catch (error) {
      logger.error(error.message, { email, nickname });
    throw error;
  }
  };

  getAllusers = async () => {
    const allUsers = await this.userRepository.getAllusers();
    allUsers.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    return allUsers.map((user) => {
      return {
        userId: user.userId,
        email: user.email,
        nickname: user.nickname,
        passwd: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });
  }
  
}
module.exports = UserService;