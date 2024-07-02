import Joi from 'joi'

const ClientValidation = {}

ClientValidation.create = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
  clientid: Joi.string().allow(''),
  textname: Joi.string().allow(''),
  textdescription: Joi.string().allow(''),
  groups: Joi.array().items(Joi.string()),
  roles: Joi.array().items(Joi.string())
})

ClientValidation.patch = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().allow('').min(6),
  clientid: Joi.string().allow(''),
  textname: Joi.string().allow(''),
  textdescription: Joi.string().allow(''),
  groups: Joi.array().items(Joi.string()),
  roles: Joi.array().items(Joi.string()),
  disabled: Joi.bool()
})

export default ClientValidation
