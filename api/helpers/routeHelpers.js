const Joi = require('joi');

const authSchema = Joi.object({
  email:Joi.string().email().lowercase().trim().required(),
  password:Joi.string().trim().min(4).required()
})

module.exports = {authSchema}
