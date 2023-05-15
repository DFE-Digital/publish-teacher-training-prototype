const organisationModel = require("../models/organisations")
const schoolModel = require("../models/schools")

const organisationHelper = require('../helpers/organisations')

/// ------------------------------------------------------------------------ ///
/// SCHOOLS
/// ------------------------------------------------------------------------ ///

exports.find_school_get = (req, res) => {
  delete req.session.data.school

  res.render("../views/examples/schools/find", {

    actions: {
      save: `/examples/schools/find`,
      back: `/examples/schools`,
      cancel: `/examples/schools`,
      edit: `/examples/schools/edit`
    },
  })
}

exports.find_school_post = (req, res) => {
  const errors = []

  if (!req.session.data.query.length) {
    const error = {}
    error.fieldName = 'query'
    error.href = '#query'
    error.text = 'Enter a school, university, college, URN or postcode'
    errors.push(error)
  }

  if (errors.length) {
    res.render("../views/examples/schools/find", {

      actions: {
        save: `/examples/schools/find`,
        back: `/examples/schools`,
        cancel: `/examples/schools`,
        edit: `/examples/schools/edit`
      },
      errors,
    })
  } else {

    // if (true) {
    //   res.redirect(
    //     `/examples/schools/edit`
    //   )
    // } else {
      res.redirect(
        `/examples/schools/choose`
      )
    // }

  }
}

exports.choose_school_get = (req, res) => {
  const schools = schoolModel.findMany({
    query: req.session.data.query
  })

  // store total number of results
  const schoolCount = schools.length

  // parse the school results for use in macro
  let schoolItems = []
  schools.forEach(school => {
    const item = {}
    item.text = school.name
    item.value = school.urn
    item.hint = {
      text: `${school.address.town}, ${school.address.postcode}`
    }
    schoolItems.push(item)
  })

  // sort items alphabetically
  schoolItems.sort((a,b) => {
    return a.text.localeCompare(b.text)
  })

  // only get the first 15 items
  schoolItems = schoolItems.slice(0,15)

  res.render("../views/examples/schools/choose", {
    schoolItems,
    schoolCount,
    searchTerm: req.session.data.query,
    actions: {
      save: `/examples/schools/choose`,
      back: `/examples/schools/find`,
      cancel: `/examples/schools`,
    },
  })
}

exports.choose_school_post = (req, res) => {
  const schools = schoolModel.findMany({
    query: req.session.data.query
  })

  // store total number of results
  const schoolCount = schools.length

  // parse the school results for use in macro
  let schoolItems = []
  schools.forEach(school => {
    const item = {}
    item.text = school.name
    item.value = school.urn
    item.hint = {
      text: `${school.address.town}, ${school.address.postcode}`
    }
    schoolItems.push(item)
  })

  // sort items alphabetically
  schoolItems.sort((a,b) => {
    return a.text.localeCompare(b.text)
  })

  // only get the first 15 items
  schoolItems = schoolItems.slice(0,15)

  const errors = []

  if (!req.session.data.school) {
    const error = {}
    error.fieldName = 'school'
    error.href = '#school'
    error.text = 'Select a school'
    errors.push(error)
  }

  if (errors.length) {
    res.render("../views/examples/schools/choose", {
      schoolItems,
      schoolCount,
      searchTerm: req.session.data.query,
      actions: {
        save: `/examples/schools/choose`,
        back: `/examples/schools/find`,
        cancel: `/examples/schools`,
      },
      errors,
    })
  } else {
    res.redirect(
      `/examples/schools/edit`
    )
  }
}

exports.edit_school_get = (req, res) => {
  let location = {}
  if (req.session.data.location) {
    location = req.session.data.location
  } else {
   location = schoolModel.findOne({ urn: req.session.data.school })
  }

  res.render("../views/examples/schools/edit", {
    location,
    actions: {
      save: `/examples/schools/edit`,
      back: `/examples/schools`,
      cancel: `/examples/schools`,
    },
  })
}

exports.edit_school_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render("../views/examples/schools/edit", {

      actions: {
        save: `/examples/schools/edit`,
        back: `/examples/schools`,
        cancel: `/examples/schools`,
      },
      errors,
    })
  } else {

  }
}

/// ------------------------------------------------------------------------ ///
/// STUDY SITES
/// ------------------------------------------------------------------------ ///

exports.find_study_site_get = (req, res) => {
  delete req.session.data.school

  res.render("../views/examples/study-sites/find", {

    actions: {
      save: `/examples/study-sites/find`,
      back: `/examples/study-sites`,
      cancel: `/examples/study-sites`,
      edit: `/examples/study-sites/edit`
    },
  })
}

exports.find_study_site_post = (req, res) => {
  const errors = []

  if (!req.session.data.query.length) {
    const error = {}
    error.fieldName = 'query'
    error.href = '#query'
    error.text = 'Enter a school, university, college, URN or postcode'
    errors.push(error)
  }

  if (errors.length) {
    res.render("../views/examples/study-sites/find", {

      actions: {
        save: `/examples/study-sites/find`,
        back: `/examples/study-sites`,
        cancel: `/examples/study-sites`,
        edit: `/examples/study-sites/edit`
      },
      errors,
    })
  } else {

    // if (true) {
    //   res.redirect(
    //     `/examples/study-sites/edit`
    //   )
    // } else {
      res.redirect(
        `/examples/study-sites/choose`
      )
    // }

  }
}

