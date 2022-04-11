const userModel = require('../models/users')
const organisationModel = require('../models/organisations')
const validationHelper = require('../helpers/validators')

/// ------------------------------------------------------------------------ ///
/// SHOW USER
/// ------------------------------------------------------------------------ ///

exports.user_list = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const users = userModel.findMany({ organisationId: req.params.organisationId })

  users.sort((a, b) => {
    return a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName)
  })

  res.render('../views/users/list', {
    organisation,
    users,
    actions: {
      new: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users/new`,
      view: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users`,
      back: `/`
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// SHOW USER
/// ------------------------------------------------------------------------ ///

exports.user_details = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const user = userModel.findOne({ userId: req.params.userId })

  const signedInUser = userModel.findOne({ userId: req.session.passport.user.id })

  res.render('../views/users/details', {
    organisation,
    user,
    signedInUser,
    actions: {
      delete: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users/${req.params.userId}/delete`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users`
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// NEW USER
/// ------------------------------------------------------------------------ ///

exports.new_user_get = (req, res) => {
  res.render('../views/users/edit', {
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users/new`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users`
    }
  })
}

exports.new_user_post = (req, res) => {
  const errors = []

  if (!req.session.data.user.firstName.length) {
    const error = {}
    error.fieldName = 'firstName'
    error.href = '#firstName'
    error.text = 'Enter a first name'
    errors.push(error)
  }

  if (!req.session.data.user.lastName.length) {
    const error = {}
    error.fieldName = 'lastName'
    error.href = '#lastName'
    error.text = 'Enter a last name'
    errors.push(error)
  }

  const user = userModel.findOne({
    organisationId: req.params.organisationId,
    email: req.session.data.user.email
  })

  if (!req.session.data.user.email.length) {
    const error = {}
    error.fieldName = 'email'
    error.href = '#email'
    error.text = 'Enter an email address'
    errors.push(error)
  } else if (!validationHelper.isValidEmail(req.session.data.user.email)) {
    const error = {}
    error.fieldName = 'email'
    error.href = '#email'
    error.text = 'Enter an email address in the correct format, like name@example.com'
    errors.push(error)
  } else if (user) {
    const error = {}
    error.fieldName = 'email'
    error.href = '#email'
    error.text = 'Email address already in use'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/users/edit', {
      user: req.session.data.user,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users/new`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users`
      },
      errors
    })
  } else {
    userModel.saveOne({
      organisationId: req.params.organisationId,
      user: req.session.data.user
    })

    req.flash('success','User added')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users`)
  }
}

/// ------------------------------------------------------------------------ ///
/// EDIT USER
/// ------------------------------------------------------------------------ ///

exports.edit_user_get = (req, res) => {
  const user = userModel.findOne({ organisationId: req.params.organisationId, userId: req.params.userId })

  res.render('../views/users/edit', {
    user,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users/${req.params.userId}`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users/${req.params.userId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users/${req.params.userId}`
    }
  })
}

exports.edit_user_post = (req, res) => {
  const errors = []

  if (!req.session.data.user.firstName.length) {
    const error = {}
    error.fieldName = 'firstName'
    error.href = '#firstName'
    error.text = 'Enter a first name'
    errors.push(error)
  }

  if (!req.session.data.user.lastName.length) {
    const error = {}
    error.fieldName = 'lastName'
    error.href = '#lastName'
    error.text = 'Enter a last name'
    errors.push(error)
  }

  if (!validationHelper.isValidEmail(req.session.data.user.email)) {
    const error = {}
    error.fieldName = 'email'
    error.href = '#email'
    error.text = 'Enter an email address'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/users/edit', {
      user: req.session.data.user,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users/${req.params.userId}`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users/${req.params.userId}`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users/${req.params.userId}`
      },
      errors
    })
  } else {
    userModel.saveOne({
      organisationId: req.params.organisationId,
      userId: req.params.userId,
      user: req.session.data.user
    })

    req.flash('success','User updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users/${req.params.userId}`)
  }
}

/// ------------------------------------------------------------------------ ///
/// DELETE USER
/// ------------------------------------------------------------------------ ///

exports.delete_user_get = (req, res) => {
  const user = userModel.findOne({ organisationId: req.params.organisationId, userId: req.params.userId })

  res.render('../views/users/delete', {
    user,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users/${req.params.userId}/delete`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users/${req.params.userId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users/${req.params.userId}`
    }
  })
}

exports.delete_user_post = (req, res) => {
  userModel.deleteOne({
    organisationId: req.params.organisationId,
    userId: req.params.userId
  })

  req.flash('success','User deleted')
  res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users`)
}
