const notificationModel = require('../models/notifications')
const organisationModel = require('../models/organisations')
const userModel = require('../models/users')

/// ------------------------------------------------------------------------ ///
/// SHOW USER
/// ------------------------------------------------------------------------ ///

exports.user_details = (req, res) => {
  const user = userModel.find({ userId: req.session.passport.user.id })

  res.render('../views/account/details', {
    user,
    actions: {}
  })
}

/// ------------------------------------------------------------------------ ///
/// EDIT NOTIFICATIONS
/// ------------------------------------------------------------------------ ///

exports.edit_notifications_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const user = userModel.find({ userId: req.session.passport.user.id })

  const notifications = user.organisations.find(
    organisation => organisation.id === req.params.organisationId
  ).notifications

  res.render('../views/account/notifications', {
    organisation,
    user,
    notifications,
    actions: {
      save: `/account/organisations/${req.params.organisationId}/notifications`,
      back: `/account`,
      cancel: `/account`
    }
  })
}

exports.edit_notifications_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const user = userModel.find({ userId: req.session.passport.user.id })

  const errors = []

  if (errors.length) {
    res.render('../views/account/notifications', {
      organisation,
      user,
      actions: {
        save: `/account/organisations/${req.params.organisationId}/notifications`,
        back: `/account`,
        cancel: `/account`
      },
      errors
    })
  } else {

    const notifications = []

    for (const [key, value] of Object.entries(req.session.data.notifications)) {
      if (value === 'yes') {
        notifications.push(key)
      }
    }

    notificationModel.updateOne({
      organisationId: req.params.organisationId,
      userId: req.session.passport.user.id,
      notifications
    })

    req.flash('success','Email notifications updated')
    res.redirect(`/account`)
  }
}
