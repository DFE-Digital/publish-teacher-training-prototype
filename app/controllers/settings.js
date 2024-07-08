const settingModel = require('../models/settings')

exports.settings_form_get = (req, res) => {
  const settings = require('../data/dist/settings.json')

  res.render('../views/settings/index', {
    settings,
    actions: {
      save: `/settings`,
      home: '/organisations'
    }
  })
}

exports.settings_form_post = (req, res) => {
  const errors = []

  settingModel.update({
    settings: req.session.data.settings
  })

  if (errors.length) {
    res.render('../views/settings/index', {
      wordCount,
      actions: {
        save: `/settings`,
        home: '/organisations'
      },
      errors
    })
  } else {
    req.flash('success', 'Settings updated')
    res.redirect('/settings')
  }
}
