const ProfileRepository = require("../repositories/profile.repository");
const Boom = require("boom");
const logger = require("../middlewares/logger.js");
const jwt = require("jsonwebtoken");

class ProfileService {
  constructor() {
    this.profileRepository = new ProfileRepository();
  }

  /**
   * @param {String} profileName
   * @param {UUID} userIdx
   */
  //프로필 생성
  createProfile = async (profileName, userIdx) => {
    try {
      await this.profileRepository.createProfile(profileName, userIdx);
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  };

  /**
   * @param {UUID} userIdx
   */
  //전체 프로필 조회
  getAllProfile = async (userIdx) => {
    try {
      const allProfiles = await this.profileRepository.getAllProfile(userIdx);
      
      allProfiles.sort((a, b) => {
        return b.createdAt - a.createdAt;
      });

      return allProfiles.map((profile) => {
        return {
          profileIdx: profile.profileIdx,
          userIdx: profile.userIdx,
          profileName: profile.profileName,
          profileImgUrl: profile.profileImgUrl,
          viewLimit: profile.viewLimit,
          status: profile.status,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
        };
      });
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  };

  /**
   * @param {UUID} profileIdx
   */
  //프로필 조회
  getProfile = async (profileIdx) => {
    try {
      const profile = await this.profileRepository.getProfile(profileIdx);

        return {
          profileIdx: profile.profileIdx,
          userIdx: profile.userIdx,
          profileName: profile.profileName,
          profileImgUrl: profile.profileImgUrl,
          viewLimit: profile.viewLimit,
          status: profile.status,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
        };

    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  };
  
  /**
   * @param {UUID} profileIdx
   */
  //프로필 로그인 (프로필 선택)
  profileLogin = async (profileIdx) => {
    try {
      const existProfile = await this.profileRepository.existProfileChk(profileIdx);

      if (!existProfile) {
        throw Boom.notFound("존재하지 않는 프로필 입니다");
      }

    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  };

  /**
   * @param {UUID} profileIdx
   */
  //토큰 생성 (로그인)
  generateToken = async (profileIdx) => {
    const token = jwt.sign({ profileIdx }, process.env.SECRET_KEY, {
      expiresIn: "60m",
    });

    return token;
  };

  /**
   * @param {String} profileName
   * @param {UUID} profileIdx
   */
  //프로필 수정
  updateProfile = async (profileName, profileIdx) => {
    try {
      const existProfile = await this.profileRepository.existProfileChk(profileIdx);
      if (!existProfile) {
        throw Boom.notFound("존재하지 않는 프로필 입니다");
      }

      const authorizedProfile = await this.profileRepository.authProfileChk(profileIdx);
      if (!authorizedProfile) {
        throw Boom.notFound("수정 권한이 없습니다");
      }

      await this.profileRepository.updateProfile(profileName, profileIdx);
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  };

  /**
   * @param {UUID} profileIdx
   */
  //프로필 삭제
  deleteProfile = async (profileIdx) => {
    try {
      const existProfile = await this.profileRepository.existProfileChk(profileIdx);
      if (!existProfile) {
        throw Boom.notFound("존재하지 않는 프로필 입니다");
      }

      const authorizedProfile = await this.profileRepository.authProfileChk(profileIdx);
      if (!authorizedProfile) {
        throw Boom.notFound("삭제 권한이 없습니다");
      }
      
      await this.profileRepository.deleteProfile(profileIdx);
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  };
}

module.exports = ProfileService;
