const { Users } = require('../models');

class UserRepository extends Users {
  constructor() {
    super();
  }

  /**
  * @param {String} email
  */
  //email 매칭 (로그인, 회원가입)
  findByID = async (email) => {
    const findEmail = await Users.findOne({
      where: { email },
    });
    return findEmail;
  }

  /**
  * @param {String} nickname
  */
  //nickname 매칭 (회원가입)
  findBynickname = async (nickname) => {
    const findNick = await Users.findOne({
      where: { nickname },
    });
    return findNick;
  };


  /**
  * @param {String} email
  * @param {String} nickname
  * @param {String} password
  */
  //user정보 생성(회원가입)
  userSignup = async (email, nickname, password) => {
    const createUser = await Users.create({ email, nickname, password });
    return createUser;
  };
  
  //user정보 조회
  getAllusers = async () => {
    const user = await Users.findAll({
      attributes: [
        'userId',
        'email',
        'nickname',
        'password',
        'createdAt',
        'updatedAt',
      ],
    });
    return user;
  }
}

module.exports = UserRepository;
