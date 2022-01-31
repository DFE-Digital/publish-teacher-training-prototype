exports.find = (params) => {
  let relationships = require('../data/organisation-relationships')
  relationships = relationships.find(relationship => relationship.code === params.organisationId)

  relationships.accreditedBodies.sort((a,b) => {
    return a.name.localeCompare(b.name)
  })

  return relationships
}

exports.findOne = (id) => {

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
