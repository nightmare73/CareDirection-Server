const moment = require('moment')
const { Transaction, getConnection } = require('../lib/dbConnection')
const productDao = require('../dao/productDao')

exports.importDose = async (req, next) => {
  const connection = await getConnection()
  try {
    const result = await productDao.importDose(connection, req, next)
    // result[0].image_key = getSignedUrl.getSignedResizedUrl(result[0].image_key)
    console.log('결과다 이거~~')
    console.log(result)
    return result
  } catch (e) {
    console.log(e.message)
    return e.message
  } finally {
    connection.release()
  }
}
exports.enrollDose = async (req, next) => {
  try {
    const result = await productDao.enrollDose(Transaction, req, next)
    return result
  } catch (e) {
    console.log(e.message)
    return e.message
  }
}

// 제품 등록 service
exports.insertProduct = async (next, data) => {
  try {
    await productDao.insertProduct(Transaction, data, next)
  } catch (e) {
    console.log(e.message)
    return e.message
  }
}

exports.checkProductDose = async (req, next) => {
  try {
    const currentTime = moment().format('YYYY[-]MM[-]DD')
    console.log(currentTime)
    const result = await productDao.checkProductDose(Transaction, req, currentTime, next)
    return result
  } catch (e) {
    console.log(e.message)
    return e.message
  }
}
