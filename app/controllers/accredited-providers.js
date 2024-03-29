const courseModel = require('../models/courses')
const organisationModel = require('../models/organisations')
const accreditedProviderModel = require('../models/accredited-providers')
const organisationHelper = require('../helpers/organisations')
const permissionsHelper = require('../helpers/permissions')

const validationHelper = require("../helpers/validators")

exports.accredited_providers_list = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  organisation.accreditedBodies.sort((a,b)=> {
    return a.name.localeCompare(b.name)
  })

  // clear out the session
  delete req.session.data.accreditedProvider

  res.render('../views/accredited-providers/list', {
    organisation,
    actions: {
      new: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}`
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// EDIT ACCREDITED PROVIDER
/// ------------------------------------------------------------------------ //

exports.edit_accredited_provider_description_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const accreditedProvider = organisation.accreditedBodies.find(accreditedBody => accreditedBody.id === req.params.accreditedBodyId)

  const wordCount = 100

  res.render('../views/accredited-providers/description', {
    organisation,
    accreditedProvider,
    wordCount,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/${req.params.accreditedBodyId}/description?referrer=change`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers`
    }
  })
}

exports.edit_accredited_provider_description_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const accreditedProvider = organisation.accreditedBodies.find(accreditedBody => accreditedBody.id === req.params.accreditedBodyId)
  accreditedProvider.description = req.session.data.accreditedProvider.description

  const wordCount = 100

  const errors = []

  if (!accreditedProvider.description.length) {
    const error = {}
    error.fieldName = 'accredited-provider-description'
    error.href = '#accredited-provider-description'
    error.text = 'Enter details about the accredited provider'
    errors.push(error)
  } else if (
    !validationHelper.isValidWordCount(accreditedProvider.description, wordCount)
  ) {
    const error = {}
    error.fieldName = 'accredited-provider-description'
    error.href = '#accredited-provider-description'
    error.text = `Details about the accredited provider must be ${wordCount} words or fewer`
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/accredited-providers/description', {
      organisation,
      accreditedProvider,
      wordCount,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/${req.params.accreditedBodyId}/description?referrer=change`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers`
      },
      errors
    })
  } else {
    accreditedProviderModel.updateOne({
      organisationId: req.params.organisationId,
      accreditedBodyId: req.params.accreditedBodyId,
      accreditedBody: accreditedProvider
    })

    req.flash('success', 'About the accredited provider updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers`)
  }
}

// exports.edit_accredited_provider_permissions_get = (req, res) => {
//   const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
//   const accreditedBody = organisation.accreditedBodies.find(accreditedBody => accreditedBody.id === req.params.accreditedBodyId)

//   let selectedPermissions
//   if (accreditedBody && accreditedBody.permissions) {
//     selectedPermissions = accreditedBody.permissions
//   }

//   const permissionsOptions = permissionsHelper.getPermissionsOptions(selectedPermissions)

//   res.render('../views/accredited-providers/permissions', {
//     organisation,
//     accreditedBody,
//     permissionsOptions,
//     actions: {
//       save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/${req.params.accreditedBodyId}/permissions`,
//       back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers`,
//       cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers`
//     }
//   })
// }

// exports.edit_accredited_provider_permissions_post = (req, res) => {
//   const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
//   const accreditedBody = organisation.accreditedBodies.find(accreditedBody => accreditedBody.id === req.params.accreditedBodyId)
//   accreditedBody.permissions = req.session.data.accreditedBody.permissions

//   let selectedPermissions
//   if (accreditedBody && accreditedBody.permissions) {
//     selectedPermissions = accreditedBody.permissions
//   }

//   const permissionsOptions = permissionsHelper.getPermissionsOptions(selectedPermissions)

//   const errors = []

//   if (errors.length) {
//     res.render('../views/accredited-providers/permissions', {
//       organisation,
//       accreditedBody,
//       permissionsOptions,
//       actions: {
//         save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/${req.params.accreditedBodyId}/permissions`,
//         back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers`,
//         cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers`
//       },
//       errors
//     })
//   } else {
//     accreditedProviderModel.updateOne({
//       organisationId: req.params.organisationId,
//       accreditedBodyId: req.params.accreditedBodyId,
//       accreditedBody
//     })

//     req.flash('success', 'Accredited provider permissions updated')
//     res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers`)
//   }
// }

/// ------------------------------------------------------------------------ ///
/// NEW ACCREDITED PROVIDER
/// ------------------------------------------------------------------------ //