exports.choose_study_site_get = (req, res) => {
  const schools = schoolModel.findMany({
    query: req.session.data.query
  })

  // store total number of results
  const schoolCount = schools.length

  // parse the school results for use in macro
  let schoolItems = []
  schools.forEach(school => {
    const item = {}
    item.text = school.name
    item.value = school.urn
    item.hint = {
      text: `${school.address.town}, ${school.address.postcode}`
    }
    schoolItems.push(item)
  })

  // sort items alphabetically
  schoolItems.sort((a,b) => {
    return a.text.localeCompare(b.text)
  })

  // only get the first 15 items
  schoolItems = schoolItems.slice(0,15)

  res.render("../views/examples/study-sites/choose", {
    schoolItems,
    schoolCount,
    searchTerm: req.session.data.query,
    actions: {
      save: `/examples/study-sites/choose`,
      back: `/examples/study-sites/find`,
      cancel: `/examples/study-sites`,
    },
  })
}

exports.choose_study_site_post = (req, res) => {
  const schools = schoolModel.findMany({
    query: req.session.data.query
  })

  // store total number of results
  const schoolCount = schools.length

  // parse the school results for use in macro
  let schoolItems = []
  schools.forEach(school => {
    const item = {}
    item.text = school.name
    item.value = school.urn
    item.hint = {
      text: `${school.address.town}, ${school.address.postcode}`
    }
    schoolItems.push(item)
  })

  // sort items alphabetically
  schoolItems.sort((a,b) => {
    return a.text.localeCompare(b.text)
  })

  // only get the first 15 items
  schoolItems = schoolItems.slice(0,15)

  const errors = []

  if (!req.session.data.school) {
    const error = {}
    error.fieldName = 'school'
    error.href = '#school'
    error.text = 'Select a study site'
    errors.push(error)
  }

  if (errors.length) {
    res.render("../views/examples/study-sites/choose", {
      schoolItems,
      schoolCount,
      searchTerm: req.session.data.query,
      actions: {
        save: `/examples/study-sites/choose`,
        back: `/examples/study-sites/find`,
        cancel: `/examples/study-sites`,
      },
      errors,
    })
  } else {
    res.redirect(
      `/examples/study-sites/edit`
    )
  }
}

exports.edit_study_site_get = (req, res) => {
  let location = {}
  if (req.session.data.location) {
    location = req.session.data.location
  } else {
   location = schoolModel.findOne({ urn: req.session.data.school })
  }

  res.render("../views/examples/study-sites/edit", {
    location,
    actions: {
      save: `/examples/study-sites/edit`,
      back: `/examples/study-sites`,
      cancel: `/examples/study-sites`,
    },
  })
}

exports.edit_study_site_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render("../views/examples/study-sites/edit", {

      actions: {
        save: `/examples/study-sites/edit`,
        back: `/examples/study-sites`,
        cancel: `/examples/study-sites`,
      },
      errors,
    })
  } else {

  }
}

/// ------------------------------------------------------------------------ ///
/// ACCREDITED PROVIDERS
/// ------------------------------------------------------------------------ ///

exports.find_accredited_provider_get = (req, res) => {
  delete req.session.data.school

  res.render("../views/examples/accredited-providers/find", {

    actions: {
      save: `/examples/accredited-providers/find`,
      back: `/examples/accredited-providers`,
      cancel: `/examples/accredited-providers`
    },
  })
}

exports.find_accredited_provider_post = (req, res) => {
  const errors = []

  if (!req.session.data.accreditedProvider.name.length) {
    const error = {}
    error.fieldName = 'accredited-provider'
    error.href = '#accredited-provider'
    error.text = 'Enter a provider name, UKPRN or postcode'
    errors.push(error)
  }

  if (errors.length) {
    res.render("../views/examples/accredited-providers/find", {

      actions: {
        save: `/examples/accredited-providers/find`,
        back: `/examples/accredited-providers`,
        cancel: `/examples/accredited-providers`
      },
      errors,
    })
  } else {
    res.redirect(`/examples/accredited-providers/choose`)
  }
}

exports.choose_accredited_provider_get = (req, res) => {
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

  res.render("../views/examples/accredited-providers/choose", {
    providerItems,
    providerCount,
    searchTerm: req.session.data.accreditedProvider.name,
    actions: {
      save: `/examples/accredited-providers/choose`,
      back: `/examples/accredited-providers/find`,
      cancel: `/examples/accredited-providers`,
    },
  })
}

exports.choose_accredited_provider_post = (req, res) => {
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

  if (!selectedItem) {
    const error = {}
    error.fieldName = 'accredited-provider'
    error.href = '#accredited-provider'
    error.text = 'Select an accredited provider'
    errors.push(error)
  } else if (
    organisationHelper.hasAccreditedProvider(
      '96d90282-3ce7-4fc7-aa60-e03d7bf8a0f1',
      req.session.data.accreditedProvider.id
    )
  ) {
    const accreditedProviderName = organisationHelper.getOrganisationLabel(
      req.session.data.accreditedProvider.id
    )

    const error = {}
    error.fieldName = 'accredited-provider'
    error.href = '#accredited-provider'
    error.text = `${accreditedProviderName} has already been added`
    errors.push(error)
  }

  if (errors.length) {
    res.render("../views/examples/accredited-providers/choose", {
      providerItems,
      providerCount,
      searchTerm: req.session.data.accreditedProvider.name,
      actions: {
        save: `/examples/accredited-providers/choose`,
        back: `/examples/accredited-providers/find`,
        cancel: `/examples/accredited-providers`,
      },
      errors,
    })
  } else {
    res.send('NOT IMPLEMENTED')
  }
}
