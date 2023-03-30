const ProfileService = require("../services/profile.service");

class ProfileController {
  constructor() {
    this.profileService = new ProfileService();
  }

  /**
   * @param {import("express").Request} req - express Request
   * @param {import("express").Response} res - express Response
   * @param {import("express").NextFunction} next - express Response
   * **/
  //프로필 생성
  createProfile = async (req, res, next) => {
    try {
      const { profileName } = req.body;
      const { userIdx } = res.locals.user
      await this.profileService.createProfile(profileName, userIdx);

      return res.status(201).json({ message: "프로필 생성에 성공하였습니다." });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @param {import("express").Request} req - express Request
   * @param {import("express").Response} res - express Response
   * @param {import("express").NextFunction} next - express Response
   * **/
  //모든 프로필 조회
  getAllProfile = async (req, res, next) => {
    try {

      const { userIdx } = res.locals.user
      const profile = await this.profileService.getAllProfile(userIdx);

      return res.status(200).json({ allProfiles: profile });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @param {import("express").Request} req - express Request
   * @param {import("express").Response} res - express Response
   * @param {import("express").NextFunction} next - express Response
   * **/
  //프로필 조회
  getProfile = async (req, res, next) => {
    try {

      const { profileIdx } = req.params;
      const profile = await this.profileService.getProfile(profileIdx);

      return res.status(200).json({ ProfileInfo: profile });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @param {import("express").Request} req - express Request
   * @param {import("express").Response} res - express Response
   * @param {import("express").NextFunction} next - express Response
   * **/
  //프로필 로그인 (프로필 선택)
  profileLogin = async (req, res, next) => {
    try {
      res.clearHeaders;

      const { profileIdx } = req.params;
      await this.profileService.profileLogin(profileIdx);

      const token = await this.profileService.generateToken(profileIdx);
      res.set("Authorization", `Bearer ${token}`);

      return res.status(201).json({ message: "로그인에 성공했습니다" });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @param {import("express").Request} req - express Request
   * @param {import("express").Response} res - express Response
   * @param {import("express").NextFunction} next - express Response
   * **/
  //프로필 수정
  updateProfile = async (req, res, next) => {
    try {
      const { profileIdx } = req.params;
      const { profileName } = req.body;
      await this.profileService.updateProfile(profileName, profileIdx); 
        
      return res.status(200).json({ message: '프로필을 수정하였습니다.' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @param {import("express").Request} req - express Request
   * @param {import("express").Response} res - express Response
   * @param {import("express").NextFunction} next - express Response
   * **/
  //프로필 삭제
  deleteProfile = async (req, res, next) => {
    try {
      const { profileIdx } = req.params;
      await this.profileService.deleteProfile( profileIdx); 
        
      return res.status(200).json({ message: '프로필을 삭제하였습니다.' });
    } catch (error) {
      next(error);
    }
  };

}

module.exports = ProfileController;