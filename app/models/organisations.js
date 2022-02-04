exports.find = (params) => {

}

exports.findOne = (id) => {
  let organisations = require('../data/temp/organisations')
  organisations = organisations.find(organisation => organisation.id === id)
  return organisations
}

exports.insertOne = (params) => {

}

exports.insertMany = (params) => {

}

exports.updateOne = (id, params) => {

}

exports.updateMany = (params) => {

}

exports.deleteOne = (id) => {

}

exports.deleteMany = (params) => {

}
