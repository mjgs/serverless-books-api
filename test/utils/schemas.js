const Joi = require('joi');

module.exports.invalidRequestBodySchema = Joi.object().keys({
  message: Joi.string().valid('Invalid request body').required()
});