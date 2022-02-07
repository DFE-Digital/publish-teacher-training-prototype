exports.find = (params) => {

}

exports.findOne = (params) => {
  const organisations = require('../data/temp/organisations')
  const organisation = organisations.find(organisation => organisation.id === params.organisationId)
  return organisation
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
