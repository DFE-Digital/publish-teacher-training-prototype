const notificationModel = require('../models/notifications')
const organisationModel = require('../models/organisations')
const userModel = require('../models/users')

/// ------------------------------------------------------------------------ ///
/// SHOW USER ACCOUNT
/// ------------------------------------------------------------------------ ///

exports.user_account = (req, res) => {
  const user = userModel.findOne({ userId: req.session.passport.user.id })

  res.render('../views/account/index', {
    user,
    actions: {
      notifications: '/account/notifications',
      personalDetails: '/account/personal-details'
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// SHOW PERSONAL DETAILS
/// ------------------------------------------------------------------------ ///

exports.personal_details = (req, res) => {
  const user = userModel.findOne({ userId: req.session.passport.user.id })

  res.render('../views/account/personal-details/details', {
    user,
    actions: {}
  })
}

/// ------------------------------------------------------------------------ ///
/// SHOW NOTIFICATIONS
/// ------------------------------------------------------------------------ ///

exports.notification_details = (req, res) => {
  const user = userModel.findOne({ userId: req.session.passport.user.id })

  user.organisations.forEach((organisation, i) => {
    organisation.type = organisationModel.findOne({ organisationId: organisation.id }).type
  })

  const notificationOptions = require('../data/dist/notification-types')

  res.render('../views/account/notifications/details', {
    user,
    notificationOptions,
    actions: {
      change: '/account/notifications'
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// EDIT NOTIFICATIONS
/// ------------------------------------------------------------------------ ///

exports.edit_notifications_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const user = userModel.findOne({ userId: req.session.passport.user.id })

  let notificationOptions = require('../data/dist/notification-types')
  notificationOptions = notificationOptions.filter(option => option.providerTypes.includes(organisation.type))

  const notifications = user.organisations.find(
    organisation => organisation.id === req.params.organisationId
  ).notifications

  res.render('../views/account/notifications/edit', {
    organisation,
    user,
    notificationOptions,
    notifications,
    actions: {
      save: `/account/notifications/organisations/${req.params.organisationId}/edit`,
      back: '/account/notifications',
      cancel: '/account/notifications'
    }
  })
}

exports.edit_notifications_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const user = userModel.findOne({ userId: req.session.passport.user.id })

  const errors = []

  if (errors.length) {
    res.render('../views/account/notifications/edit', {
      organisation,
      user,
      notificationOptions,
      notifications: req.session.data.notifications,
      actions: {
        save: `/account/notifications/organisations/${req.params.organisationId}/edit`,
        back: '/account/notifications',
        cancel: '/account/notifications'
      },
      errors
    })
  } else {
    const notifications = []

    for (const [key, value] of Object.entries(req.session.data.notifications)) {
      if (value === 'on') {
        notifications.push(key)
      }
    }

    notificationModel.updateOne({
      organisationId: req.params.organisationId,
      userId: req.session.passport.user.id,
      notifications
    })

    req.flash('success', 'Email notifications updated')
    res.redirect('/account/notifications')
  }
}
