const path = require('path')
const fs = require('fs')
const { v4: uuid } = require('uuid')

exports.find = (params) => {
  let users = require('../data/users')

  if (params.organisationId) {
    users = users.filter(user => {
      return user.organisations.find(organisation => organisation.id === params.organisationId)
    })
  }

  if (params.userId) {
    users = users.find(user => user.id === params.userId)
  }

  return users
}

exports.findOne = (params) => {
  let user = {}

  if (params.organisationId && params.userId) {
    user = this.find({
      organisationId: params.organisationId,
      userId: params.userId
    })
  }

  return user
}

exports.insertOne = (params) => {

}

exports.updateOne = (params) => {

}

exports.deleteOne = (params) => {

}
