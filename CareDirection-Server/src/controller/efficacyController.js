const Joi = require('@hapi/joi')
const efficacyService = require('../service/efficacyService')
const response = require('../lib/response')
const message = require('../lib/responseMessage')
const statusCode = require('../lib/statusCode')

exports.insertEfficacy = async (req, res) => {
  const validationChecker = Joi.object({
    efficacy_name: Joi.string().required(),
  })

  try {
    const validationResult = await validationChecker.validateAsync(req.body)
    if (validationResult.error) {
      throw new Error(403)
    }

    await efficacyService.insertEfficacy(req)
    response.respondJsonWithoutData(message.EFFICACY_INSERT_SUCCESS, res, statusCode.CREATED)
  } catch (e) {
    console.log(e.message)
    response.respondOnError(message.INSERT_FAILED, res, statusCode.FORBIDDEN)
  }
}

exports.getEfficacyList = async (req, res) => {
  try {
    const efficacyList = await efficacyService.getEfficacyList()
    response.respondJson(message.EFFICACY_SELECTED, efficacyList, res, statusCode.OK)
  } catch (e) {
    console.log(e.message)
    response.respondOnError(message.DB_ERROR, res, statusCode.DB_ERROR)
  }
}

exports.getNutrientsListPerEfficacy = async (req, res) => {
  const validationChecker = Joi.object({
    efficacy_idx: Joi.number().integer().required(),
  })

  try {
    await validationChecker.validateAsync(req.params)
  } catch (e) {
    response.respondOnError(message.VALUE_MUST_INTEGER, res, statusCode.BAD_REQUEST)
    return
  }

  try {
    const nutrientList = await efficacyService.getNutrientsListPerEfficacy(req)
    response.respondJson(message.SELECT_SUCCESS, nutrientList, res, statusCode.OK)
  } catch (e) {
    console.log(e.message)
    response.respondOnError(e.message, res, statusCode.DB_ERROR)
  }
}


exports.getNutrientsListPerEfficacyUsingName = async (req, res, next) => {
  const { name } = req.params

  const schema = Joi.object({
    efficacy_name: Joi.string().required(),
  })

  try {
    await schema.validateAsync(name)
  } catch (e) {
    response.respondOnError(message.VALUE_MUST_INTEGER, name, statusCode.BAD_REQUEST)
    return
  }

  try {
    const nutrientList = await efficacyService.getNutrientsListPerEfficacyUsingName(req, next)
    console.log("nutrientList:",nutrientList)
    response.respondJson(message.SELECT_SUCCESS, nutrientList, res, statusCode.OK)
  } catch (e) {
    console.log("error:",e.message)
    response.respondOnError(e.message, res, statusCode.DB_ERROR)
  }
}


exports.getMyEfficacyList = async (req, res) => {
  const { token } = req.headers

  const schema = Joi.object({
    token: Joi.string().required(),
  })

  const validationData = { token }

  try {
    const { error } = await schema.validateAsync(validationData)

    if (error) {
      throw new Error(403)
    }

    const efficacyList = await efficacyService.getMyEfficacyList(req)

    const efficacyResultList = efficacyList.map((idx) => {
      return idx.efficacy_name
    })

    response.respondJson(message.MY_EFFICACY_SUCCESS, efficacyResultList, res, statusCode.OK)
  } catch (e) {
    console.log(e.message)
    response.respondOnError(message.DB_ERROR, res, statusCode.DB_ERROR)
  }
}