exports.new_accredited_provider_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const accreditedProvider = req.session.data.accreditedProvider

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new/check`
  }

  res.render('../views/accredited-providers/new', {
    organisation,
    accreditedProvider,
    actions: {
      save,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers`
    }
  })
}

exports.new_accredited_provider_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const accreditedProvider = req.session.data.accreditedProvider

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new/check`
  }

  const errors = []

  if (!req.session.data.accreditedProvider.name.length) {
    const error = {}
    error.fieldName = 'accredited-provider'
    error.href = '#accredited-provider'
    error.text = 'Enter a provider name, UKPRN or postcode'
    errors.push(error)
  } else if (
    organisationHelper.hasAccreditedProvider(
      req.params.organisationId,
      req.session.data.accreditedProvider.name
    )
  ) {
    const error = {}
    error.fieldName = 'accredited-provider'
    error.href = '#accredited-provider'
    error.text = `${req.session.data.accreditedProvider.name} has already been added`
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/accredited-providers/new', {
      organisation,
      accreditedProvider,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers`
      },
      errors
    })
  } else {

    // find the accredited provider details
    const accreditedProvider = organisationModel.findMany({
      isAccreditedBody: true,
      query: req.session.data.accreditedProvider.name
    })

    req.session.data.accreditedProvider.id = accreditedProvider[0].id
    req.session.data.accreditedProvider.code = accreditedProvider[0].code
    req.session.data.accreditedProvider.name = accreditedProvider[0].name

    if (req.query.referrer === 'check') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new/check`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new/description`)
    }
  }
}

exports.new_accredited_provider_choose_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const providers = organisationModel.findMany({
    isAccreditedBody: true,
    query: req.session.data.accreditedProvider.name
  })

  // store total number of results
  const providerCount = providers.length

  // parse the school results for use in macro
  let providerItems = []
  providers.forEach(provider => {
    const item = {}
    item.text = `${provider.name} (${provider.code})`
    item.value = provider.id
    providerItems.push(item)
  })

  // sort items alphabetically
  providerItems.sort((a,b) => {
    return a.text.localeCompare(b.text)
  })

  // only get the first 15 items
  providerItems = providerItems.slice(0,15)

  res.render("../views/accredited-providers/choose", {
    organisation,
    providerItems,
    providerCount,
    searchTerm: req.session.data.accreditedProvider.name,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new/choose`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers`
    }
  })
}

