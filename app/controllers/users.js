const userModel = require('../models/users')
const organisationModel = require('../models/organisations')

/// ------------------------------------------------------------------------ ///
/// SHOW USER
/// ------------------------------------------------------------------------ ///

exports.user_list = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const users = userModel.find({ organisationId: req.params.organisationId })

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
  const user = userModel.findOne({ organisationId: req.params.organisationId, userId: req.params.userId })
console.log('Controller: ', user);
  res.render('../views/users/details', {
    organisation,
    user,
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
    // userModel.insertOne({
    //   organisationId: req.params.organisationId,
    //   user: req.session.data.user
    // })

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
    // userModel.updateOne({
    //   organisationId: req.params.organisationId,
    //   userId: req.params.userId,
    //   user: req.session.data.user
    // })

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
  const user = userModel.findOne({ organisationId: req.params.organisationId, userId: req.params.userId })
  const errors = []

  if (errors.length) {
    res.render('../views/users/delete', {
      user,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users/${req.params.userId}/delete`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users/${req.params.userId}`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users/${req.params.userId}`
      },
      errors
    })
  } else {
    userModel.deleteOne({
      organisationId: req.params.organisationId,
      userId: req.params.userId
    })

    req.flash('success','User deleted')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/users`)
  }
}
