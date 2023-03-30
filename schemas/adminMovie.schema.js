const Joi = require("joi");

const messages = {
  "string.base": "이 필드는 문자열로 이루어져야 합니다.",
  "string.empty": "이 필드는 비어 있을 수 없습니다.",
  "string.min": "이 필드는 최소 {{#limit}} 문자 이상이어야 합니다.",
  "string.max": "이 필드는 최대 {{#limit}} 문자 이하여야 합니다.",
  "any.required": "이 필드는 필수입니다.",
};

const schema = Joi.object({
    name: Joi.string()
      .min(1)
      .max(30)
      .messages({
        ...messages,
        "string.min": "이 필드는 최소 {{#limit}} 문자 이상이어야 합니다.",
        "string.max": "이 필드는 최대 {{#limit}} 문자 이하여야 합니다.",
      }),
    kind: Joi.string()
      .min(1)
      .max(30)
      .message({
        ...messages,
        "string.min": "이 필드는 최소 {{#limit}} 문자 이상이어야 합니다.",
        "string.max": "이 필드는 최대 {{#limit}} 문자 이하여야 합니다.",
      }),
    desc: Joi.string()
      .min(1)
      .max(300)
      .message({
        ...messages,
        "string.min": "이 필드는 최소 {{#limit}} 문자 이상이어야 합니다.",
        "string.max": "이 필드는 최대 {{#limit}} 문자 이하여야 합니다.",
      }),
    playtime: Joi.any().message({
      ...messages,
      "any.required": "이 필드는 필수입니다.",
    }),
    viewLimit: Joi.string().message({
      ...messages,
      "any.required": "이 필드는 필수입니다.",
    }),
    status: Joi.string().message({
      ...messages,
      "any.required": "이 필드는 필수입니다.",
    }),
    videothumbUrl: Joi.string().message({
      ...messages,
      "any.required": "이 필드는 필수입니다.",
    }),
    videoUrl: Joi.string().message({
      ...messages,
      "any.required": "이 필드는 필수입니다.",
    }),
  });

  module.exports = schema;