const courseModel = require('../models/courses')
const organisationModel = require('../models/organisations')
const accreditedBodyModel = require('../models/accredited-bodies')
const organisationHelper = require('../helpers/organisations')
const permissionsHelper = require('../helpers/permissions')

exports.accredited_bodies_list = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  // const accreditedBodies = accreditedBodyModel.findMany({ organisationId: req.params.organisationId })

  // clear out the session
  delete req.session.data.accreditedBody

  res.render('../views/accredited-bodies/list', {
    organisation,
    // accreditedBodies,
    actions: {
      new: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}`
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// EDIT ACCREDITED PROVIDER
/// ------------------------------------------------------------------------ //

exports.edit_accredited_body_description_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const accreditedBody = organisation.accreditedBodies.find(accreditedBody => accreditedBody.id === req.params.accreditedBodyId)

  res.render('../views/accredited-bodies/description', {
    organisation,
    accreditedBody,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/${req.params.accreditedBodyId}/description`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
    }
  })
}

exports.edit_accredited_body_description_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const accreditedBody = organisation.accreditedBodies.find(accreditedBody => accreditedBody.id === req.params.accreditedBodyId)
  accreditedBody.description = req.session.data.accreditedBody.description

  const errors = []

  if (errors.length) {
    res.render('../views/accredited-bodies/description', {
      organisation,
      accreditedBody,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/${req.params.accreditedBodyId}/description`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
      },
      errors
    })
  } else {
    accreditedBodyModel.updateOne({
      organisationId: req.params.organisationId,
      accreditedBodyId: req.params.accreditedBodyId,
      accreditedBody
    })

    req.flash('success', 'Accredited provider description updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`)
  }
}

exports.edit_accredited_body_permissions_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const accreditedBody = organisation.accreditedBodies.find(accreditedBody => accreditedBody.id === req.params.accreditedBodyId)

  let selectedPermissions
  if (accreditedBody && accreditedBody.permissions) {
    selectedPermissions = accreditedBody.permissions
  }

  const permissionsOptions = permissionsHelper.getPermissionsOptions(selectedPermissions)

  res.render('../views/accredited-bodies/permissions', {
    organisation,
    accreditedBody,
    permissionsOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/${req.params.accreditedBodyId}/permissions`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
    }
  })
}

exports.edit_accredited_body_permissions_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const accreditedBody = organisation.accreditedBodies.find(accreditedBody => accreditedBody.id === req.params.accreditedBodyId)
  accreditedBody.permissions = req.session.data.accreditedBody.permissions

  let selectedPermissions
  if (accreditedBody && accreditedBody.permissions) {
    selectedPermissions = accreditedBody.permissions
  }

  const permissionsOptions = permissionsHelper.getPermissionsOptions(selectedPermissions)

  const errors = []

  if (errors.length) {
    res.render('../views/accredited-bodies/permissions', {
      organisation,
      accreditedBody,
      permissionsOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/${req.params.accreditedBodyId}/permissions`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
      },
      errors
    })
  } else {
    accreditedBodyModel.updateOne({
      organisationId: req.params.organisationId,
      accreditedBodyId: req.params.accreditedBodyId,
      accreditedBody
    })

    req.flash('success', 'Accredited provider permissions updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`)
  }
}

/// ------------------------------------------------------------------------ ///
/// NEW ACCREDITED PROVIDER
/// ------------------------------------------------------------------------ //

exports.new_accredited_body_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  let selectedAccreditedBody
  if (req.session.data.accreditedBody && req.session.data.accreditedBody.id) {
    selectedAccreditedBody = req.session.data.accreditedBody.id
  }

  const accreditedBodyOptions = organisationHelper.getAccreditedBodyAutocompleteOptions(selectedAccreditedBody)

  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
  if (req.query.referrer === 'check') {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`
  }

  res.render('../views/accredited-bodies/new', {
    organisation,
    accreditedBodyOptions,
    selectedAccreditedBody,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new`,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
    }
  })
}

