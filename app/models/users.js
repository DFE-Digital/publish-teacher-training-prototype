const path = require('path')
const fs = require('fs')
const { v4: uuid } = require('uuid')

const organisationModel = require('./organisations')

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
  let user = {}

  if (params.organisationId) {
    user.id = uuid()

    if (params.user.firstName) {
      user.firstName = params.user.firstName
    }

    if (params.user.lastName) {
      user.lastName = params.user.lastName
    }

    if (params.user.email) {
      user.email = params.user.email
    }

    user.organisations = []

    const o = organisationModel.findOne({ organisationId: params.organisationId })

    const organisation = {}
    organisation.id = o.id
    organisation.code = o.code
    organisation.name = o.name
    organisation.roles = []

    user.organisations.push(organisation)

    user.createdAt = new Date()

    // const directoryPath = path.join(__dirname, '../data/users/')
    //
    // const filePath = directoryPath + '/' + user.id + '.json'
    //
    // // create a JSON sting for the submitted data
    // const fileData = JSON.stringify(user)
    //
    // // write the JSON data
    // fs.writeFileSync(filePath, fileData)
  }

  return user
}

exports.updateOne = (params) => {
  if (params.organisationId && params.userId) {
    let user = this.findOne({ organisationId: params.organisationId, userId: params.userId })

    if (params.user.firstName) {
      user.firstName = params.user.firstName
    }

    if (params.user.lastName) {
      user.lastName = params.user.lastName
    }

    if (params.user.email) {
      user.email = params.user.email
    }

    user.updatedAt = new Date()

    // const directoryPath = path.join(__dirname, '../data/users/')
    //
    // const filePath = directoryPath + '/' + params.userId + '.json'
    //
    // // create a JSON sting for the submitted data
    // const fileData = JSON.stringify(user)
    //
    // // write the JSON data
    // fs.writeFileSync(filePath, fileData)
  }
}

exports.deleteOne = (params) => {

}