exports.new_accredited_provider_choose_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  const providers = organisationModel.findMany({
    isAccreditedBody: true,
    query: req.session.data.accreditedProvider.name
  })

  // store total number of results
  const providerCount = providers.length

  let selectedItem
  if (req.session.data.accreditedProvider?.id) {
    selectedItem = req.session.data.accreditedProvider.id
  }

  // parse the school results for use in macro
  let providerItems = []
  providers.forEach(provider => {
    const item = {}
    item.text = `${provider.name} (${provider.code})`
    item.value = provider.id
    item.checked = selectedItem?.includes(provider.id) ? 'checked' : ''
    providerItems.push(item)
  })

  // sort items alphabetically
  providerItems.sort((a,b) => {
    return a.text.localeCompare(b.text)
  })

  // only get the first 15 items
  providerItems = providerItems.slice(0,15)

  const errors = []

  // if (!selectedItem) {
    const error = {}
    error.fieldName = 'accredited-provider'
    error.href = '#accredited-provider'
    error.text = 'Select an accredited provider'
    errors.push(error)
  // } else if (
  //   organisationHelper.hasAccreditedProvider(
  //     req.params.organisationId,
  //     req.session.data.accreditedProvider.id
  //   )
  // ) {
  //   const accreditedProviderName = organisationHelper.getOrganisationLabel(
  //     req.session.data.accreditedProvider.id
  //   )

  //   const error = {}
  //   error.fieldName = 'accredited-provider'
  //   error.href = '#accredited-provider'
  //   error.text = `${accreditedProviderName} has already been added`
  //   errors.push(error)
  // }

  if (errors.length) {
    res.render("../views/accredited-providers/choose", {
      organisation,
      providerItems,
      providerCount,
      searchTerm: req.session.data.accreditedProvider.name,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new/choose`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers`
      },
      errors,
    })
  } else {
    const organisation = organisationModel.findOne({
      organisationId: req.session.data.accreditedProvider.id
    })

    req.session.data.accreditedProvider.id = organisation.id
    req.session.data.accreditedProvider.code = organisation.code
    req.session.data.accreditedProvider.name = organisation.name

    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new/description`)
  }
}

exports.new_accredited_provider_description_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const accreditedProvider = req.session.data.accreditedProvider

  const wordCount = 100

  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new`
  if (req.query.referrer === 'check') {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new/check`
  }

  res.render('../views/accredited-providers/description', {
    organisation,
    accreditedProvider,
    wordCount,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new/description`,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers`
    }
  })
}

exports.new_accredited_provider_description_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const accreditedProvider = req.session.data.accreditedProvider

  const wordCount = 100

  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new`
  if (req.query.referrer === 'check') {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new/check`
  }

  const errors = []

  if (!req.session.data.accreditedProvider.description.length) {
    const error = {}
    error.fieldName = 'accredited-provider-description'
    error.href = '#accredited-provider-description'
    error.text = 'Enter details about the accredited provider'
    errors.push(error)
  } else if (
    !validationHelper.isValidWordCount(req.session.data.accreditedProvider.description, wordCount)
  ) {
    const error = {}
    error.fieldName = 'accredited-provider-description'
    error.href = '#accredited-provider-description'
    error.text = `Details about the accredited provider must be ${wordCount} words or fewer`
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/accredited-providers/description', {
      organisation,
      accreditedProvider,
      wordCount,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new/description`,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new/check`)
  }
}

// exports.new_accredited_provider_permissions_get = (req, res) => {
//   const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

//   let selectedPermissions
//   if (req.session.data.accreditedBody && req.session.data.accreditedBody.permissions) {
//     selectedPermissions = req.session.data.accreditedBody.permissions
//   }

//   const permissionsOptions = permissionsHelper.getPermissionsOptions(selectedPermissions)

//   let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new/description`
//   if (req.query.referrer === 'check') {
//     back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new/check`
//   }

//   res.render('../views/accredited-providers/permissions', {
//     organisation,
//     accreditedBody: req.session.data.accreditedBody,
//     permissionsOptions,
//     actions: {
//       save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new/permissions`,
//       back,
//       cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers`
//     }
//   })
// }

// exports.new_accredited_provider_permissions_post = (req, res) => {
//   const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

//   let selectedPermissions
//   if (req.session.data.accreditedBody && req.session.data.accreditedBody.permissions) {
//     selectedPermissions = req.session.data.accreditedBody.permissions
//   }

//   const permissionsOptions = permissionsHelper.getPermissionsOptions(selectedPermissions)

//   let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new/description`
//   if (req.query.referrer === 'check') {
//     back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new/check`
//   }

//   const errors = []

//   if (errors.length) {
//     res.render('../views/accredited-providers/permissions', {
//       organisation,
//       accreditedBody: req.session.data.accreditedBody,
//       permissionsOptions,
//       actions: {
//         save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new/permissions`,
//         back,
//         cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers`
//       },
//       errors
//     })
//   } else {
//     res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new/check`)
//   }
// }

exports.new_accredited_provider_check_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  res.render('../views/accredited-providers/check-your-answers', {
    organisation,
    accreditedProvider: req.session.data.accreditedProvider,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new/check`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new/description`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/new`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers`
    }
  })
}

exports.new_accredited_provider_check_post = (req, res) => {
  accreditedProviderModel.insertOne({
    organisationId: req.params.organisationId,
    accreditedBody: req.session.data.accreditedProvider
  })

  req.flash('success', 'Accredited provider added')
  res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers`)
}

/// ------------------------------------------------------------------------ ///
/// DELETE ACCREDITED PROVIDER
/// ------------------------------------------------------------------------ ///

exports.delete_accredited_provider_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const accreditedBody = organisation.accreditedBodies.find(accreditedBody => accreditedBody.id === req.params.accreditedBodyId)

  const courses = courseModel
    .findMany({ organisationId: req.params.organisationId })
    .filter(course => course.accreditedBody.id === req.params.accreditedBodyId)

  const hasCourses = !!courses.length

  res.render('../views/accredited-providers/delete', {
    organisation,
    accreditedBody,
    hasCourses,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers/${req.params.accreditedBodyId}/delete`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers`
    }
  })
}

exports.delete_accredited_provider_post = (req, res) => {
  accreditedProviderModel.deleteOne({
    organisationId: req.params.organisationId,
    accreditedBodyId: req.params.accreditedBodyId
  })

  req.flash('success', 'Accredited provider removed')
  res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-providers`)
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