exports.new_accredited_body_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  let selectedAccreditedBody
  if (req.session.data.accreditedBody && req.session.data.accreditedBody.id) {
    selectedAccreditedBody = req.session.data.accreditedBody.id
  }

  const accreditedBodyOptions = organisationHelper.getAccreditedBodyAutocompleteOptions(selectedAccreditedBody)

  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
  if (req.query.referrer === 'check') {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`
  }

  const errors = []

  // if (!selectedAccreditedBody) {
  //   const error = {}
  //   error.fieldName = 'accredited-body'
  //   error.href = '#accredited-body'
  //   error.text = 'Enter an accredited provider'
  //   errors.push(error)
  // }

  if (errors.length) {
    res.render('../views/accredited-bodies/new', {
      organisation,
      accreditedBodyOptions,
      selectedAccreditedBody,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new`,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/description`)
  }
}

exports.new_accredited_body_description_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new`
  if (req.query.referrer === 'check') {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`
  }

  res.render('../views/accredited-bodies/description', {
    organisation,
    accreditedBody: req.session.data.accreditedBody,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/description`,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
    }
  })
}

exports.new_accredited_body_description_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new`
  if (req.query.referrer === 'check') {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`
  }

  const errors = []

  if (errors.length) {
    res.render('../views/accredited-bodies/description', {
      organisation,
      accreditedBody: req.session.data.accreditedBody,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/description`,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/permissions`)
  }
}

exports.new_accredited_body_permissions_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  let selectedPermissions
  if (req.session.data.accreditedBody && req.session.data.accreditedBody.permissions) {
    selectedPermissions = req.session.data.accreditedBody.permissions
  }

  const permissionsOptions = permissionsHelper.getPermissionsOptions(selectedPermissions)

  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/description`
  if (req.query.referrer === 'check') {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`
  }

  res.render('../views/accredited-bodies/permissions', {
    organisation,
    accreditedBody: req.session.data.accreditedBody,
    permissionsOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/permissions`,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
    }
  })
}

exports.new_accredited_body_permissions_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  let selectedPermissions
  if (req.session.data.accreditedBody && req.session.data.accreditedBody.permissions) {
    selectedPermissions = req.session.data.accreditedBody.permissions
  }

  const permissionsOptions = permissionsHelper.getPermissionsOptions(selectedPermissions)

  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/description`
  if (req.query.referrer === 'check') {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`
  }

  const errors = []

  if (errors.length) {
    res.render('../views/accredited-bodies/permissions', {
      organisation,
      accreditedBody: req.session.data.accreditedBody,
      permissionsOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/permissions`,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`)
  }
}

exports.new_accredited_body_check_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  res.render('../views/accredited-bodies/check-your-answers', {
    organisation,
    accreditedBody: req.session.data.accreditedBody,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/permissions`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
    }
  })
}

exports.new_accredited_body_check_post = (req, res) => {
  accreditedBodyModel.insertOne({
    organisationId: req.params.organisationId,
    accreditedBody: req.session.data.accreditedBody
  })

  req.flash('success', 'Accredited provider added')
  res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`)
}

/// ------------------------------------------------------------------------ ///
/// DELETE ACCREDITED PROVIDER
/// ------------------------------------------------------------------------ ///

exports.delete_accredited_body_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const accreditedBody = organisation.accreditedBodies.find(accreditedBody => accreditedBody.id === req.params.accreditedBodyId)

  const courses = courseModel
    .findMany({ organisationId: req.params.organisationId })
    .filter(course => course.accreditedBody.id === req.params.accreditedBodyId)

  const hasCourses = !!courses.length

  res.render('../views/accredited-bodies/delete', {
    organisation,
    accreditedBody,
    hasCourses,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/${req.params.accreditedBodyId}/delete`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
    }
  })
}

exports.delete_accredited_body_post = (req, res) => {
  accreditedBodyModel.deleteOne({
    organisationId: req.params.organisationId,
    accreditedBodyId: req.params.accreditedBodyId
  })

  req.flash('success', 'Accredited provider deleted')
  res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`)
}

/// ------------------------------------------------------------------------ ///
/// ACCREDITED PROVIDER SUGGESTIONS FOR AUTOCOMPLETE
/// ------------------------------------------------------------------------ ///

exports.accredited_provider_suggestions_json = (req, res) => {
  req.headers['Access-Control-Allow-Origin'] = true

  let providers
  providers = organisationModel.findMany({
    isAccreditedBody: true,
    query: req.query.query
  })

  providers.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })

  res.json(providers)
}
