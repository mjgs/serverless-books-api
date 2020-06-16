const Joi = require('joi');

module.exports.invalidRequestBodySchema = Joi.object().keys({
  message: Joi.string().valid('Invalid request body').required()
});

module.exports.notFoundSchema = Joi.object().keys({
  status: Joi.number().valid(404).required(),
  message: Joi.string().valid('Not found').required()
});
