const Joi = require('joi');

module.exports.invalidRequestBodySchema = Joi.object().keys({
  message: Joi.string().valid('Invalid request body').required()
});

module.exports.notFoundSchema = Joi.object().keys({
  status: Joi.number().valid(404).required(),
  message: Joi.string().valid('Not found').required()
});

module.exports.bookSchema = Joi.object().keys({
  uuid: Joi.string().required(),
  name: Joi.string().required(),
  releaseDate: Joi.number().required(),
  authorName: Joi.string().required()
});
