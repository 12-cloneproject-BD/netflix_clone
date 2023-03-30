const { Profile } = require("../models");

class ProfileRepository extends Profile {
  constructor() {
    super();
  }

  //프로필 생성
  createProfile = async (profileName, userIdx) => {
    const createProfile = await Profile.create({ profileName, userIdx });
    return createProfile;
  };

  //전체 프로필 조회
  getAllProfile = async (userIdx) => {
    const profile = await Profile.findAll({
      attributes: [
        'profileIdx',
        'userIdx',
        'profileName',
        'profileImgUrl',
        'viewLimit',
        'status',
        'createdAt',
        'updatedAt',
      ],
      where: {userIdx},

      order: [['createdAt', 'DESC']], // 생성일 기준으로 내림차순 정렬
      raw: true, // raw: true를 하면 데이터를 JSON 형태로 반환해준다.
    });
    return profile; // 변환된 데이터 배열 반환
  };

  //프로필 조회
  getProfile = async (profileIdx) => {
    const profile = await Profile.findOne({
      attributes: [
        'profileIdx',
        'userIdx',
        'profileName',
        'profileImgUrl',
        'viewLimit',
        'status',
        'createdAt',
        'updatedAt',
      ],
      where: {profileIdx},
      raw: true, // raw: true를 하면 데이터를 JSON 형태로 반환해준다.
    });
    return profile; // 변환된 데이터 배열 반환
  };

  //프로필이 존재하는지 확인하는 함수
  existProfileChk = async (profileIdx) => {
    const findProfileName = await Profile.findOne({
      where: { profileIdx },
    });
    return findProfileName;
  };

  //프로필 삭제, 수정 권한 확인
  authProfileChk = async (profileIdx) => {
    const findProfileAuth = await Profile.findOne({
      where: { profileIdx },
    });
    return findProfileAuth;
  };

  //프로필 수정
  updateProfile = async (profileName, profileIdx) => {
    const updatedProfile = await Profile.update(
      {profileName},
      {where: { profileIdx }}
    );
    return updatedProfile;
  }

  //프로필 삭제
  deleteProfile = async (profileIdx) => {
    const updatedProfile = await Profile.destroy({
      where: { profileIdx },
    });
    return updatedProfile;
  }
}

module.exports = ProfileRepository;